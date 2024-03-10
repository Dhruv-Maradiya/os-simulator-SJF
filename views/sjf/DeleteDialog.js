// ** React Imports

// ** MUI Imports
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

const DeleteDialog = ({ open, setOpen, id, handleDelete }) => {
  // ** States
  const handleClose = () => setOpen(null);

  const handleConfirmation = async () => {
    // ** Call the handleDelete function
    handleDelete(id);

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            "& svg": { mb: 4, color: "warning.main" },
          }}
        >
          <WarningIcon
            sx={{
              fontSize: "5.5rem",
            }}
          />
          <Typography>
            Are you sure you would like to delete the process?
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            mt: 2,
          }}
        >
          <Button variant="contained" onClick={handleConfirmation}>
            Yes
          </Button>
          <Button variant="outlined" color="warning" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
