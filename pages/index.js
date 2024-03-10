"use client";
import SJFView from "../views/sjf";
import DinningPhilosophers from "../views/dinning-philosophers";
import { Box, Divider } from "@mui/material";

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
    </Box>
  );
}
