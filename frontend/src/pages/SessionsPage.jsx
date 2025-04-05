import React, { useEffect, useState } from "react";
import axios from "axios";

function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    personnel_id: "",
    session_date: "",
    start_time: "",
    end_time: "",
    type: "Training",
    address: "",
  });

  useEffect(() => {
    fetchSessions();
    fetchPersonnel();
  }, []);

  const fetchSessions = () => {
    axios.get("http://localhost:3001/sessions")
      .then(res => setSessions(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const fetchPersonnel = () => {
    axios.get("http://localhost:3001/personnel")
      .then(res => setPersonnel(res.data))
      .catch(err => console.error("Fetch personnel error:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      personnel_id: form.personnel_id === "" ? null : form.personnel_id
    };

    const request = editingId
      ? axios.put(`http://localhost:3001/sessions/${editingId}`, payload)
      : axios.post("http://localhost:3001/sessions", payload);

    request
      .then(() => {
        fetchSessions();
        resetForm();
      })
      .catch(err => {
        console.error("Submit error:", err);
        alert("Error submitting session.");
      });
  };

  const handleEdit = (s) => {
    setForm(s);
    setEditingId(s.session_id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this session?")) {
      axios.delete(`http://localhost:3001/sessions/${id}`)
        .then(() => fetchSessions())
        .catch(err => console.error("Delete error:", err));
    }
  };

  const resetForm = () => {
    setForm({
      personnel_id: "",
      session_date: "",
      start_time: "",
      end_time: "",
      type: "Training",
      address: "",
    });
    setEditingId(null);
  };

  return (
    <div>
      <h2>Sessions</h2>

      <form onSubmit={handleSubmit}>
        <select name="personnel_id" value={form.personnel_id} onChange={handleChange}>
          <option value="">Unassigned</option>
          {personnel.map(p => (
            <option key={p.personnel_ID} value={p.personnel_ID}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>

        <input name="session_date" type="date" value={form.session_date} onChange={handleChange} required />
        <input name="start_time" type="time" value={form.start_time} onChange={handleChange} required />
        <input name="end_time" type="time" value={form.end_time} onChange={handleChange} required />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="Training">Training</option>
          <option value="Game">Game</option>
        </select>

        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />

        <button type="submit">{editingId ? "Update" : "Add"} Session</button>
      </form>

      <h3>Scheduled Sessions</h3>
      <ul>
        {sessions.map((s) => (
          <li key={s.session_id}>
            [{s.type}] {s.session_date} {s.start_time}–{s.end_time} @ {s.address} (Coach #{s.personnel_id || "-"})
            <button onClick={() => handleEdit(s)}>Edit</button>
            <button onClick={() => handleDelete(s.session_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionsPage;
