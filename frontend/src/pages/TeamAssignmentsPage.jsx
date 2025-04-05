import React, { useState, useEffect } from "react";
import axios from "axios";

function TeamAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editing, setEditing] = useState(null); // { id, date }
  const [form, setForm] = useState({
    CMN: "",
    team_ID: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    fetchAssignments();
    fetchMembers();
    fetchTeams();
  }, []);

  const fetchAssignments = () => {
    axios.get("http://localhost:3001/team-assignments")
      .then(res => setAssignments(res.data))
      .catch(err => console.error("Fetch assignments error:", err));
  };

  const fetchMembers = () => {
    axios.get("http://localhost:3001/club-members")
      .then(res => setMembers(res.data))
      .catch(err => console.error("Fetch club members error:", err));
  };

  const fetchTeams = () => {
    axios.get("http://localhost:3001/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error("Fetch teams error:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editing
      ? axios.put(`http://localhost:3001/team-assignments/${editing.id}/${editing.date}`, form)
      : axios.post("http://localhost:3001/team-assignments", form);

    request
      .then(() => {
        fetchAssignments();
        resetForm();
      })
      .catch(err => {
        console.error("Submit error:", err);
        alert("Assignment failed. Check for date overlap or constraint.");
      });
  };

  const handleEdit = (a) => {
    setForm(a);
    setEditing({ id: a.CMN, date: a.start_date });
  };

  const handleDelete = (id, date) => {
    if (window.confirm("Delete this assignment?")) {
      axios.delete(`http://localhost:3001/team-assignments/${id}/${date}`)
        .then(() => fetchAssignments())
        .catch(err => console.error("Delete error:", err));
    }
  };

  const resetForm = () => {
    setForm({ CMN: "", team_ID: "", start_date: "", end_date: "" });
    setEditing(null);
  };

  return (
    <div>
      <h2>Team Assignments</h2>
      <form onSubmit={handleSubmit}>
        <select name="CMN" value={form.CMN} onChange={handleChange} required>
          <option value="">Select Club Member</option>
          {members.map(m => (
            <option key={m.CMN} value={m.CMN}>
              {m.first_name} {m.last_name}
            </option>
          ))}
        </select>

        <select name="team_ID" value={form.team_ID} onChange={handleChange} required>
          <option value="">Select Team</option>
          {teams.map(t => (
            <option key={t.team_ID} value={t.team_ID}>
              {t.team_name}
            </option>
          ))}
        </select>

        <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
        <input name="end_date" type="date" value={form.end_date} onChange={handleChange} />

        <button type="submit">{editing ? "Update" : "Assign"} Member</button>
      </form>

      <h3>Assignments</h3>
      <ul>
        {assignments.map((a, i) => (
          <li key={i}>
            Member #{a.CMN} → Team #{a.team_ID} ({a.start_date} to {a.end_date || "Ongoing"})
            <button onClick={() => handleEdit(a)}>Edit</button>
            <button onClick={() => handleDelete(a.CMN, a.start_date)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamAssignmentsPage;
