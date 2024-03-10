"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const defaultValues = {
  name: "",
  arrivalTime: "",
  burstTime: "",
};

const schema = yup.object().shape({
  name: yup.string().required(),
  arrivalTime: yup
    .number()
    .required("Arrival time is required.")
    .min(0, "Arrival time must be greater than or equal to 0.")
    .typeError("Arrival time must be a number."),
  burstTime: yup
    .number()
    .required("Burst time is required.")
    .min(1, "Burst time must be greater than 0.")
    .typeError("Burst time must be a number."),
});

const AddProcessDialog = ({
  open,
  onClose,
  handleAdd,
  handleEdit,
  editData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const submit = (data) => {
    if (editData) handleEdit(editData.id, data);
    else handleAdd(data);
    handleClose();
    reset();
  };

  useEffect(() => {
    if (editData) {
      setValue("name", editData?.name ?? "");
      setValue("arrivalTime", editData?.arrivalTime ?? "");
      setValue("burstTime", editData?.burstTime ?? "");
    }
  }, [editData]);

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editData ? "Edit Process" : "Add New Process"}
        </DialogTitle>
        <DialogContent>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Process Name"
                  type="text"
                  size="small"
                  fullWidth
                  value={value}
                  onChange={onChange}
                />
                {errors.name && (
                  <FormHelperText error>{errors.name.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="arrivalTime"
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth>
                <TextField
                  margin="dense"
                  id="name"
                  label="Arrival Time"
                  type="number"
                  size="small"
                  fullWidth
                  value={value}
                  onChange={onChange}
                />
                {errors.arrivalTime && (
                  <FormHelperText error>
                    {errors.arrivalTime.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="burstTime"
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth>
                <TextField
                  margin="dense"
                  id="name"
                  label="Burst Time"
                  size="small"
                  type="number"
                  fullWidth
                  value={value}
                  onChange={onChange}
                />
                {errors.burstTime && (
                  <FormHelperText error>
                    {errors.burstTime.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit(submit)}>
            {editData ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AddProcessDialog;
