import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ClubMembersPage from "./pages/ClubMembersPage";
import LocationsPage from "./pages/LocationsPage";
import PersonnelPage from "./pages/PersonnelPage";
import WorksAtPage from "./pages/WorksAtPage";
import FamilyMembersPage from "./pages/FamilyMembersPage";
import TeamsPage from "./pages/TeamsPage";
import TeamAssignmentsPage from "./pages/TeamAssignmentsPage";
import PaymentsPage from "./pages/PaymentsPage";
import SessionsPage from "./pages/SessionsPage";
import AttendancePage from "./pages/AttendancePage";
import EmailLogPage from "./pages/EmailLogPage";




function App()  {
  return ( 
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/club-members" element={<ClubMembersPage />} />

          <Route path="/locations-page" element={<LocationsPage />} />
          <Route path="/personnel-page" element={<PersonnelPage />} />
          <Route path="/works-at" element={<WorksAtPage />} />
          <Route path="/family-members" element={<FamilyMembersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/team-assignments" element={<TeamAssignmentsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/email-log" element={<EmailLogPage />} />






        </Routes>
      </div>
    </Router>
  );
}

export default App;