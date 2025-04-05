import React, { useEffect, useState } from "react";
import axios from "axios";

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    team_name: "",
    category: "Boys",
    location_ID: ""
  });

  useEffect(() => {
    fetchTeams();
    fetchLocations();
  }, []);

  const fetchTeams = () => {
    axios.get("http://localhost:3001/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error("Fetch teams error:", err));
  };

  const fetchLocations = () => {
    axios.get("http://localhost:3001/locations")
      .then(res => setLocations(res.data))
      .catch(err => console.error("Fetch locations error:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingId
      ? axios.put(`http://localhost:3001/teams/${editingId}`, form)
      : axios.post("http://localhost:3001/teams", form);

    request.then(() => {
      fetchTeams();
      resetForm();
    }).catch(err => {
      console.error("Submit error:", err);
      alert("Error saving team.");
    });
  };

  const handleEdit = (t) => {
    setForm(t);
    setEditingId(t.team_ID);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this team?")) {
      axios.delete(`http://localhost:3001/teams/${id}`)
        .then(() => fetchTeams())
        .catch(err => console.error("Delete error:", err));
    }
  };

  const resetForm = () => {
    setForm({ team_name: "", category: "Boys", location_ID: "" });
    setEditingId(null);
  };

  return (
    <div>
      <h2>Teams</h2>
      <form onSubmit={handleSubmit}>
        <input name="team_name" value={form.team_name} onChange={handleChange} placeholder="Team Name" required />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
        </select>
        <select name="location_ID" value={form.location_ID} onChange={handleChange} required>
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc.location_ID} value={loc.location_ID}>
              {loc.name}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Team</button>
      </form>

      <h3>Existing Teams</h3>
      <ul>
        {teams.map((t) => (
          <li key={t.team_ID}>
            {t.team_name} ({t.category}) – Location #{t.location_ID}
            <button onClick={() => handleEdit(t)}>Edit</button>
            <button onClick={() => handleDelete(t.team_ID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamsPage;
