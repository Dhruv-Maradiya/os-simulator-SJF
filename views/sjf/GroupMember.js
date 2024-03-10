import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const GroupMember = ({ groupMembers, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h5" align="center">
          Group Members
        </Typography>
        <TableContainer
          sx={{
            mt: 2,
          }}
        >
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
      </DialogContent>
    </Dialog>
  );
};

export default GroupMember;
