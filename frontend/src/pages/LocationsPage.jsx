import React, { useState, useEffect } from "react";
import axios from "axios";

function LocationsPage() {
  const [editingId, setEditingId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "Head",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    phone_number: "",
    web_address: "",
    max_capacity: 1, // must be > 0 or doesnt work
  });

  // 🔁 Fetch locations from backend
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    axios.get("http://localhost:3001/locations")
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
      });
  };

  // 📤 Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (editingId) {
      // 📝 UPDATE
      axios.put(`http://localhost:3001/locations/${editingId}`, form)
        .then(() => {
          alert("Location updated!");
          resetForm();
          fetchLocations();
        })
        .catch((err) => {
          console.error("Update error:", err);
          alert("Update failed.");
        });
    } else {
      // ➕ CREATE
      axios.post("http://localhost:3001/locations", form)
        .then(() => {
          alert("Location added!");
          resetForm();
          fetchLocations();
        })
        .catch((err) => {
          console.error("Insert error:", err);
          alert("Insert failed.");
        });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      type: "Head",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      phone_number: "",
      web_address: "",
      max_capacity: 1,
    });
    setEditingId(null);
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>Locations</h2>

      {/* 📋 Create Location Form */}
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Location Name" required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="Head">Head</option>
          <option value="Branch">Branch</option>
        </select>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
        <input name="province" value={form.province} onChange={handleChange} placeholder="Province" />
        <input name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="Postal Code" />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" />
        <input name="web_address" value={form.web_address} onChange={handleChange} placeholder="Web Address" />
        <input name="max_capacity" type="number" value={form.max_capacity} onChange={handleChange} placeholder="Max Capacity" />
        <button type="submit">Add Location</button>
      </form>

      {/* 📋 List Locations */}
      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <ul>
  {locations.map((loc) => (
    <li key={loc.location_ID}>
      {loc.name} ({loc.type}) – {loc.city}, {loc.province}
      <button onClick={() => {
        setForm(loc);           // fill form with existing values
        setEditingId(loc.location_ID); // flag as editing
      }}>Edit</button>

      <button onClick={() => {
        if (window.confirm("Are you sure you want to delete this location?")) {
          axios.delete(`http://localhost:3001/locations/${loc.location_ID}`)
            .then(() => {
              alert("Location deleted!");
              fetchLocations();
            })
            .catch((err) => {
              console.error("Delete error:", err);
              alert("Delete failed.");
            });
        }
      }}>Delete</button>
    </li>
  ))}
</ul>

      )}
    </div>
    
  );

 
  


}


export default LocationsPage;
