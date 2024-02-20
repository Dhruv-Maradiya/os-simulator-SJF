"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUpRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import AddProcess from "../views/dashboard/AddProcess";
import ProcessList from "../views/dashboard/ProcessList";
import ProcessTimeTable from "../views/dashboard/ProcessTimeTable";
import GanttChart from "../views/dashboard/GanttChart";

const defaultProcesses = [
  {
    name: "P1",
    arrivalTime: 0,
    burstTime: 5,
  },
  {
    name: "P2",
    arrivalTime: 1,
    burstTime: 3,
  },
  {
    name: "P3",
    arrivalTime: 2,
    burstTime: 1,
  },
  {
    name: "P4",
    arrivalTime: 3,
    burstTime: 2,
  },
];

export default function Home() {
  // State variables
  const [processes, setProcesses] = useState(defaultProcesses); // Stores the list of processes
  const [open, setOpen] = useState(false); // Controls the visibility of the "Add Process" dialog
  const [editData, setEditData] = useState(null); // Stores the data of the process being edited

  const [processOpen, setProcessOpen] = useState(true); // Controls the visibility of the process list
  const [processTimeTableOpen, setProcessTimeTableOpen] = useState(true); // Controls the visibility of the process time table
  const [processGanttChartOpen, setProcessGanttChartOpen] = useState(true); // Controls the visibility of the Gantt chart

  // Calculate the processes with their execution time
  const processesWithTime = useMemo(() => {
    // If no processes are available, return an empty array
    if (!processes.length) {
      return [];
    }

    // Sort the processes based on their arrival time and burst time in ascending order group by arrival time
    const data = {};

    // Group processes by their arrival time
    processes.forEach((process, index) => {
      if (data[process.arrivalTime]) {
        data[process.arrivalTime].push(process);
      } else {
        data[process.arrivalTime] = [process];
      }
    });

    const keys = Object.keys(data).sort((a, b) => a - b);

    // Sort processes within each arrival time group based on burst time
    keys.forEach((key) => {
      data[key] = data[key].sort((a, b) => a.burstTime - b.burstTime);
    });

    // Store the sorted processes in an array
    const processSorted = keys.map((key) => data[key]).flat();

    const alreadyExecuted = []; // Stores the names of the processes that have already been executed
    let currentTime = processSorted[0].arrivalTime; // Stores the current time
    const processesWithTime = []; // Stores the processes with finish time, waiting time, and turnaround time

    // Execute the processes in shortest job first order
    for (let i = 0; i < processSorted.length; i++) {
      // Find the shortest process that has arrived and not executed yet
      let shortestProcess = processSorted.reduce((acc, process) => {
        if (alreadyExecuted.includes(process.name)) {
          // Checks if process is not already executed
          return acc;
        }

        // Checks if the process has arrived
        if (process.arrivalTime <= currentTime) {
          if (!acc) {
            return process;
          }

          if (process.burstTime < acc.burstTime) {
            return process;
          }

          return acc;
        }

        return acc;
      }, null);

      // If no process is available to execute, move to the next arrival time -- this is to handle the case when there are gaps between arrival times and the CPU is idle
      if (!shortestProcess && alreadyExecuted.length < processes.length) {
        // Find the next arrival time
        const nextProcesses = processSorted.filter(
          (p) => p.arrivalTime > currentTime
        );

        if (nextProcesses.length) {
          shortestProcess = nextProcesses[0];
          currentTime = shortestProcess.arrivalTime;
        }
      }

      // Execute the shortest process
      if (shortestProcess) {
        // Calculate the finish time, waiting time, and turnaround time
        const finishTime = currentTime + shortestProcess.burstTime;
        const waitingTime = currentTime - shortestProcess.arrivalTime;
        const turnaroundTime = finishTime - shortestProcess.arrivalTime;

        // Store the process with its execution time
        processesWithTime.push({
          ...shortestProcess,
          finishTime,
          waitingTime,
          turnaroundTime,
        });

        alreadyExecuted.push(shortestProcess.name);
        currentTime = finishTime;
      }
    }

    return processesWithTime;
  }, [processes]);

  // Add a new process to the list
  const handleAdd = (process) => {
    if (processes.some((p) => p.name === process.name)) {
      return toast.error("Process with the same name already exists");
    }

    const newProcesses = [...processes, process];
    setProcesses(newProcesses);
  };

  // Edit an existing process in the list
  const handleEdit = (id, process) => {
    const newProcesses = processes.map((p, index) => {
      if (index === id) {
        return process;
      }
      return p;
    });

    setProcesses(newProcesses);
  };

  // Close the "Add Process" dialog and reset the edit data
  const handleDialogClose = () => {
    setOpen(false);
    setEditData(null);
  };

  return (
    <Container
      sx={{
        my: 5,
      }}
    >
      <Card>
        <CardContent
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5">SJF (Shortest Job First)</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Process
          </Button>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Processes</Typography>
            <IconButton
              onClick={() => {
                setProcessOpen(!processOpen);
              }}
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {processOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </Box>
          <ProcessList
            processes={processes}
            setProcesses={setProcesses}
            setOpen={setOpen}
            setEditData={setEditData}
            processOpen={processOpen}
            setProcessOpen={setProcessOpen}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Time Table</Typography>
            <IconButton
              onClick={() => {
                setProcessTimeTableOpen(!processTimeTableOpen);
              }}
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {processTimeTableOpen ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              )}
            </IconButton>
          </Box>
          <ProcessTimeTable
            processes={processesWithTime}
            processTimeTableOpen={processTimeTableOpen}
            setProcessTimeTableOpen={setProcessTimeTableOpen}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">gantt Chart</Typography>
            <IconButton
              onClick={() => {
                setProcessGanttChartOpen(!processGanttChartOpen);
              }}
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {processGanttChartOpen ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              )}
            </IconButton>
          </Box>
          <GanttChart
            processes={processesWithTime}
            processGanttChartOpen={processGanttChartOpen}
          />
        </CardContent>
      </Card>
      <AddProcess
        open={open}
        onClose={handleDialogClose}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        editData={editData}
      />
    </Container>
  );
}
