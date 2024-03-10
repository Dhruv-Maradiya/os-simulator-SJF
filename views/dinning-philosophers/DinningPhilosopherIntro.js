"use client";

import { Box, Collapse, List, ListItem, Typography } from "@mui/material";

const DinningPhilosopherIntro = ({ introOpen }) => {
  return (
    <Collapse in={introOpen}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="body1">
          The Dining Philosophers problem is a classic synchronization problem
          in computer science. It illustrates the challenges of resource
          allocation and deadlock avoidance in a concurrent system. The problem
          is as follows:
        </Typography>
        <Typography variant="body1">
          There are five philosophers sitting around a circular table, and each
          philosopher alternates between thinking and eating. There is a bowl of
          rice in the center of the table, and each philosopher needs two forks
          to eat. However, there are only five forks available, one between each
          pair of adjacent philosophers.
        </Typography>
        <Typography variant="body1">
          The challenge is to design a solution that allows the philosophers to
          eat without causing deadlock or starvation. Deadlock occurs when each
          philosopher picks up one fork and waits indefinitely for the other
          fork. Starvation occurs when a philosopher is unable to acquire the
          necessary forks to eat.
        </Typography>
        <Typography variant="body1">
          One common solution to the Dining Philosophers problem is to use
          semaphores. A semaphore is a synchronization primitive that can be
          used to control access to a shared resource. In this case, we can use
          a semaphore for each fork.
        </Typography>
        <Typography variant="body1">
          The solution involves the following steps:
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">
              1. Each philosopher is represented by a separate thread
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              2. Each philosopher must acquire the left and right forks before
              eating.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              3. To avoid deadlock, we can introduce a rule that philosophers
              can only pick up forks if both are available. Otherwise, they must
              wait.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              4. To prevent starvation, we can use a semaphore to limit the
              number of philosophers allowed to pick up forks at the same time.
              For example, if there are five philosophers and only four forks
              available, only four philosophers can eat simultaneously.
            </Typography>
          </ListItem>
        </List>
        <Typography variant="body1">
          By using semaphores to control access to the forks, we can ensure that
          the philosophers can eat without causing deadlock or starvation. The
          solution guarantees that each philosopher can eventually acquire the
          necessary forks to eat, and that no philosopher is left waiting
          indefinitely.
        </Typography>
        <Typography variant="body1"></Typography>
        <Typography variant="body1"></Typography>
        <Typography variant="body1"></Typography>
        <Typography variant="body1"></Typography>
        <Typography variant="body1"></Typography>
      </Box>
    </Collapse>
  );
};

export default DinningPhilosopherIntro;
