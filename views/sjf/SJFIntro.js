"use client";

import { Box, Collapse, Typography } from "@mui/material";

const SJFIntro = ({ introOpen }) => {
  return (
    <Collapse in={introOpen}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="body1" sx={{ ml: 2 }}>
          Shortest Job First (SJF) is a scheduling algorithm that selects the
          process with the smallest burst time to execute first. It is a
          non-preemptive algorithm, meaning that once a process starts
          executing, it will continue until it completes. SJF aims to minimize
          the average waiting time of processes by prioritizing shorter jobs.
          This algorithm is based on the assumption that shorter jobs tend to
          have a shorter execution time, resulting in faster completion. In the
          context of operating systems, SJF can be used to schedule processes in
          a multi-programming environment. When a new process arrives, the
          scheduler compares its burst time with the remaining burst time of the
          currently executing process. Implementing SJF scheduling algorithm
          requires maintaining a ready queue of processes, sorted in ascending
          order of their burst times. The scheduler selects the process with the
          smallest burst time from the ready queue for execution. SJF can be
          beneficial in scenarios where the burst time of processes is known in
          advance or can be accurately estimated. However, it may lead to
          starvation for longer processes if shorter processes keep arriving. By
          using the SJF scheduling algorithm, system performance can be improved
          by reducing the average waiting time and increasing overall
          throughput.
        </Typography>
      </Box>
    </Collapse>
  );
};

export default SJFIntro;
