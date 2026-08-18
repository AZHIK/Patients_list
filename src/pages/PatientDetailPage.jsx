import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPatients } from "../api/patientApi";

function PatientDetailPage() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const data = await getPatients(id);

      setPatient(Array.isArray(data) ? data[0] : data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!patient) return <h3>Loading...</h3>;

  return (
    <div>
      <h2>Patient Demographics</h2>

      <p>
        <strong>Patient Name:</strong>{" "}
        {patient.Patient_Name}
      </p>

      <p>
        <strong>Gender:</strong>{" "}
        {patient.Gender === "M"
          ? "Male"
          : patient.Gender === "F"
          ? "Female"
          : patient.Gender}
      </p>

      <p>
        <strong>Date of Birth:</strong>{" "}
        {patient.Date_Of_Birth}
      </p>

      <p>
        <strong>Region:</strong> {patient.Region}
      </p>

      <p>
        <strong>Ward:</strong> {patient.Ward}
      </p>

      <p>
        <strong>Guarantor Name:</strong>{" "}
        {patient.sponsor?.Guarantor_Name || "N/A"}
      </p>
    </div>
  );
}

export default PatientDetailPage;