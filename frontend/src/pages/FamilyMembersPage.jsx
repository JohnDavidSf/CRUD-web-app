import React, { useState, useEffect } from "react";
import axios from "axios";

function FamilyMembersPage() {
  const [members, setMembers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    SSN: "",
    medicare_number: "",
    phone_number: "",
    email_address: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    location_ID: ""
  });

  useEffect(() => {
    fetchMembers();
    fetchLocations();
  }, []);

  const fetchMembers = () => {
    axios.get("http://localhost:3001/family-members")
      .then(res => setMembers(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const fetchLocations = () => {
    axios.get("http://localhost:3001/locations")
      .then(res => setLocations(res.data))
      .catch(err => console.error("Location fetch error:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingId
      ? axios.put(`http://localhost:3001/family-members/${editingId}`, form)
      : axios.post("http://localhost:3001/family-members", form);

    request
      .then(() => {
        fetchMembers();
        resetForm();
      })
      .catch(err => {
        console.error("Submit error:", err);
        alert("Error saving family member.");
      });
  };

  const handleEdit = (m) => {
    setForm(m);
    setEditingId(m.family_member_ID);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this family member?")) {
      axios.delete(`http://localhost:3001/family-members/${id}`)
        .then(() => fetchMembers())
        .catch(err => console.error("Delete error:", err));
    }
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      date_of_birth: "",
      SSN: "",
      medicare_number: "",
      phone_number: "",
      email_address: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      location_ID: ""
    });
    setEditingId(null);
  };

  return (
    <div>
      <h2>Family Members</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
        <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required />
        <input name="SSN" value={form.SSN} onChange={handleChange} placeholder="SSN" required />
        <input name="medicare_number" value={form.medicare_number} onChange={handleChange} placeholder="Medicare #" required />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone" />
        <input name="email_address" value={form.email_address} onChange={handleChange} placeholder="Email" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
        <input name="province" value={form.province} onChange={handleChange} placeholder="Province" />
        <input name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="Postal Code" />

        <select name="location_ID" value={form.location_ID} onChange={handleChange} required>
          <option value="">Select Location</option>
          {locations.map(l => (
            <option key={l.location_ID} value={l.location_ID}>
              {l.name}
            </option>
          ))}
        </select>

        <button type="submit">{editingId ? "Update" : "Add"} Family Member</button>
      </form>

      <h3>Existing Family Members</h3>
      <ul>
        {members.map((m) => (
          <li key={m.family_member_ID}>
            {m.first_name} {m.last_name} – {m.email_address}
            <button onClick={() => handleEdit(m)}>Edit</button>
            <button onClick={() => handleDelete(m.family_member_ID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FamilyMembersPage;
