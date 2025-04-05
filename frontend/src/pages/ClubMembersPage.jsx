import React, { useState, useEffect } from "react";
import axios from "axios";

function ClubMembersPage() {
  const [members, setMembers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [families, setFamilies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    height: "",
    weight: "",
    phone_number: "",
    SSN: "",
    medicare_number: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    family_member_id: "",
    location_ID: ""
  });

  useEffect(() => {
    fetchMembers();
    fetchLocations();
    fetchFamilies();
  }, []);

  const fetchMembers = () => {
    axios.get("http://localhost:3001/club-members")
      .then(res => setMembers(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const fetchLocations = () => {
    axios.get("http://localhost:3001/locations")
      .then(res => setLocations(res.data))
      .catch(err => console.error("Location fetch error:", err));
  };

  const fetchFamilies = () => {
    axios.get("http://localhost:3001/family-members")
      .then(res => setFamilies(res.data))
      .catch(err => console.error("Family fetch error:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isValidAge = (dob) => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age >= 11 && age <= 18;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidAge(form.date_of_birth)) {
      alert("Club member must be between 11 and 18 years old.");
      return;
    }

    const request = editingId
      ? axios.put(`http://localhost:3001/club-members/${editingId}`, form)
      : axios.post("http://localhost:3001/club-members", form);

    request
      .then(() => {
        fetchMembers();
        resetForm();
      })
      .catch(err => {
        console.error("Submit error:", err);
        alert("Error saving club member.");
      });
  };

  const handleEdit = (m) => {
    setForm(m);
    setEditingId(m.CMN);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this club member?")) {
      axios.delete(`http://localhost:3001/club-members/${id}`)
        .then(() => fetchMembers())
        .catch(err => console.error("Delete error:", err));
    }
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      date_of_birth: "",
      height: "",
      weight: "",
      phone_number: "",
      SSN: "",
      medicare_number: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      family_member_id: "",
      location_ID: ""
    });
    setEditingId(null);
  };

  return (
    <div>
      <h2>Club Members</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
        <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required />
        <input name="height" type="number" step="0.01" value={form.height} onChange={handleChange} placeholder="Height (cm)" required />
        <input name="weight" type="number" step="0.01" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" required />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone" />
        <input name="SSN" value={form.SSN} onChange={handleChange} placeholder="SSN" />
        <input name="medicare_number" value={form.medicare_number} onChange={handleChange} placeholder="Medicare #" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
        <input name="province" value={form.province} onChange={handleChange} placeholder="Province" />
        <input name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="Postal Code" />

        <select name="family_member_id" value={form.family_member_id} onChange={handleChange} required>
          <option value="">Select Family Member</option>
          {families.map(f => (
            <option key={f.family_member_ID} value={f.family_member_ID}>
              {f.first_name} {f.last_name}
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

        <button type="submit">{editingId ? "Update" : "Add"} Club Member</button>
      </form>

      <h3>Existing Club Members</h3>
      <ul>
        {members.map((m) => (
          <li key={m.CMN}>
            {m.first_name} {m.last_name} – {m.date_of_birth}
            <button onClick={() => handleEdit(m)}>Edit</button>
            <button onClick={() => handleDelete(m.CMN)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClubMembersPage;
