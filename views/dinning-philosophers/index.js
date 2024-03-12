import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUpRounded";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
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
import { useMemo, useRef, useState } from "react";
import Semaphore from "../../classes/Semaphore";
import DinningPhilosopherIntro from "./DinningPhilosopherIntro";
import Philosophers from "./Philosophers";
import { v4 as uuid } from "uuid";
import Timestamps from "./Timestamps";

const randomTime = (min = 3000, max = 10000) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomColor = (numOfSteps, step) => {
  let r, g, b;
  const h = step / numOfSteps;
  const i = ~~(h * 6);
  const f = h * 6 - i;
  const q = 1 - f;
  switch (i % 6) {
    case 0:
      r = 1;
      g = f;
      b = 0;
      break;
    case 1:
      r = q;
      g = 1;
      b = 0;
      break;
    case 2:
      r = 0;
      g = 1;
      b = f;
      break;
    case 3:
      r = 0;
      g = q;
      b = 1;
      break;
    case 4:
      r = f;
      g = 0;
      b = 1;
      break;
    case 5:
      r = 1;
      g = 0;
      b = q;
      break;
  }
  const c =
    "#" +
    ("00" + (~~(r * 255)).toString(16)).slice(-2) +
    ("00" + (~~(g * 255)).toString(16)).slice(-2) +
    ("00" + (~~(b * 255)).toString(16)).slice(-2);
  return c;
};

const generatePhilosophers = (num) => {
  const ids = Array(num)
    .fill(1)
    .map(() => uuid());

  return Array(num)
    .fill(1)
    .map((_, i) => {
      const obj = {
        id: ids[i],
        name: `Philosopher ${i + 1}`,
        status: "THINKING", // THINKING, HUNGRY, EATING
        leftPhilosopher: ids[(i + 1) % num],
        rightPhilosopher: ids[(i - 1 + num) % num],
        color: getRandomColor(num, i + 1),
        semaphore: new Semaphore(0),
        think: (log) => {
          log.setter(log, "thinkingStartAt", new Date().getTime());
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              log.setter(log, "thinkingEndAt", new Date().getTime());
            }, randomTime());
          });
        },
        eat: (log) => {
          log.setter(log, "eatingStartAt", new Date().getTime());
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              log.setter(log, "eatingEndAt", new Date().getTime());
            }, randomTime());
          });
        },
      };

      return obj;
    });
};

let mutex = new Semaphore(1);

