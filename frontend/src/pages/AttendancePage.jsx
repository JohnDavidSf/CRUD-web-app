import React, { useEffect, useState } from "react";
import axios from "axios";

function AttendancePage() {
  const [participations, setParticipations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [clubMembers, setClubMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editing, setEditing] = useState(null); // { session_ID, CMN }

  const [form, setForm] = useState({
    session_ID: "",
    CMN: "",
    team_ID: "",
    role: "Setter"
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    axios.get("http://localhost:3001/participations").then(res => setParticipations(res.data));
    axios.get("http://localhost:3001/sessions").then(res => setSessions(res.data));
    axios.get("http://localhost:3001/club-members").then(res => setClubMembers(res.data));
    axios.get("http://localhost:3001/teams").then(res => setTeams(res.data));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editing
      ? `http://localhost:3001/participations/${editing.session_ID}/${editing.CMN}`
      : "http://localhost:3001/participations";

    const method = editing ? axios.put : axios.post;

    method(url, form)
      .then(() => {
        fetchAll();
        resetForm();
      })
      .catch((err) => {
        console.error("Error submitting participation:", err);
        alert("Participation failed.");
      });
  };

  const resetForm = () => {
    setForm({ session_ID: "", CMN: "", team_ID: "", role: "Setter" });
    setEditing(null);
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditing({ session_ID: p.session_ID, CMN: p.CMN });
  };

  const handleDelete = (session_ID, CMN) => {
    if (window.confirm("Remove this player from the session?")) {
      axios.delete(`http://localhost:3001/participations/${session_ID}/${CMN}`)
        .then(() => fetchAll())
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Delete failed.");
        });
    }
  };

  return (
    <div>
      <h2>Attendance (Session Participation)</h2>

      <form onSubmit={handleSubmit}>
        <select name="session_ID" value={form.session_ID} onChange={handleChange} required>
          <option value="">Select Session</option>
          {sessions.map(s => (
            <option key={s.session_id} value={s.session_id}>
              [{s.type}] {s.session_date} ({s.start_time}–{s.end_time})
            </option>
          ))}
        </select>

        <select name="CMN" value={form.CMN} onChange={handleChange} required>
          <option value="">Select Club Member</option>
          {clubMembers.map(m => (
            <option key={m.CMN} value={m.CMN}>
              {m.first_name} {m.last_name}
            </option>
          ))}
        </select>

        <select name="team_ID" value={form.team_ID} onChange={handleChange} required>
          <option value="">Select Team</option>
          {teams.map(t => (
            <option key={t.team_ID} value={t.team_ID}>{t.team_name}</option>
          ))}
        </select>

        <select name="role" value={form.role} onChange={handleChange}>
          <option>Setter</option>
          <option>Libero</option>
          <option>Middle Blocker</option>
          <option>Outside Hitter</option>
          <option>Opposite</option>
          <option>Defensive Specialist</option>
          <option>Serving Specialist</option>
        </select>

        <button type="submit">{editing ? "Update" : "Add"} Attendance</button>
      </form>

      <h3>Participation List</h3>
      <ul>
        {participations.map((p, i) => (
          <li key={i}>
            Session #{p.session_ID} → Member #{p.CMN} (Team #{p.team_ID}, Role: {p.role})
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.session_ID, p.CMN)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendancePage;
