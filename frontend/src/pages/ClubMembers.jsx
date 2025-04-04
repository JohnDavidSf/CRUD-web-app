import { useState } from "react";
import ClubMemberForm from "../components/ClubMemberForm";
import ClubMemberList from "../components/ClubMemberList";

function ClubMembers() {
  const [members, setMembers] = useState([]); // full list of members

  // function to add a new member to the list
  const addMember = (newMember) => {
    setMembers((prev) => [...prev, newMember]); // add to the end of the array
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Club Members</h1>
      <ClubMemberForm onAddMember={addMember} />
      <ClubMemberList members={members} />
    </div>
  );
}

export default ClubMembers;
