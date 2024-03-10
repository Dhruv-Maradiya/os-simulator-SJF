import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const groupMembers = [
  {
    name: "Dhruv Maradiya",
    eno: "22BCP480D",
  },
  {
    name: "Neet Patel",
    eno: "22BCP242",
  },
  {
    name: "Krish Patel",
    eno: "22BCP243",
  },
  {
    name: "Neel Ganatra",
    eno: "22BCP472D",
  },
  {
    name: "Lakshy Mehta",
    eno: "22BCP482D",
  },
  {
    name: "Meet Patel",
    eno: "22BCP240",
  },
];

const MembersView = () => {
  return (
    <Card>
      <CardHeader title="Group Members" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead
              sx={{
                backgroundColor: (theme) => theme.palette.grey[200],
              }}
            >
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Enrollment No.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupMembers
                .sort((a, b) => (a.name < b.name ? 1 : 0))
                .map((member, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.eno}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default MembersView;
