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
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import AddProcess from "../views/dashboard/AddProcess";
import DeleteDialog from "../views/dashboard/DeleteDialog";
import GanttChart from "../views/dashboard/GanttChart";
import GroupMember from "../views/dashboard/GroupMember";
import ProcessList from "../views/dashboard/ProcessList";
import ProcessTimeTable from "../views/dashboard/ProcessTimeTable";
import GroupIcon from "@mui/icons-material/Group";

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

const groupMembers = [
  {
    name: "Dhruv Maradiya",
    eno: "22BCP480D",
  },
  {
    name: "Neet Patel",
    eno: "22BCP242",
  },
  {
    name: "Krish Patel",
    eno: "22BCP243",
  },
  {
    name: "Neel Ganatra",
    eno: "22BCP472D",
  },
  {
    name: "Lakshy Mehta",
    eno: "22BCP482D",
  },
  {
    name: "Meet Patel",
    eno: "22BCP240",
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

  const [deleteId, setDeleteId] = useState(null); // Stores the ID of the process being deleted
  const [openGroupMember, setOpenGroupMember] = useState(false); // Controls the visibility of the group member dialog

  // Calculate the processes with their execution time
  const processesWithTime = useMemo(() => {
    const tempProcesses = processes.map((process) => {
      return {
        ...process,
        executed: false,
      };
    });

    // If no processes are available, return an empty array
    if (!tempProcesses.length) {
      return [];
    }

    // Sort the processes based on their arrival time and burst time in ascending order group by arrival time
    const data = {};

    // Group processes by their arrival time
    tempProcesses.forEach((process, index) => {
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
    let processSorted = keys.map((key) => data[key]).flat();

    const alreadyExecuted = []; // Stores the names of the processes that have already been executed
    let currentTime = processSorted[0].arrivalTime; // Stores the current time
    const processesWithTime = []; // Stores the processes with finish time, waiting time, and turnaround time

    // Execute the processes in shortest job first order
    while (processSorted.length > 0) {
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
      if (!shortestProcess && alreadyExecuted.length < tempProcesses.length) {
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
        const turnaroundTime = finishTime - shortestProcess.arrivalTime;
        const waitingTime = turnaroundTime - shortestProcess.burstTime;

        // Store the process with its execution time
        processesWithTime.push({
          ...shortestProcess,
          finishTime,
          waitingTime,
          turnaroundTime,
        });

        alreadyExecuted.push(shortestProcess.name);
        currentTime = finishTime;

        // Remove the executed process from the list
        processSorted = processSorted.filter(
          (p) => p.name !== shortestProcess.name
        );
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

  useEffect(() => {
    const data = localStorage.getItem("processes");
    if (data) {
      setProcesses(JSON.parse(data));
    }
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.grey[100],
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          py: 2,
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          SJF (Shortest Job First) Simulator
        </Typography>
      </Box>
      <Container>
        <Box
          sx={{
            p: 5,
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
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <Button variant="contained" onClick={() => setOpen(true)}>
                  Add Process
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    localStorage.setItem(
                      "processes",
                      JSON.stringify(processes)
                    );

                    toast.success("Processes saved successfully");
                  }}
                >
                  Save
                </Button>
                <Tooltip title="Group Members">
                  <IconButton
                    onClick={() => {
                      setOpenGroupMember(true);
                    }}
                  >
                    <GroupIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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
                setDeleteId={setDeleteId}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Calculation Table</Typography>
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
                <Typography variant="h6">Gantt Chart</Typography>
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
          <DeleteDialog
            open={deleteId !== null}
            setOpen={setDeleteId}
            id={deleteId}
            handleDelete={(id) => {
              const newProcesses = processes.filter(
                (process) => process.name !== id
              );
              setProcesses(newProcesses);
              setDeleteId(null);
            }}
          />
          <GroupMember
            groupMembers={groupMembers}
            open={openGroupMember}
            onClose={() => {
              setOpenGroupMember(false);
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
