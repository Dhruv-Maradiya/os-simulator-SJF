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
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import AddProcess from "./AddProcess";
import DeleteDialog from "./DeleteDialog";
import GanttChart from "./GanttChart";
import ProcessList from "./ProcessList";
import ProcessTimeTable from "./ProcessTimeTable";
import SJFIntro from "./SJFIntro";
import axios from "../../utils/axios";

// const defaultProcesses = [
//   {
//     name: "P1",
//     arrivalTime: 0,
//     burstTime: 5,
//   },
//   {
//     name: "P2",
//     arrivalTime: 1,
//     burstTime: 3,
//   },
//   {
//     name: "P3",
//     arrivalTime: 2,
//     burstTime: 1,
//   },
//   {
//     name: "P4",
//     arrivalTime: 3,
//     burstTime: 2,
//   },
// ];

export default function SJFView() {
  // State variables
  const [processes, setProcesses] = useState([]); // Stores the list of processes
  const [open, setOpen] = useState(false); // Controls the visibility of the "Add Process" dialog
  const [editData, setEditData] = useState(null); // Stores the data of the process being edited

  const [processOpen, setProcessOpen] = useState(true); // Controls the visibility of the process list
  const [processTimeTableOpen, setProcessTimeTableOpen] = useState(true); // Controls the visibility of the process time table
  const [processGanttChartOpen, setProcessGanttChartOpen] = useState(true); // Controls the visibility of the Gantt chart
  const [introOpen, setIntroOpen] = useState(false); // Controls the visibility of the introduction dialog

  const [deleteId, setDeleteId] = useState(null); // Stores the ID of the process being deleted

  // Calculate the processes with their execution time
  const processesWithTime = useMemo(() => {
    const tempProcesses = processes.map((process) => {
      return {
        ...process,
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

    axios
      .post("/processes", process)
      .then((response) => {
        toast.success("Process added successfully");
      })
      .catch((error) => {
        console.error("Error adding process:", error);
        toast.error("Error adding process");
      });

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

    axios
      .put(`/processes/${process.name}`, process)
      .then((response) => {
        toast.success("Process updated successfully");
      })
      .catch((error) => {
        toast.error("Error updating process");
      });

    setProcesses(newProcesses);
  };

  const handleDelete = (id) => {
    const newProcesses = processes.filter((process) => process.name !== id);

    axios
      .delete(`/processes/${id}`)
      .then((response) => {
        toast.success("Process deleted successfully");
      })
      .catch((error) => {
        toast.error("Error deleting process");
      });

    setProcesses(newProcesses);
    setDeleteId(null);
  };

  // Close the "Add Process" dialog and reset the edit data
  const handleDialogClose = () => {
    setOpen(false);
    setEditData(null);
  };

  useEffect(() => {
    axios
      .get("/processes")
      .then((response) => {
        const processesData = response.data.data;
        setProcesses(processesData);
      })
      .catch((error) => {
        // handle the error
        console.error("Error fetching processes:", error);
      });
  }, []);

  return (
    <Container>
      <Card>
        <CardContent
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5">SJF (Shortest Job First)</Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button variant="contained" onClick={() => setOpen(true)}>
              Add Process
            </Button>
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
            <Typography variant="h6">Introduction</Typography>
            <IconButton
              onClick={() => {
                setIntroOpen(!introOpen);
              }}
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {introOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </Box>
          <SJFIntro introOpen={introOpen} />
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
        handleDelete={handleDelete}
      />
    </Container>
  );
}
