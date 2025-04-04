import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{padding: "1rem", backgroundColor: "#f0f0f0"}}>
      <Link to="/" style={{ marginRight: "10px"}}>Home</Link>
      <Link to="/club-members" style ={{ marginRight: "10px"}}>Club Members</Link>
      <Link to="/locations-page" style ={{ marginRight: "10px"}}>Locations Page</Link>
    {/* Add more links here later */}
    </nav>
  );
}

export default Navbar;