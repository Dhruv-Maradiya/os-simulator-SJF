"use client";

import Fork from "@mui/icons-material/Flatware";
import PersonIcon from "@mui/icons-material/Person3";
import RiceBowlIcon from "@mui/icons-material/RiceBowl";
import { Box, Collapse, Tooltip, useTheme } from "@mui/material";

const radius = 25;

const calculatePosition = (i, deg) => {
  const angle = deg * i + deg / 2;

  const left = radius * 2 + 40 * Math.cos((angle * Math.PI) / 180);
  const top = radius * 2 + 40 * Math.sin((angle * Math.PI) / 180);

  return { top, left, angle: (angle * Math.PI) / 180 + Math.PI / 2 };
};

const getForkColor = (fork, philosophers) => {
  let color = null;

  const left = philosophers.find((p) => p.id === fork.leftPhilosopher);
  const right = philosophers.find((p) => p.id === fork.rightPhilosopher);

  if (left.status === "EATING") {
    color = left.color;
  } else if (right.status === "EATING") {
    color = right.color;
  }

  return color;
};

const PhilosopherView = ({ color, i, deg, status, simulationOn }) => {
  const left = radius * 2 + 40 * Math.cos((deg * i * Math.PI) / 180);
  const top = radius * 2 + 40 * Math.sin((deg * i * Math.PI) / 180);
  const angle = (deg * i * Math.PI) / 180 + Math.PI / 2;

  const theme = useTheme();

  const tooltipBgColor =
    status === "EATING"
      ? theme.palette.success.main
      : status === "THINKING"
      ? theme.palette.info.main
      : theme.palette.error.main;

  return (
    <Box
      sx={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <Tooltip
        title={status}
        placement="top"
        open={simulationOn}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: tooltipBgColor,
              "& .MuiTooltip-arrow": {
                color: theme.palette.getContrastText(tooltipBgColor),
              },
            },
          },
        }}
      >
        <PersonIcon
          sx={{
            color: color,
            transform: `rotate(${angle}rad)`,
            fontSize: "4rem",
          }}
        />
      </Tooltip>
    </Box>
  );
};

const Philosophers = ({
  philosopherOpen,
  philosophers,
  simulationOn,
  forks,
}) => {
  const deg = 360 / philosophers.length;

  console.log({ forks });

  return (
    <Collapse in={philosopherOpen}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              padding: 10,
              position: "relative",
              transform: "rotate(-90deg)",
            }}
          >
            {/* Dinning Table */}
            <Box
              sx={{
                width: (theme) => theme.spacing(radius * 2),
                height: (theme) => theme.spacing(radius * 2),
                borderRadius: "50%",
                backgroundColor: (theme) => theme.palette.grey[300],
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Tooltip title="Rice Bowl">
                <RiceBowlIcon
                  sx={{
                    color: (theme) => theme.palette.grey[800],
                    fontSize: "4rem",
                    transform: "rotate(90deg)",
                  }}
                />
              </Tooltip>
              {/* Forks */}
              <Box>
                {forks.map((fork, i) => {
                  const { top, left, angle } = calculatePosition(i, deg);

                  const color = getForkColor(fork, philosophers);

                  return (
                    <Box
                      key={i}
                      sx={{
                        position: "absolute",
                        left: `${left}%`,
                        top: `${top}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Tooltip title={fork.name}>
                        <Fork
                          sx={{
                            color: color
                              ? color
                              : (theme) => theme.palette.grey[700],
                            transform: `rotate(${angle}rad)`,
                            fontSize: "3rem",
                          }}
                        />
                      </Tooltip>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box>
              {philosophers.map(({ id, color, status }, i) => {
                return (
                  <PhilosopherView
                    key={id}
                    color={color}
                    i={i}
                    deg={deg}
                    status={status}
                    simulationOn={simulationOn}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
};

export default Philosophers;
