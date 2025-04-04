import { useState } from "react";

function ClubMemberForm({ onAddMember }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    sin: "",
    medicareCardNumber: "",
    phoneNumber: "",
    address: "",
    city: "",
    province: "",
    postalCode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMember = {
      id: Date.now(), // temporary
      ...formData
    };
    onAddMember(newMember);
    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
      sin: "",
      medicareCardNumber: "",
      phoneNumber: "",
      address: "",
      city: "",
      province: "",
      postalCode: ""
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
      <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
      <input name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" />
      <input name="sin" value={formData.sin} onChange={handleChange} placeholder="SIN" />
      <input name="medicareCardNumber" value={formData.medicareCardNumber} onChange={handleChange} placeholder="Medicare Card Number" />
      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
      <input name="province" value={formData.province} onChange={handleChange} placeholder="Province" />
      <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" />
      <button type="submit">Add Member</button>
    </form>
  );
}

export default ClubMemberForm;
