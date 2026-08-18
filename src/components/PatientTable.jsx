import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

import {
  getPatients,
  updatePatient,
} from "../api/patientApi";

function Patients({ registrationId }) {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [editForm, setEditForm] = useState({
    Patient_Name: "",
    Gender: "",
  });

  const [saving, setSaving] = useState(false);

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
      console.error("Failed to fetch patients:", error);
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  // Open edit dialog
  const handleEdit = (patient) => {
    setSelectedPatient(patient);

    setEditForm({
      Patient_Name: patient.Patient_Name || "",
      Gender: patient.Gender || "",
    });

    setEditOpen(true);
  };

  // Close edit dialog
  const handleCloseEdit = () => {
    if (saving) return;

    setEditOpen(false);
    setSelectedPatient(null);
  };

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save patient
  const handleSave = async () => {
    if (!selectedPatient) return;

    try {
      setSaving(true);

      await updatePatient(
        selectedPatient.Registration_ID,
        {
          Patient_Name: editForm.Patient_Name,
          Gender: editForm.Gender,
        }
      );

      // Close dialog
      setEditOpen(false);
      setSelectedPatient(null);

      // Reload current page
      await fetchPatients();
    } catch (error) {
      console.error("Failed to update patient:", error);

      setError("Failed to update patient.");
    } finally {
      setSaving(false);
    }
  };

  const handlePatientClick = (patient) => {
    navigate(
      `/patient/${patient.Registration_ID}`
    );
  };

  const columns = [
    {
      field: "Patient_Name",
      headerName: "Patient Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "Registration_ID",
      headerName: "Patient Number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "nextKinName",
      headerName: "Guarantor Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "Date_Of_Birth",
      headerName: "Date of Birth",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "Region",
      headerName: "Region",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "Ward",
      headerName: "Ward",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={(event) => {
            event.stopPropagation();

            handleEdit(params.row);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <Button onClick={fetchPatients}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <h2>Patients</h2>

      <div
        style={{
          height: 600,
          width: "100%",
        }}
      >
        <DataGrid
          rows={patients}
          columns={columns}
          getRowId={(row) =>
            row.Registration_ID
          }

          loading={loading}

          pagination
          paginationMode="server"

          rowCount={
            pagination?.total ?? 0
          }

          paginationModel={{
            page: currentPage - 1,
            pageSize:
              pagination?.per_page ?? 15,
          }}

          onPaginationModelChange={(model) => {
            setCurrentPage(model.page + 1);
          }}

          pageSizeOptions={[15]}

          onRowClick={(params) => {
            handlePatientClick(
              params.row
            );
          }}
        />
      </div>

      {/* Edit Patient Dialog */}

      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit Patient
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Patient Name"
            name="Patient_Name"
            value={editForm.Patient_Name}
            onChange={handleChange}
          />

          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>
              Gender
            </InputLabel>

            <Select
              name="Gender"
              value={editForm.Gender}
              label="Gender"
              onChange={handleChange}
            >
              <MenuItem value="Male">
                Male
              </MenuItem>

              <MenuItem value="Female">
                Female
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseEdit}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Patients;