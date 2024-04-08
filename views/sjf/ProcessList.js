"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

export default function ProcessList({
  processes,
  setOpen,
  setEditData,
  processOpen,
  setDeleteId,
}) {
  return (
    <Collapse in={processOpen}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
          >
            <TableRow>
              <TableCell>Process Name</TableCell>
              <TableCell>Arrival Time</TableCell>
              <TableCell>Burst Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processes.map((process, index) => (
              <TableRow key={index}>
                <TableCell>{process.name}</TableCell>
                <TableCell>{process.arrivalTime}</TableCell>
                <TableCell>{process.burstTime}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => {
                        setEditData({ id: index, ...process });
                        setOpen(true);
                      }}
                      sx={{
                        fontSize: "1rem",
                      }}
                    >
                      <EditIcon fontSize="1rem" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => {
                        // const newProcesses = processes.filter(
                        //   (p) => p.name !== process.name
                        // );

                        // setProcesses(newProcesses);

                        setDeleteId(process.name);
                      }}
                      sx={{
                        fontSize: "1rem",
                      }}
                    >
                      <DeleteIcon fontSize="1rem" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Collapse>
  );
}
