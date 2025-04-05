import React, { useState, useEffect } from "react";
import axios from "axios";

function PersonnelPage() {
  const [personnel, setPersonnel] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    SSN: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    medicare_number: "",
    phone_number: "",
    email_address: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    mandate: "Volunteer",
  });

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = () => {
    axios.get("http://localhost:3001/personnel")
      .then((res) => setPersonnel(res.data))
      .catch((err) => console.error("Fetch error:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const request = editingId
      ? axios.put(`http://localhost:3001/personnel/${editingId}`, form)
      : axios.post("http://localhost:3001/personnel", form);

    request
      .then(() => {
        fetchPersonnel();
        resetForm();
      })
      .catch((err) => console.error("Submit error:", err));
  };

  const handleEdit = (person) => {
    setForm(person);
    setEditingId(person.personnel_ID);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`http://localhost:3001/personnel/${id}`)
        .then(() => fetchPersonnel())
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const resetForm = () => {
    setForm({
      SSN: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      medicare_number: "",
      phone_number: "",
      email_address: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      mandate: "Volunteer",
    });
    setEditingId(null);
  };

  return (
    <div>
      <h2>Personnel</h2>
      <form onSubmit={handleSubmit}>
        <input name="SSN" value={form.SSN} onChange={handleChange} placeholder="SSN" required />
        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
        <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required />
        <input name="medicare_number" value={form.medicare_number} onChange={handleChange} placeholder="Medicare Number" required />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" />
        <input name="email_address" value={form.email_address} onChange={handleChange} placeholder="Email Address" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
        <input name="province" value={form.province} onChange={handleChange} placeholder="Province" />
        <input name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="Postal Code" />
        <select name="mandate" value={form.mandate} onChange={handleChange}>
          <option value="Volunteer">Volunteer</option>
          <option value="Salaried">Salaried</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Personnel</button>
      </form>

      <ul>
        {personnel.map((p) => (
          <li key={p.personnel_ID}>
            {p.first_name} {p.last_name} ({p.mandate}) – {p.email_address}
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.personnel_ID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PersonnelPage;
