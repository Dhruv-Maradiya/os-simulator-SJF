import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUpRounded";
import DinningPhilosopherIntro from "./DinningPhilosopherIntro";
import { useState } from "react";

export default function DinningPhilosopherView() {
  const [introOpen, setIntroOpen] = useState(false); // Controls the visibility of the introduction dialog

  return (
    <Container>
      <Card>
        <CardHeader title="Dinning Philosophers" />
        <CardContent>
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
        </CardContent>
      </Card>
    </Container>
  );
}
