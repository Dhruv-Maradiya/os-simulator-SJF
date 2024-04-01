import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUpRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const FIFOView = () => {
  const [isIntroductionOpen, setIsIntroductionOpen] = useState(false);

  const [frames, setFrames] = useState(5);
  const [referenceString, setReferenceString] = useState([
    2, 5, 7, 6, 1, 2, 5, 4, 3, 2, 1, 0, 4, 3, 2, 1,
  ]);

  const [tableData, setTableData] = useState([]); // Table data for the output
  const [hitRate, setHitRate] = useState(0); // Hit rate for the output

  const handleIntroductionToggle = () => {
    setIsIntroductionOpen(!isIntroductionOpen);
  };

  const handleReferenceChange = (event) => {
    const input = event.target.value;

    if (!input) {
      setReferenceString([]);
      return;
    }

    const numbers = input.split(" ").map((number) => {
      const parsed = parseInt(number, 10);
      return isNaN(parsed) ? 0 : parsed;
    });
    setReferenceString(numbers);
  };

  const handleFramesChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setFrames(null);
      return;
    }

    setFrames(parseInt(value));
  };

  const handleExecute = () => {
    if (!frames) {
      toast.error("Please enter the number of frames");
      return;
    }

    if (referenceString.length === 0) {
      toast.error("Please enter the reference string");
      return;
    }

    const tableData = [];
    const queue = [];

    let pageFaults = 0;
    let hit = 0;

    for (let i = 0; i < referenceString.length; i++) {
      const page = referenceString[i];

      if (queue.includes(page)) {
        hit++;
        tableData.push({
          page,
          frame: queue.join(" "),
          hit: "Yes",
        });
      } else {
        pageFaults++;
        tableData.push({
          page,
          frame: queue.join(" "),
          hit: "No",
        });

        if (queue.length < frames) {
          queue.push(page);
        } else {
          queue.shift();
          queue.push(page);
        }
      }
    }

    const hitRate = (hit / referenceString.length) * 100;
    setHitRate(hitRate.toFixed(2));
    setTableData(tableData);
  };

  return (
    <Container>
      <Card>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 4,
          }}
        >
          <Typography variant="h4" align="center">
            FIFO Page Replacement Algorithm
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
              The First-In-First-Out (FIFO) page replacement algorithm is the
              simplest page replacement algorithm. In this algorithm, the page
              that has been in memory the longest is the one selected for
              replacement. The FIFO algorithm is easy to implement and can be
              implemented using a queue data structure.
            </Typography>
          </Collapse>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <FormLabel>Enter the number of frames</FormLabel>
              <TextField
                value={frames}
                onChange={handleFramesChange}
                size="small"
                fullWidth
                placeholder="Enter the number of frames"
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Enter the references </FormLabel>
              <TextField
                value={referenceString?.join(" ") || ""}
                onChange={handleReferenceChange}
                size="small"
                fullWidth
                placeholder="Enter the reference string"
              />
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={handleExecute}
            sx={{ width: "fit-content" }}
          >
            Execute FIFO
          </Button>

          <Divider />

          <Typography variant="h6">Output</Typography>

          {tableData.length > 0 && (
            <Box>
              <Typography variant="body1">Hit rate: {hitRate}%</Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Page</TableCell>
                        <TableCell>Frames</TableCell>
                        <TableCell>Hit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.page}</TableCell>
                          <TableCell>{row.frame || "Empty"}</TableCell>
                          <TableCell>
                            {row.hit === "Yes" ? (
                              <CheckIcon color="success" />
                            ) : (
                              <CloseIcon color="error" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default FIFOView;
