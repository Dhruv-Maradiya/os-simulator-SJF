"use client";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const views = [
  {
    title: "Shortest Job First",
    image: <Image src="/sjf.jpg" width={250} height={250} />,
    desc: "Shortest Job First (SJF) is a scheduling algorithm that selects the waiting process with the smallest execution time to execute next. SJF is a non-preemptive algorithm that is used to minimize the waiting time for the processes.",
    to: "/sjf",
  },
  {
    title: "Dinning Philosopher",
    image: <Image src="/dining-philosophers.gif" width={250} height={250} />,
    desc: "The dining philosophers problem is a classic synchronization problem in computer science. It is a problem that shows the importance of synchronization and the problems that can arise from it.",
    to: "/dinning-philosophers",
  },
  {
    title: "C-Look Disk Scheduling",
    image: <Image src="/c-look.webp" width={250} height={250} />,
    desc: "C-LOOK is a disk scheduling algorithm that is a modified version of LOOK. It is a more efficient version of LOOK. In this algorithm, the disk arm is allowed to move only in one direction.",
    to: "/c-look",
  },
  {
    title: "First In First Out (FIFO)",
    image: <Image src="/fifo.png" width={250} height={250} />,
    desc: "First In First Out (FIFO) is a scheduling algorithm that selects the process that has been in the queue the longest to execute next. FIFO is a non-preemptive algorithm that is used to minimize the waiting time for the processes.",
    to: "/fifo",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginTop: 4,
        }}
      >
        {views.map((view, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              "&:hover": {
                transform: "scale(1.02)",
                transition: "transform 0.3s",
                cursor: "pointer",
              },
            }}
            onClick={() => {
              router.push(view.to);
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {view.image}
              <Typography variant="h5">{view.title}</Typography>
              <Typography variant="body2">{view.desc}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
