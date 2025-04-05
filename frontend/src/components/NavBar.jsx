import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{padding: "1rem", backgroundColor: "#f0f0f0"}}>
      <Link to="/" style={{ marginRight: "10px"}}>Home</Link>
      
      <Link to="/locations-page" style ={{ marginRight: "10px"}}>Locations Page</Link>
      <Link to="/personnel-page" style ={{ marginRight: "10px"}}>Personnel Page</Link>
      <Link to="/works-at" style ={{ marginRight: "10px"}}>Employees Page</Link>
      <Link to="/family-members" style ={{ marginRight: "10px"}}>Family Members</Link>
      <Link to="/club-members" style ={{ marginRight: "10px"}}>Club Members</Link>
      <Link to="/teams" style ={{ marginRight: "10px"}}>Teams</Link>
      <Link to="/team-assignments" style ={{ marginRight: "10px"}}>Team Assignments</Link>
      <Link to="/payments" style ={{ marginRight: "10px"}}>Payments</Link>
      <Link to="/sessions" style ={{ marginRight: "10px"}}>Sessions</Link>
      <Link to="/attendance" style ={{ marginRight: "10px"}}>Attendance</Link>
      <Link to="/email-log" style ={{ marginRight: "10px"}}>Email Log</Link>


    {/* Add more links here later */}
    </nav>
  );
}

export default Navbar;