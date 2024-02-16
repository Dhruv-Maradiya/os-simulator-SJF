"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Collapse,
  Box,
  Typography,
} from "@mui/material";

const ProcessTimeTable = ({ processes, processTimeTableOpen }) => {
  const { averageWaitingTime, averageTurnaroundTime } = useMemo(() => {
    const averageWaitingTime =
      processes.reduce((acc, process) => acc + process.waitingTime, 0) /
      processes.length;

    const averageTurnaroundTime =
      processes.reduce((acc, process) => acc + process.turnaroundTime, 0) /
      processes.length;

    return {
      averageWaitingTime: averageWaitingTime.toFixed(2),
      averageTurnaroundTime: averageTurnaroundTime.toFixed(2),
    };
  }, [processes]);

  return (
    <Collapse in={processTimeTableOpen}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Process Name</TableCell>
              <TableCell>Arrival Time</TableCell>
              <TableCell>Burst Time</TableCell>
              <TableCell>Finish Time</TableCell>
              <TableCell>Turnaround Time</TableCell>
              <TableCell>Waiting Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processes
              .sort((a, b) => a.arrivalTime - b.arrivalTime)
              .map((process) => (
                <TableRow key={process.name}>
                  <TableCell>{process.name}</TableCell>
                  <TableCell>{process.arrivalTime}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.finishTime}</TableCell>
                  <TableCell>{process.turnaroundTime}</TableCell>
                  <TableCell>{process.waitingTime}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          mt: 3,
        }}
      >
        <Typography variant="body1">
          Average Waiting Time: {averageWaitingTime} ms
        </Typography>

        <Typography variant="body1">
          Average Turnaround Time: {averageTurnaroundTime} ms
        </Typography>
      </Box>
    </Collapse>
  );
};

export default ProcessTimeTable;
