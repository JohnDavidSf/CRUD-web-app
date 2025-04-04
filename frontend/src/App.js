import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ClubMembers from "./pages/ClubMembers";
import LocationsPage from "./pages/LocationsPage";

function App()  {
  return ( 
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/club-members" element={<ClubMembers />} />
          <Route path="/locations-page" element={<LocationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;