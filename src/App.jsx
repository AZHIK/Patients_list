import { Routes, Route } from "react-router-dom";
import Patients from "./components/PatientTable";
import PatientDetailPage from "./pages/PatientDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Patients />} />
      <Route path="/patient/:id" element={<PatientDetailPage />} />
    </Routes>
  );
}

export default App;