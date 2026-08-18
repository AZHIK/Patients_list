import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPatients } from "../api/patientApi";
import "./PatientDetailPage.css";

function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPatients(id);

      console.log("Patient detail response:", result);

      // API structure:
      // result = {
      //   current_page: 1,
      //   total: 1,
      //   data: [...]
      // }

      const patientData = Array.isArray(result?.data)
        ? result.data[0]
        : null;

      if (!patientData) {
        setError("Patient not found.");
        return;
      }

      setPatient(patientData);
    } catch (error) {
      console.error("Failed to load patient:", error);
      setError("Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="app-content">
        <div className="page-header">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            ← Back to Patients
          </button>
        </div>

        <div className="alert alert-error">
          {error || "Patient not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="app-content">
      <div className="page-header">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          ← Back to Patients
        </button>
      </div>

      <div className="patient-detail-grid">
        <div className="card">
          <div className="card-header">
            <h2>{patient.Patient_Name || "N/A"}</h2>

            <p className="patient-id">
              ID: {patient.Registration_ID || "N/A"}
            </p>
          </div>

          <div className="card-body">
            <div className="detail-group">
              <label className="detail-label">
                Gender
              </label>

              <div className="detail-value">
                <span className="badge badge-primary">
                  {patient.Gender === "M"
                    ? "Male"
                    : patient.Gender === "F"
                    ? "Female"
                    : patient.Gender || "N/A"}
                </span>
              </div>
            </div>

            <div className="detail-group">
              <label className="detail-label">
                Date of Birth
              </label>

              <p className="detail-value">
                {patient.Date_Of_Birth || "N/A"}
              </p>
            </div>

            <div className="detail-group">
              <label className="detail-label">
                Region
              </label>

              <p className="detail-value">
                {patient.Region || "N/A"}
              </p>
            </div>

            <div className="detail-group">
              <label className="detail-label">
                Ward
              </label>

              <p className="detail-value">
                {patient.Ward || "N/A"}
              </p>
            </div>

            <div className="detail-group">
              <label className="detail-label">
                Guarantor Name
              </label>

              <p className="detail-value">
                {patient.sponsor?.Guarantor_Name ||
                  patient.nextKinName ||
                  "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailPage;