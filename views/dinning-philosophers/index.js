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
        think: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, randomTime());
          });
        },
        eat: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
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
  const [philosopherOpen, setPhilosophersOpen] = useState(true); // Controls the visibility of the introduction dialog
  const [_philosophers, _setPhilosophers] = useState(generatePhilosophers(5)); // Number of philosophers [Default: 5]
  const [simulationOn, setSimulationOn] = useState(false);

  const simulationOnRef = useRef(simulationOn);
  const philosophersRef = useRef(_philosophers);

  const forks = useMemo(() => {
    return _philosophers.map((p, index) => {
      return {
        id: index,
        name: `Fork ${index + 1}`,
        leftPhilosopher: p.id,
        rightPhilosopher: _philosophers[(index + 1) % _philosophers.length].id,
      };
    });
  }, [_philosophers]);

  const setPhilosophers = (value) => {
    value =
      typeof value === "function" ? value(philosophersRef.current) : value;

    philosophersRef.current = value;
    _setPhilosophers(value);
  };

  const test = (id, philosophers) => {
    const philosopher = philosophers.find((p) => p.id === id);

    const leftPhilosopher = philosophers.find(
      (p) => p.id === philosopher.leftPhilosopher
    );
    const rightPhilosopher = philosophers.find(
      (p) => p.id === philosopher.rightPhilosopher
    );

    if (
      philosopher.status === "HUNGRY" &&
      leftPhilosopher.status !== "EATING" &&
      rightPhilosopher.status !== "EATING"
    ) {
      console.log(`${philosopher.name} is ready to eat and changing status...`);

      // philosopher.status = "EATING";
      setPhilosophers((prev) => {
        const newPhilosophers = [...prev];

        newPhilosophers.find((p) => p.id === id).status = "EATING";

        return newPhilosophers;
      });

      philosopher.semaphore.signal();
    }
  };

  const takeFork = async (id, philosophers) => {
    const philosopher = philosophers.find((p) => p.id === id);

    await mutex.wait();

    // philosopher.status = "HUNGRY";
    setPhilosophers((prev) => {
      const newPhilosophers = [...prev];

      newPhilosophers.find((p) => p.id === id).status = "HUNGRY";

      return newPhilosophers;
    });

    test(id, philosophers);
    mutex.signal();

    await philosopher.semaphore.wait();
  };

  const putFork = async (id, philosophers) => {
    const philosopher = philosophers.find((p) => p.id === id);

    await mutex.wait();

    // philosopher.status = "THINKING";
    setPhilosophers((prev) => {
      const newPhilosophers = [...prev];

      newPhilosophers.find((p) => p.id === id).status = "THINKING";

      return newPhilosophers;
    });

    test(philosopher.leftPhilosopher, philosophers);
    test(philosopher.rightPhilosopher, philosophers);
    mutex.signal();
  };

  const philosopherAction = async ({ id, philosophers }) => {
    const philosopher = philosophers.find((p) => p.id === id);

    while (true) {
      console.log(`${philosopher.name} is thinking...`);
      await philosopher.think();
      console.log(`${philosopher.name} is hungry...`);

      console.log(`${philosopher.name} is trying to take fork...`);
      await takeFork(id, philosophers);

      console.log(`${philosopher.name} is eating...`);
      await philosopher.eat();

      console.log(`${philosopher.name} is putting fork...`);
      await putFork(id, philosophers);
      console.log(`${philosopher.name} is done...`);

      if (!simulationOnRef.current) {
        break;
      }
    }
  };

  const handleStopSimulation = () => {
    mutex = new Semaphore(1);
    setSimulationOn(false);
    simulationOnRef.current = false;

    // setPhilosophers(generatePhilosophers(_philosophers.length));
  };

  const handleStartSimulation = () => {
    setSimulationOn(true);
    simulationOnRef.current = true;

    philosophersRef.current.forEach((philosopher) => {
      philosopherAction({
        id: philosopher.id,
        philosophers: philosophersRef.current,
      });
    });
  };

  const handleAddPhilosopher = () => {
    setPhilosophers(generatePhilosophers(philosophersRef.current.length + 1));
  };

  const handleRemovePhilosopher = () => {
    setPhilosophers(generatePhilosophers(philosophersRef.current.length - 1));
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
              <IconButton
                onClick={() => {
                  setPhilosophersOpen(!philosopherOpen);
                }}
                sx={{
                  fontSize: "1.5rem",
                }}
              >
                {philosopherOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </IconButton>
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
                  disabled={_philosophers.length >= 9 || simulationOn}
                >
                  Add Philosopher
                </Button>
              </Tooltip>
              <Tooltip title="Remove a Philosopher - Minimum 3 Philosophers required">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleRemovePhilosopher}
                  disabled={_philosophers.length <= 3 || simulationOn}
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
            philosopherOpen={philosopherOpen}
            philosophers={_philosophers}
            simulationOn={simulationOn}
            forks={forks}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
