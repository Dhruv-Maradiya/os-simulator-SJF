"use client";

import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const statusColorMapping = {
  THINKING: "primary",
  HUNGRY: "warning",
  EATING: "success",
  Unknown: "error",
};

const processTime = ({ start, end }) => {
  let _fullTime = "",
    _formattedTime = "",
    timeInSec = "";

  if (start && start.isValid()) {
    _fullTime = `${start.format("DD/MM/YYYY HH:mm:ss")} - `;
    _formattedTime = `${start.format("HH:mm:ss")} - `;

    if (end && end.isValid()) {
      _fullTime += end.format("DD/MM/YYYY HH:mm:ss");
      _formattedTime += end.format("HH:mm:ss");

      timeInSec = end.diff(start, "seconds");

      _formattedTime += ` (${timeInSec} sec)`;
      _fullTime += ` (${timeInSec} sec)`;
    }
  }

  return { fullTime: _fullTime, formattedTime: _formattedTime, timeInSec };
};

// Styled TabList component
const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: "0 !important",
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
  },
}));

const LogRow = ({ log, philosopher }) => {
  let thinking = {
    start: moment(log.thinkingStartAt),
    end: moment(log.thinkingEndAt),
    fullTime: "",
    formattedTime: "",
    timeInSec: "",
  };
  let waiting = {
    start: moment(log.forksTryToAcquireAt),
    end: moment(log.forksAcquiredAt),
    fullTime: "",
    formattedTime: "",
    timeInSec: "",
  };
  let eating = {
    start: moment(log.eatingStartAt),
    end: moment(log.eatingEndAt),
    fullTime: "",
    formattedTime: "",
    timeInSec: "",
  };
  let hungry = {
    start: moment(log.hungryStartAt),
    fullTime: "",
    formattedTime: "",
  };

  thinking = processTime(thinking);
  waiting = processTime(waiting);
  eating = processTime(eating);
  hungry = processTime(hungry);

  return (
    <TableRow>
      <TableCell>{philosopher?.name ?? "Unknown or Removed"}</TableCell>
      <TableCell>
        <Tooltip title={thinking.fullTime}>
          <Typography>{thinking.formattedTime}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip title={hungry.fullTime.replace("-", "")}>
          <Typography>{hungry.formattedTime.replace("-", "")}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip title={waiting.fullTime}>
          <Typography>{waiting.formattedTime}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip title={eating.fullTime}>
          <Typography>{eating.formattedTime}</Typography>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

const SimpleLogView = ({ logs, philosophers }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Philosopher</TableCell>
            <TableCell>Thinking</TableCell>
            <TableCell>Becomes Hungry</TableCell>
            <TableCell>Waiting</TableCell>
            <TableCell>Eating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, i) => {
            const philosopher = philosophers.find(
              (p) => p.id === log.philosopher
            );

            return (
              <LogRow key={i} log={log} philosopher={philosopher || null} />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const FormattedLogRow = ({ logs, philosopher }) => {
  const [open, setOpen] = useState(false);

  const _logs = logs.filter((l) => l.philosopher === philosopher?.id);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{philosopher?.name || "Unknown or Removed"}</TableCell>
        <TableCell>
          <Chip
            label={philosopher?.status || "Unknown"}
            color={statusColorMapping[philosopher?.status || "Unknown"]}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detailed Logs
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Philosopher</TableCell>
                    <TableCell>Thinking</TableCell>
                    <TableCell>Becomes Hungry</TableCell>
                    <TableCell>Waiting</TableCell>
                    <TableCell>Eating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_logs.map((log, i) => {
                    return (
                      <LogRow key={i} log={log} philosopher={philosopher} />
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const FormattedLogView = ({ logs, philosophers }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Philosopher</TableCell>
            <TableCell>Current Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {philosophers.map((philosopher) => {
            return (
              <FormattedLogRow
                key={philosopher.id}
                logs={logs}
                philosopher={philosopher}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Timestamps = ({ LogsOpen, logs, philosophers }) => {
  const [tabValues, setTabValues] = useState("logs"); // logs, formatted

  const handleTabChange = (event, newValue) => {
    setTabValues(newValue);
  };

  return (
    <Collapse in={LogsOpen}>
      <Box>
        <TabContext value={tabValues}>
          <TabList onChange={handleTabChange} centered>
            <Tabs value={tabValues} onChange={handleTabChange}>
              <Tab label="Simple" value="logs" />
              <Tab label="Grouped" value="formatted" />
            </Tabs>
          </TabList>

          <TabPanel value="logs">
            <SimpleLogView logs={logs} philosophers={philosophers} />
          </TabPanel>
          <TabPanel value="formatted">
            <FormattedLogView logs={logs} philosophers={philosophers} />
          </TabPanel>
        </TabContext>
      </Box>
    </Collapse>
  );
};

export default Timestamps;
