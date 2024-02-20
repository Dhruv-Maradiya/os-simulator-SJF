"use client";

import { Box, Collapse, Typography } from "@mui/material";
import { useMemo } from "react";

const GanttChart = ({ processes, processGanttChartOpen }) => {
  // Calculate the finish time of the last process
  const finishTime = processes.reduce((acc, process) => {
    acc = Math.max(acc, process.finishTime);

    return acc;
  }, 0);

  // Calculate the Gantt chart with ideal time
  const withIdealTime = useMemo(() => {
    const cpuTimeTable = []; // Stores the Gantt chart with ideal time

    let previousProcess = null; // Stores the previous process
    processes.forEach((process, index) => {
      if (!previousProcess) {
        if (process.arrivalTime > 0) {
          // If the first process doesn't start at 0, add an ideal process
          const idealProcess = {
            name: "Ideal",
            arrivalTime: 0,
            finishTime: process.arrivalTime,
            ideal: true,
          };

          cpuTimeTable.push(idealProcess);
        }

        cpuTimeTable.push(process);
      } else {
        // If the current process doesn't start immediately after the previous process, add an ideal process
        if (process.arrivalTime > previousProcess.finishTime) {
          const idealProcess = {
            name: "Ideal",
            arrivalTime: previousProcess.finishTime,
            finishTime: process.arrivalTime,
            ideal: true,
          };

          cpuTimeTable.push(idealProcess);
        }

        cpuTimeTable.push(process);
      }

      previousProcess = process;
    });

    return cpuTimeTable;
  }, [processes]);

  return (
    <Collapse in={processGanttChartOpen}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {withIdealTime
          .sort((a, b) => a.finishTime - b.finishTime)
          .map((process, index) => {
            return (
              <Box
                key={process.name + index.toString()}
                sx={{
                  flex: process.finishTime / finishTime,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    p: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {process.name}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption">
                    {!index ? process.arrivalTime : null}
                  </Typography>
                  <Typography variant="caption">
                    {process.finishTime}
                  </Typography>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Collapse>
  );
};

export default GanttChart;