export default function DinningPhilosopherView() {
  const [introOpen, setIntroOpen] = useState(false); // Controls the visibility of the introduction dialog
  const [logsOpen, setLogsOpen] = useState(true); // Controls the visibility of the logs section
  const [philosophers, _setPhilosophers] = useState(generatePhilosophers(5)); // Number of philosophers [Default: 5]
  const [simulationOn, setSimulationOn] = useState(false);
  const [logs, _setLogs] = useState([]); // Logs of the simulation

  const simulationOnRef = useRef(simulationOn);
  const philosophersRef = useRef(philosophers);
  const logsRef = useRef(logs);

  const forks = useMemo(() => {
    return philosophers.map((p, index) => {
      return {
        id: index,
        name: `Fork ${index + 1}`,
        leftPhilosopher: p.id,
        rightPhilosopher: philosophers[(index + 1) % philosophers.length].id,
      };
    });
  }, [philosophers]);

  const setPhilosophers = (value) => {
    if (!simulationOnRef.current) {
      return;
    }

    value =
      typeof value === "function" ? value(philosophersRef.current) : value;

    philosophersRef.current = value;
    _setPhilosophers(value);
  };

  const setLogs = (value) => {
    if (!simulationOnRef.current) {
      return;
    }

    value = typeof value === "function" ? value(logsRef.current) : value;

    // Remove logs of philosophers that are not in the simulation anymore
    value = value.filter((log) => {
      return philosophersRef.current.find((p) => p.id === log.philosopher);
    });

    logsRef.current = value;
    _setLogs(value);
  };

  const test = (id) => {
    const philosopher = philosophersRef.current.find((p) => p.id === id);

    // For Stop Simulation
    if (!philosopher) {
      return;
    }

    const leftPhilosopher = philosophersRef.current.find(
      (p) => p.id === philosopher.leftPhilosopher
    );
    const rightPhilosopher = philosophersRef.current.find(
      (p) => p.id === philosopher.rightPhilosopher
    );

    // For Stop Simulation
    if (!leftPhilosopher || !rightPhilosopher) {
      return;
    }

    if (
      philosopher.status === "HUNGRY" &&
      leftPhilosopher.status !== "EATING" &&
      rightPhilosopher.status !== "EATING"
    ) {
      // philosopher.status = "EATING";
      setPhilosophers((prev) => {
        const newPhilosophers = [...prev];

        const philosopher = newPhilosophers.find((p) => p.id === id);

        // For Stop Simulation
        if (!philosopher) {
          return prev;
        }

        philosopher.status = "EATING";

        return newPhilosophers;
      });

      philosopher.semaphore.signal();
    }
  };

  const takeFork = async (id, log) => {
    const philosopher = philosophersRef.current.find((p) => p.id === id);

    // For Stop Simulation
    if (!philosopher) {
      return;
    }

    await mutex.wait();

    // philosopher.status = "HUNGRY";
    setPhilosophers((prev) => {
      const newPhilosophers = [...prev];
      const philosopher = newPhilosophers.find((p) => p.id === id);

      // For Stop Simulation
      if (!philosopher) {
        return prev;
      }

      philosopher.status = "HUNGRY";

      log.setter(log, "hungryStartAt", new Date().getTime());

      return newPhilosophers;
    });
    log.setter(log, "forksTryToAcquireAt", new Date().getTime());

    test(id);
    mutex.signal();

    await philosopher.semaphore.wait();
    log.setter(log, "forksAcquiredAt", new Date().getTime());
  };

  const putFork = async (id) => {
    const philosopher = philosophersRef.current.find((p) => p.id === id);

    // For Stop Simulation
    if (!philosopher) {
      return;
    }

    await mutex.wait();

    // philosopher.status = "THINKING";
    setPhilosophers((prev) => {
      const newPhilosophers = [...prev];

      const philosopher = newPhilosophers.find((p) => p.id === id);

      // For Stop Simulation
      if (!philosopher) {
        return prev;
      }

      philosopher.status = "THINKING";

      return newPhilosophers;
    });

    test(philosopher.leftPhilosopher);
    test(philosopher.rightPhilosopher);
    mutex.signal();
  };

  const philosopherAction = async ({ id, philosophers }) => {
    const philosopher = philosophers.find((p) => p.id === id);

    while (simulationOnRef.current) {
      const log = {
        id: uuid(),
        philosopher: philosopher.id,
        thinkingStartAt: null,
        thinkingEndAt: null,
        hungryStartAt: null,
        forksTryToAcquireAt: null,
        forksAcquiredAt: null,
        eatingStartAt: null,
        eatingEndAt: null,
        setter: (obj, key, value) => {
          setLogs((prev) => {
            const newLogs = [...prev];

            const log = newLogs.find((l) => l.id === obj.id);

            if (log) {
              log[key] = value;
            }

            return newLogs;
          });
        },
      };

      setLogs((prev) => {
        const newLogs = [...prev];
        newLogs.push(log);

        return newLogs;
      });

      await philosopher.think(log);

      await takeFork(id, log);

      await philosopher.eat(log);

      await putFork(id);
    }
  };

  const handleStopSimulation = () => {
    mutex = new Semaphore(1);
    setSimulationOn(false);
    simulationOnRef.current = false;
  };

  const handleStartSimulation = () => {
    setSimulationOn(true);
    simulationOnRef.current = true;

    setPhilosophers(generatePhilosophers(philosophers.length));
    setLogs([]);

    philosophersRef.current.forEach((philosopher) => {
      philosopherAction({
        id: philosopher.id,
        philosophers: philosophersRef.current,
      });
    });
  };

  const handleAddPhilosopher = () => {
    const value = generatePhilosophers(philosophers.length + 1);

    philosophersRef.current.forEach((p, i) => {
      philosophersRef.current[i].color = value[i].color;
    });

    const newPhilosopher = value[value.length - 1];

    philosophersRef.current[0].leftPhilosopher = newPhilosopher.id;
    philosophersRef.current[
      philosophersRef.current.length - 1
    ].rightPhilosopher = newPhilosopher.id;

    newPhilosopher.leftPhilosopher =
      philosophersRef.current[philosophersRef.current.length - 1].id;
    newPhilosopher.rightPhilosopher = philosophersRef.current[0].id;

    philosophersRef.current.push(newPhilosopher);

    _setPhilosophers([...philosophersRef.current]);
  };

  const handleRemovePhilosopher = () => {
    philosophersRef.current.pop();

    philosophersRef.current[
      philosophersRef.current.length - 1
    ].rightPhilosopher = philosophersRef.current[0].id;
    philosophersRef.current[0].leftPhilosopher =
      philosophersRef.current[philosophersRef.current.length - 1].id;

    _setPhilosophers([...philosophersRef.current]);
  };

  const handlePlayPause = () => {
    if (simulationOn) {
      handleStopSimulation();
    } else {
      handleStartSimulation();
    }
  };

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
          <Typography variant="h5">Dinning Philosophers</Typography>
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
          <DinningPhilosopherIntro introOpen={introOpen} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Philosophers</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Tooltip title="Add a Philosopher - Maximum 9 Philosophers">
                <Button
                  variant="contained"
                  onClick={handleAddPhilosopher}
                  disabled={philosophers.length >= 9 || simulationOn}
                >
                  Add Philosopher
                </Button>
              </Tooltip>
              <Tooltip title="Remove a Philosopher - Minimum 3 Philosophers required">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleRemovePhilosopher}
                  disabled={philosophers.length <= 3 || simulationOn}
                >
                  Remove Philosopher
                </Button>
              </Tooltip>
              <Tooltip
                title={
                  simulationOn ? "Stop the simulation" : "Start the simulation"
                }
              >
                <IconButton
                  onClick={handlePlayPause}
                  sx={{
                    backgroundColor: (theme) =>
                      simulationOn
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        simulationOn
                          ? theme.palette.error.dark
                          : theme.palette.success.dark,
                    },
                  }}
                >
                  {simulationOn ? <StopIcon /> : <PlayArrowIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Philosophers
            philosophers={philosophers}
            simulationOn={simulationOn}
            forks={forks}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Timestamps</Typography>
            <IconButton
              onClick={() => {
                setLogsOpen(!logsOpen);
              }}
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {logsOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </Box>
          <Timestamps
            LogsOpen={logsOpen}
            logs={logs}
            philosophers={philosophers}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
