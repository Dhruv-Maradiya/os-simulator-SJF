import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

const groupMembers = [
  {
    name: "Dhruv Maradiya",
    eno: "22BCP480D",
    desc: "I am Dhruv Maradiya, a full-stack developer and a competitive programmer. I am interested in machine learning and data science.",
  },
  {
    name: "Neet Patel",
    eno: "22BCP242",
    desc: "Hello! I am Neet Patel. Mobile App Developer in Java and Kotlin. Interested in Cross-Platform App Development using Flutter and Kotlin.",
  },
  {
    name: "Krish Patel",
    eno: "22BCP243",
    desc: "I am Krish Patel, a front-end web developer and currently learning back-end development. I am interested in competitive programming.",
  },
  {
    name: "Neel Ganatra",
    eno: "22BCP472D",
    desc: "I am Neel Ganatra, a full-stack developer using Node.js and React.js. I am interested in learning new technologies and frameworks.",
  },
  {
    name: "Lakshy Mehta",
    eno: "22BCP482D",
    desc: "I am Lakshy Mehta, currently exploring the field of Data Science and Machine Learning. I am interested in learning new technologies.",
  },
  {
    name: "Meet Patel",
    eno: "22BCP240",
    desc: "I am Meet Patel, a Android developer using Kotlin. Currently learning Cross-Platform technologies like Flutter.",
  },
].sort((a, b) => (a.name > b.name ? 1 : -1));

const MembersView = () => {
  return (
    <Container>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 2,
          mt: 4,
          gridIem: "center",
        }}
      >
        {groupMembers.map((member) => (
          <Card
            key={member.name}
            sx={{
              "&:hover": {
                cursor: "pointer",
                transform: "scale(1.05)",
                transition: "transform 0.2s",
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: "2rem",
                  backgroundColor: "warning.main",
                }}
              >
                {member.name[0] + member.name.split(" ")[1][0]}
              </Avatar>
              <Typography variant="h5" color="primary.main">
                {member.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                {member.eno}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                {member.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default MembersView;
