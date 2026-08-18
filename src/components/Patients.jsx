import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients } from "../api/patientApi";

function Patients({ registrationId }) {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, [registrationId, currentPage]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPatients(
        registrationId,
        currentPage
      );

      setPatients(result.data);
      setPagination(result);
    } catch (error) {
      console.error(error);
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (registrationId) => {
    navigate(`/patient/${registrationId}`);
  };

  if (loading) {
    return <p>Loading patients...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Patients</h2>

      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Patient Number</th>
            <th>Guarantor Name</th>
            <th>Date of Birth</th>
            <th>Region</th>
            <th>Ward</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.Registration_ID}
              onClick={() =>
                handlePatientClick(
                  patient.Registration_ID
                )
              }
              style={{ cursor: "pointer" }}
            >
              <td>{patient.Patient_Name}</td>

              <td>{patient.Registration_ID}</td>

              <td>{patient.nextKinName}</td>

              <td>{patient.Date_Of_Birth}</td>

              <td>{patient.Region}</td>

              <td>{patient.Ward}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div>
          <button
            disabled={!pagination.prev_page_url}
            onClick={() =>
              setCurrentPage((page) => page - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {pagination.current_page} of{" "}
            {pagination.last_page}
          </span>

          <button
            disabled={!pagination.next_page_url}
            onClick={() =>
              setCurrentPage((page) => page + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Patients;