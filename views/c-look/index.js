import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { Collapse } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUpRounded";
import Chart from "../../@core/components/react-apexcharts";

const CLookView = () => {
  const [diskSize, setDiskSize] = useState("200");
  const [headPosition, setHeadPosition] = useState("50");
  const [direction, setDirection] = useState("right");
  const [requestList, setRequestList] = useState([
    176, 79, 34, 60, 92, 11, 41, 114,
  ]);
  const [isIntroductionOpen, setIsIntroductionOpen] = useState(false);

  const [totalSeekCount, setTotalSeekCount] = useState(0);
  const [sequence, setSequence] = useState([]);

  const options = useMemo(() => {
    return {
      options: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "C-Look Disk Scheduling",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          labels: {
            show: false,
          },
        },
        yaxis: {
          title: {
            text: "Requests",
          },
          max:
            diskSize && sequence.length
              ? Number(diskSize)
              : Math.max(...sequence) + 10,
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
        tooltip: {
          enabled: false,
        },
        noData: {
          text: "No options found",
        },
      },
      series: [
        {
          name: "Requests",
          data: sequence,
        },
      ],
    };
  }, [sequence, diskSize]);

  const handleIntroductionToggle = () => {
    setIsIntroductionOpen(!isIntroductionOpen);
  };

  const handleDiskSizeChange = (event) => {
    setDiskSize(event.target.value);
  };

  const handleHeadPositionChange = (event) => {
    setHeadPosition(event.target.value);
  };

  const handleDirectionChange = (event) => {
    setDirection(event.target.value);
  };

  const handleRequestListChange = (event) => {
    const input = event.target.value;

    if (!input) {
      setRequestList([]);
      return;
    }

    const numbers = input.split(" ").map((number) => {
      const parsed = parseInt(number, 10);
      return isNaN(parsed) ? 0 : parsed;
    });

    setRequestList(numbers);
  };

  const handleExecute = () => {
    if (!diskSize || !headPosition || !requestList.length) {
      toast.error("Please fill all the fields");
      return;
    }

    const disk = parseInt(diskSize, 10);
    let head = parseInt(headPosition, 10);

    if (isNaN(disk) || isNaN(head)) {
      toast.error("Disk size and head position must be numbers");
      return;
    }

    const requests = requestList.filter((request) => request <= disk);

    if (requests.length === 0) {
      toast.error("No valid requests found");
      return;
    }

    const sortedRequests = requests.sort((a, b) => a - b);
    const left = sortedRequests.filter((request) => request < head);
    const right = sortedRequests.filter((request) => request > head);

    let totalSeekCount = 0;
    const sequence = [];

    if (direction === "right") {
      for (let i = 0; i < right.length; i++) {
        const current = right[i];

        const distance = Math.abs(current - head);

        totalSeekCount += distance;

        sequence.push(current);
        head = current;
      }

      for (let i = 0; i < left.length; i++) {
        const current = left[i];

        const distance = Math.abs(current - head);

        totalSeekCount += distance;

        sequence.push(current);
        head = current;
      }
    } else {
      const leftReversed = left.reverse();
      const rightReversed = right.reverse();

      for (let i = 0; i < leftReversed.length; i++) {
        const current = leftReversed[i];

        const distance = Math.abs(current - head);

        totalSeekCount += distance;

        sequence.push(current);
        head = current;
      }

      for (let i = 0; i < rightReversed.length; i++) {
        const current = right[i];

        const distance = Math.abs(current - head);

        totalSeekCount += distance;

        sequence.push(current);
        head = current;
      }
    }

    setTotalSeekCount(totalSeekCount);
    setSequence(sequence);
  };

  return (
    <Container>
      <Card sx={{ "&:focus": { backgroundColor: "transparent" } }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 4,
          }}
        >
          <Typography variant="h4" align="center">
            C-Look Disk Scheduling
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Introduction</Typography>
            <IconButton
              onClick={handleIntroductionToggle}
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {isIntroductionOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </Box>

          <Collapse in={isIntroductionOpen}>
            <Typography variant="body1">
              C-Look is a disk scheduling algorithm that is a variation of the
              Look algorithm. It is used to reduce the seek time of the disk
              arm. The C-Look algorithm scans the disk in one direction until it
              reaches the end of the disk, then it jumps to the other end of the
              disk and continues scanning in the same direction. This algorithm
              is more efficient than the Look algorithm because it reduces the
              seek time by avoiding the unnecessary scanning of the disk in the
              reverse direction.
            </Typography>

            <List>
              <Typography variant="body1">
                The C-Look algorithm works as follows:
              </Typography>
              <ListItem>
                <Typography variant="body1">
                  1. The disk arm starts at the head position and moves in the
                  specified direction (right or left).
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body1">
                  2. The disk arm scans the disk in the specified direction
                  until it reaches the end of the disk.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body1">
                  3. The disk arm jumps to the other end of the disk and
                  continues scanning in the same direction.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body1">
                  4. The disk arm stops when it has visited all the requested
                  disk locations.
                </Typography>
              </ListItem>
            </List>
          </Collapse>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <FormLabel>Enter the disk size </FormLabel>
              <TextField
                value={diskSize}
                onChange={handleDiskSizeChange}
                size="small"
                fullWidth
                placeholder="Enter disk size"
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Enter the head position </FormLabel>
              <TextField
                value={headPosition}
                onChange={handleHeadPositionChange}
                size="small"
                fullWidth
                placeholder="Enter head position"
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>
                Enter the order of requests (space-separated numbers)
              </FormLabel>
              <TextField
                value={requestList.join(" ")}
                onChange={handleRequestListChange}
                size="small"
                fullWidth
                placeholder="Enter order of requests"
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel>Choose the direction</FormLabel>
              <RadioGroup value={direction} onChange={handleDirectionChange}>
                <FormControlLabel
                  value="right"
                  control={<Radio />}
                  label="Right (Moving from left to right)"
                />
                <FormControlLabel
                  value="left"
                  control={<Radio />}
                  label="Left (Moving from right to left)"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={handleExecute}
            sx={{ width: "fit-content" }}
          >
            Execute C-Look
          </Button>

          <Divider />

          <Typography variant="h6">Output</Typography>

          <Box
            sx={{
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 0.5,
              }}
            >
              <Typography variant="body1">
                Total seek count: {totalSeekCount}
              </Typography>

              <Typography variant="body1">
                Sequence: {sequence.join(" -> ")}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 0.5,
              }}
            >
              <Chart
                options={options.options}
                series={options.series}
                type="line"
                height={350}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CLookView;
