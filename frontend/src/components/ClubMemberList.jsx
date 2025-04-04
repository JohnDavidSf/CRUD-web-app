function ClubMemberList({ members }) {
  return (
    <ul>
      {members.map((m) => (
        <li key={m.id}>
          <strong>{m.firstName} {m.lastName}</strong> — {m.birthDate} — {m.city}, {m.province}
        </li>
      ))}
    </ul>
  );
}

export default ClubMemberList;
