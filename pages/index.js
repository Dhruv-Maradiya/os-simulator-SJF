"use client";
import SJFView from "../views/sjf";
import DinningPhilosophers from "../views/dinning-philosophers";
import { Box, Divider } from "@mui/material";
import CLookView from "../views/c-look";
import FIFOView from "../views/fifo";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <SJFView />
      <Divider />
      <DinningPhilosophers />
      <Divider />
      <CLookView />
      <Divider />
      <FIFOView />
    </Box>
  );
}
