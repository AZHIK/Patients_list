import { Routes, Route } from "react-router-dom";
import Patients from "./components/PatientTable";
import PatientDetailPage from "./pages/PatientDetailPage";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🏥 Patient Management System</h1>
      </header>
      <Routes>
        <Route path="/" element={<Patients />} />
        <Route path="/patient/:id" element={<PatientDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;