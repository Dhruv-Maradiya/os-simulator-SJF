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
  const [processes, setProcesses] = useState(defaultProcesses);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [processOpen, setProcessOpen] = useState(true);
  const [processTimeTableOpen, setProcessTimeTableOpen] = useState(true);
  const [processGanttChartOpen, setProcessGanttChartOpen] = useState(true);

  const processesWithTime = useMemo(() => {
    if (!processes.length) {
      return [];
    }

    // debugger;
    const data = {};

    processes.forEach((process, index) => {
      if (data[process.arrivalTime]) {
        data[process.arrivalTime].push(process);
      } else {
        data[process.arrivalTime] = [process];
      }
    });

    const keys = Object.keys(data).sort((a, b) => a - b);

    keys.forEach((key) => {
      data[key] = data[key].sort((a, b) => a.burstTime - b.burstTime);
    });

    const processSorted = keys.map((key) => data[key]).flat();

    const alreadyExecuted = [];

    let currentTime = processSorted[0].arrivalTime;

    const processesWithTime = [];

    for (let i = 0; i < processSorted.length; i++) {
      let shortestProcess = processSorted.reduce((acc, process) => {
        if (alreadyExecuted.includes(process.name)) {
          return acc;
        }

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

      if (!shortestProcess && alreadyExecuted.length < processes.length) {
        const nextProcesses = processSorted.filter(
          (p) => p.arrivalTime > currentTime
        );

        if (nextProcesses.length) {
          shortestProcess = nextProcesses[0];

          currentTime = shortestProcess.arrivalTime;
        }
      }

      if (shortestProcess) {
        const finishTime = currentTime + shortestProcess.burstTime;
        const waitingTime = currentTime - shortestProcess.arrivalTime;
        const turnaroundTime = finishTime - shortestProcess.arrivalTime;

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

  const handleAdd = (process) => {
    if (processes.some((p) => p.name === process.name)) {
      return toast.error("Process with the same name already exists");
    }

    const newProcesses = [...processes, process];

    setProcesses(newProcesses);
  };

  const handleEdit = (id, process) => {
    const newProcesses = processes.map((p, index) => {
      if (index === id) {
        return process;
      }

      return p;
    });

    setProcesses(newProcesses);
  };

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
