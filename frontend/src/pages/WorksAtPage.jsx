import React, { useState, useEffect } from "react";
import axios from "axios";

function WorksAtPage() {
  const [assignments, setAssignments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [form, setForm] = useState({
    personnel_ID: "",
    location_ID: "",
    start_date: "",
    end_date: "",
    role: "Administrator",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchLocations();
    fetchPersonnel();
  }, []);

  const fetchAssignments = () => {
    axios.get("http://localhost:3001/worksAt")
      .then(res => setAssignments(res.data))
      .catch(err => console.error("Fetch assignments error:", err));
  };

  const fetchLocations = () => {
    axios.get("http://localhost:3001/locations")
      .then(res => setLocations(res.data))
      .catch(err => console.error("Fetch locations error:", err));
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

    const request = isEditing
      ? axios.put("http://localhost:3001/worksAt", form)
      : axios.post("http://localhost:3001/worksAt", form);

    request
      .then(() => {
        fetchAssignments();
        resetForm();
      })
      .catch(err => {
        console.error("Submit error:", err);
        alert("Error assigning personnel.");
      });
  };

  const handleEdit = (a) => {
    setForm(a);
    setIsEditing(true);
  };

  const handleDelete = (personnel_ID, start_date) => {
    if (window.confirm("Delete this assignment?")) {
      axios.delete("http://localhost:3001/worksAt", {
        data: { personnel_ID, start_date }
      })
        .then(() => fetchAssignments())
        .catch(err => console.error("Delete error:", err));
    }
  };

  const resetForm = () => {
    setForm({
      personnel_ID: "",
      location_ID: "",
      start_date: "",
      end_date: "",
      role: "Administrator",
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>Assign Personnel to Location</h2>
      <form onSubmit={handleSubmit}>
        <select name="personnel_ID" value={form.personnel_ID} onChange={handleChange} required>
          <option value="">Select Personnel</option>
          {personnel.map(p => (
            <option key={p.personnel_ID} value={p.personnel_ID}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>

        <select name="location_ID" value={form.location_ID} onChange={handleChange} required>
          <option value="">Select Location</option>
          {locations.map(l => (
            <option key={l.location_ID} value={l.location_ID}>
              {l.name}
            </option>
          ))}
        </select>

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Administrator">Administrator</option>
          <option value="General Manager">General Manager</option>
          <option value="Deputy manager">Deputy manager</option>
          <option value="Treasurer">Treasurer</option>
          <option value="Secretary">Secretary</option>
          <option value="Captain">Captain</option>
          <option value="Coach">Coach</option>
          <option value="Assistant Coach">Assistant Coach</option>
          <option value="Other">Other</option>
        </select>

        <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
        <input name="end_date" type="date" value={form.end_date} onChange={handleChange} />

        <button type="submit">{isEditing ? "Update" : "Assign"}</button>
      </form>

      <h3>Current Assignments</h3>
      <ul>
        {assignments.map((a, idx) => (
          <li key={idx}>
            {a.personnel_first_name} {a.personnel_last_name} → {a.location_name} ({a.role})  
            [{a.start_date} to {a.end_date || "Ongoing"}]
            <button onClick={() => handleEdit(a)}>Edit</button>
            <button onClick={() => handleDelete(a.personnel_ID, a.start_date)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorksAtPage;
