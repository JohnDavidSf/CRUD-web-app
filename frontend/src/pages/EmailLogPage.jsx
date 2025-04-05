import React, { useEffect, useState } from "react";
import axios from "axios";

function EmailLogPage() {
  const [emails, setEmails] = useState([]);
  const [clubMembers, setClubMembers] = useState([]);
  const [form, setForm] = useState({
    email_date: "",
    subject: "",
    sender_email: "",
    recipient_email: "",
    preview: "",
    cc_list: "",
    CMN: "",
    type: "Training Notification",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEmails();
    fetchClubMembers();
  }, []);

  const fetchEmails = () => {
    axios.get("http://localhost:3001/email-logs")
      .then(res => setEmails(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const fetchClubMembers = () => {
    axios.get("http://localhost:3001/club-members")
      .then(res => setClubMembers(res.data))
      .catch(err => console.error("Club members fetch error:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      email_date: "",
      subject: "",
      sender_email: "",
      recipient_email: "",
      preview: "",
      cc_list: "",
      CMN: "",
      type: "Training Notification"
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:3001/email-logs/${editingId}`
      : "http://localhost:3001/email-logs";

    const method = editingId ? axios.put : axios.post;

    method(url, form)
      .then(() => {
        fetchEmails();
        resetForm();
      })
      .catch((err) => {
        console.error("Submit error:", err);
        alert("Email log failed.");
      });
  };

  const handleEdit = (email) => {
    setForm(email);
    setEditingId(email.log_ID);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this email log?")) {
      axios.delete(`http://localhost:3001/email-logs/${id}`)
        .then(() => fetchEmails())
        .catch(err => {
          console.error("Delete error:", err);
          alert("Delete failed.");
        });
    }
  };

  return (
    <div>
      <h2>Email Log</h2>

      <form onSubmit={handleSubmit}>
        <input type="datetime-local" name="email_date" value={form.email_date} onChange={handleChange} required />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required />
        <input name="sender_email" value={form.sender_email} onChange={handleChange} placeholder="Sender Email" required />
        <input name="recipient_email" value={form.recipient_email} onChange={handleChange} placeholder="Recipient Email" required />
        <input name="preview" value={form.preview} onChange={handleChange} placeholder="Preview Text" />
        <input name="cc_list" value={form.cc_list} onChange={handleChange} placeholder="CC List (optional)" />

        <select name="CMN" value={form.CMN} onChange={handleChange}>
          <option value="">No Club Member</option>
          {clubMembers.map(m => (
            <option key={m.CMN} value={m.CMN}>
              {m.first_name} {m.last_name}
            </option>
          ))}
        </select>

        <select name="type" value={form.type} onChange={handleChange}>
          <option>Training Notification</option>
          <option>Game Notification</option>
          <option>Deactivation Notification</option>
        </select>

        <button type="submit">{editingId ? "Update" : "Add"} Email</button>
      </form>

      <h3>Email History</h3>
      <ul>
        {emails.map((e) => (
          <li key={e.log_ID}>
            [{e.email_date}] <strong>{e.subject}</strong> — From: {e.sender_email} → To: {e.recipient_email}
            {e.CMN && <> |  Club Member #{e.CMN} ({e.type})</>}
            <br />
            Preview: {e.preview}
            <br />
            {e.cc_list && <>CC: {e.cc_list}</>}
            <button onClick={() => handleEdit(e)}>Edit</button>
            <button onClick={() => handleDelete(e.log_ID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmailLogPage;
