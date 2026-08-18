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

      console.log("Patients response:", result);

      setPatients(result.data);
      setPagination(result);
    } catch (error) {
      console.error(
        "Failed to fetch patients:",
        error
      );

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
      setError("");

      const payload = {
        Patient_Name: editForm.Patient_Name,
        Gender: editForm.Gender,
      };

      console.log(
        "PUT URL:",
        selectedPatient.Registration_ID
      );

      console.log("PUT payload:", payload);

      const response = await updatePatient(
        selectedPatient.Registration_ID,
        payload
      );

      console.log("PUT response:", response);

      setEditOpen(false);
      setSelectedPatient(null);

      await fetchPatients();
    } catch (error) {
      console.error("UPDATE ERROR:", error);

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Headers:",
        error.response?.headers
      );

      setError(
        error.response?.data?.message ||
          `Failed to update patient. Status: ${
            error.response?.status || "Unknown"
          }`
      );
    } finally {
      setSaving(false);
    }
  };

  // Navigate to patient details
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
      field: "Guarantor_Name",
      headerName: "Guarantor Name",
      flex: 1,
      minWidth: 180,

      valueGetter: (value, row) =>
        row.sponsor?.Guarantor_Name ||
        row.nextKinName ||
        "N/A",
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

  return (
    <div className="app-content">
      <div className="page-header">
        <h2 className="page-title">
          Patient Directory
        </h2>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div
        className="card"
        style={{ marginBottom: "1.5rem" }}
      >
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

            sx={{
              border: "none",
              backgroundColor: "var(--bg)",
              color: "var(--text)",

              "& .MuiDataGrid-root": {
                border: "none",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
              },

              "& .MuiDataGrid-cell": {
                borderBottomColor:
                  "var(--border)",
                color: "var(--text)",
              },

              "& .MuiDataGrid-columnHeader": {
                backgroundColor:
                  "var(--bg-secondary)",
                color: "var(--text-h)",
                fontWeight: 600,
                borderBottomColor:
                  "var(--border)",
              },

              "& .MuiDataGrid-row": {
                backgroundColor:
                  "var(--bg)",
                color: "var(--text)",

                "&:hover": {
                  backgroundColor:
                    "var(--bg-secondary)",
                  cursor: "pointer",
                },
              },

              "& .MuiTablePagination-root": {
                borderTopColor:
                  "var(--border)",
                color: "var(--text)",
              },

              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: "var(--text)",
                  margin: 0,
                },

              "& .MuiSelect-root": {
                color: "var(--text)",
              },

              "& .MuiButton-root": {
                textTransform: "none",
                color: "var(--primary)",
              },

              "& .MuiButton-outlined": {
                borderColor: "var(--border)",
                color: "var(--primary)",

                "&:hover": {
                  backgroundColor:
                    "rgba(59, 130, 246, 0.05)",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Edit Patient Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "var(--bg)",
            color: "var(--text)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "var(--text-h)",
            fontWeight: 600,
          }}
        >
          Edit Patient
        </DialogTitle>

        <DialogContent
          sx={{
            paddingTop: "1.5rem",
          }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Patient Name"
            name="Patient_Name"
            value={editForm.Patient_Name}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "var(--text)",

                "& fieldset": {
                  borderColor:
                    "var(--border)",
                },

                "&:hover fieldset": {
                  borderColor:
                    "var(--primary)",
                },
              },

              "& .MuiInputBase-input::placeholder":
                {
                  color: "var(--text-light)",
                  opacity: 1,
                },
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "var(--text)",

                "& fieldset": {
                  borderColor:
                    "var(--border)",
                },

                "&:hover fieldset": {
                  borderColor:
                    "var(--primary)",
                },
              },
            }}
          >
            <InputLabel
              sx={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Gender
            </InputLabel>

            <Select
              name="Gender"
              value={editForm.Gender}
              label="Gender"
              onChange={handleChange}
              sx={{
                color: "var(--text)",
              }}
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

        <DialogActions
          sx={{
            padding: "1rem",
          }}
        >
          <Button
            onClick={handleCloseEdit}
            disabled={saving}
            sx={{
              color: "var(--text)",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              backgroundColor:
                "var(--primary)",
              color: "white",
              textTransform: "none",
              fontWeight: 500,

              "&:hover": {
                backgroundColor:
                  "var(--primary-dark)",
              },

              "&:disabled": {
                backgroundColor:
                  "var(--text-light)",
              },
            }}
          >
            {saving
              ? "Saving..."
              : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Patients;