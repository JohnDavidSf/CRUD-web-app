import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [clubMembers, setClubMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    family_member_ID: "",
    CMN: "",
    payment_date: "",
    payment_amount: "",
    donations: 0,
    installment_num: "",
    payment_method: "Cash",
    membership_payment_date: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:3001/payments").then((res) => {
      setPayments(res.data);
    });
    axios.get("http://localhost:3001/family-members").then((res) => {
      setFamilyMembers(res.data);
    });
    axios.get("http://localhost:3001/club-members").then((res) => {
      setClubMembers(res.data);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      CMN: form.CMN === "" ? null : form.CMN,
      family_member_ID: form.family_member_ID === "" ? null : form.family_member_ID,
      donations: parseFloat(form.donations || 0),
    };

    const request = editingId
      ? axios.put(`http://localhost:3001/payments/${editingId}`, payload)
      : axios.post("http://localhost:3001/payments", payload);

    request
      .then(() => {
        fetchData();
        resetForm();
      })
      .catch((err) => {
        console.error("Submit error:", err);
        alert("Error submitting payment.");
      });
  };

  const resetForm = () => {
    setForm({
      family_member_ID: "",
      CMN: "",
      payment_date: "",
      payment_amount: "",
      donations: 0,
      installment_num: "",
      payment_method: "Cash",
      membership_payment_date: new Date().getFullYear(),
    });
    setEditingId(null);
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditingId(p.payment_ID);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this payment?")) {
      axios.delete(`http://localhost:3001/payments/${id}`)
        .then(() => fetchData())
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Delete failed.");
        });
    }
  };

  return (
    <div>
      <h2>Payments</h2>

      <form onSubmit={handleSubmit}>
        <label>Family Member:</label>
        <select name="family_member_ID" value={form.family_member_ID} onChange={handleChange}>
          <option value="">None</option>
          {familyMembers.map(f => (
            <option key={f.family_member_ID} value={f.family_member_ID}>
              {f.first_name} {f.last_name}
            </option>
          ))}
        </select>

        <label>Club Member (optional):</label>
        <select name="CMN" value={form.CMN} onChange={handleChange}>
          <option value="">None</option>
          {clubMembers.map(c => (
            <option key={c.CMN} value={c.CMN}>
              {c.first_name} {c.last_name}
            </option>
          ))}
        </select>

        <input name="payment_date" type="date" value={form.payment_date} onChange={handleChange} required />
        <input name="payment_amount" type="number" value={form.payment_amount} onChange={handleChange} placeholder="Amount" required />
        <input name="donations" type="number" value={form.donations} onChange={handleChange} placeholder="Donations" />

        <select name="installment_num" value={form.installment_num} onChange={handleChange}>
          <option value="">None</option>
          <option value="1">1st Installment</option>
          <option value="2">2nd Installment</option>
          <option value="3">3rd Installment</option>
          <option value="4">4th Installment</option>
        </select>

        <select name="payment_method" value={form.payment_method} onChange={handleChange}>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Cash</option>
          <option>Online Transfer</option>
        </select>

        <input name="membership_payment_date" type="number" value={form.membership_payment_date} onChange={handleChange} placeholder="Membership Year" required />

        <button type="submit">{editingId ? "Update" : "Add"} Payment</button>
      </form>

      <h3>Payment Records</h3>
      <ul>
        {payments.map((p) => (
          <li key={p.payment_ID}>
            #{p.payment_ID} → ${p.payment_amount} by Family #{p.family_member_ID || "-"} / Club #{p.CMN || "-"} on {p.payment_date} ({p.payment_method}) | Year: {p.membership_payment_date}
            {p.donations > 0 && <> |  Donation: ${p.donations}</>}
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.payment_ID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentsPage;
