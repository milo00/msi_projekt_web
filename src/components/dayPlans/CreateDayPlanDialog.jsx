import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { MenuItem } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import EditIcon from "@mui/icons-material/Edit";
import ChurchIcon from "@mui/icons-material/Church";
import CastleIcon from "@mui/icons-material/Castle";
import SailingIcon from "@mui/icons-material/Sailing";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import WaterIcon from "@mui/icons-material/Water";
import LandscapeIcon from "@mui/icons-material/Landscape";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CloseIcon from "@mui/icons-material/Close";
import DownhillSkiingIcon from "@mui/icons-material/DownhillSkiing";
import { ErrorToast } from "../toasts/ErrorToast";
import { SuccessToast } from "../toasts/SuccessToast";
import isValid from "date-fns/isValid";
import isBefore from "date-fns/isBefore";
import { doPost } from "../../components/utils/fetch-utils";

const icons = [
  {
    id: 0,
    value: 0,
    icon: <ChurchIcon sx={{ color: "primary.main" }} />,
  },
  {
    id: 1,
    value: 1,
    icon: <DirectionsWalkIcon sx={{ color: "primary.main" }} />,
  },
  {
    id: 2,
    value: 2,
    icon: <LocationCityIcon sx={{ color: "primary.main" }} />,
  },
  {
    id: 3,
    value: 3,
    icon: <LandscapeIcon sx={{ color: "primary.main" }} />,
  },
  {
    id: 4,
    value: 4,
    icon: <RestaurantIcon sx={{ color: "primary.main" }} />,
  },
  {
    id: 5,
    value: 5,
    icon: <CastleIcon sx={{ color: "primary.main" }} />,
  },
  {
    id: 6,
    value: 6,
    icon: <SailingIcon sx={{ color: "primary.main" }} />,
  },
  {
    id: 7,
    value: 7,
    icon: <WaterIcon sx={{ color: "primary.main" }} />,
  },
  {
    id: 8,
    value: 8,
    icon: <DownhillSkiingIcon sx={{ color: "primary.main" }} />,
  },
];

export const CreateDayPlanDialog = ({
  open,
  onClose,
  onSuccess,
  groupId,
  startDate,
  endDate,
}) => {
  const today = new Date();

  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [dayPlanName, setDayPlanName] = useState({ value: "", length: 0 });
  const [dayPlanNameError, setDayPlanNameError] = useState(
    "You have to provide day plan name."
  );
  const [creationError, setCreationError] = useState(
    "Ups! Something went wrong. Try again."
  );

  const [date, setDate] = useState(null);
  const [dateError, setDateError] = useState("You have to provide date.");

  const defaultInputValues = {
    dayPlanName: dayPlanName,
    icon: "0",
    date: today,
  };

  const [values, setValues] = useState(defaultInputValues);

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const onDayPlanNameChange = (value) => {
    setDayPlanNameError(
      value.length === 0 ? "You have to provide day plan name" : null
    );
    setDayPlanNameError(
      value.length > 99 ? "Day plan name too long, max. 100 characters" : null
    );
    setDayPlanName({ value: value, length: value.length });
  };

  const onDateChange = (value) => {
    if (!isValid(value)) {
      setDateError("You have to provide valid date.");
      setDate(null);
      return;
    }

    setDateError(
      isBefore(value, today) ? "Date cannot be earlier than current day." : null
    );
    setDate(value);
  };

  const validationSchema = Yup.object().shape({
    dayPlanName: Yup.string()
      .required("You have to provide day plan name")
      .max(100, "Day plan name too long, max. 100 characters"),
    date: Yup.date()
      .required("You have to provide date")
      .typeError("Invalid date."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleChange = (value) => {
    setValues(value);
  };

  const handleCreateDayPlan = async (values) => {
    setIsCreating(true);
    var postBody = {
      groupId: groupId,
      name: values.dayPlanName,
      date: values.date,
      iconType: values.icon,
    };
    await doPost("/api/v1/day-plan", postBody)
      .then((response) => {
        setSuccessToastOpen(response.ok);
        close();
        onSuccess();
      })
      .catch((err) => {
        setErrorToastOpen(true);
        setCreationError(err.message);
      });
    setIsCreating(false);
  };

  const close = () => {
    reset();
    setDayPlanName({ value: "", length: 0 });
    setDayPlanNameError("You have to provide day plan name");
    setDate(today);
    setDateError("You have to provide day plan date");
    setValues(defaultInputValues);
    onClose();
  };

  return (
    <div>
      <SuccessToast
        open={successToastOpen}
        onClose={() => setSuccessToastOpen(false)}
        message="Day plan created."
      />
      <ErrorToast
        open={errorToastOpen}
        onClose={() => setErrorToastOpen(false)}
        message={creationError}
      />

      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
          style: {
            minWidth: "400px",
            maxWidth: "400px",
            borderRadius: "0",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: "24px" }}>Create new day plan</Typography>
          <IconButton sx={{ p: 0 }} onClick={onClose}>
            <CloseIcon sx={{ color: "primary.main", fontSize: "32px" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleCreateDayPlan)}>
            <TextField
              type="string"
              autoFocus
              margin="normal"
              placeholder="Day plan name"
              name="day plan name"
              label="Day plan name"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EditIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
              {...register("dayPlanName")}
              error={
                Boolean(errors.dayPlanName) ? Boolean(dayPlanNameError) : false
              }
              helperText={Boolean(errors.dayPlanName) && dayPlanNameError}
              value={dayPlanName.value}
              onChange={(event) => onDayPlanNameChange(event.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
                width: "200px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* test */}
                {/* <DatePicker
                                    disablePast
                                    onChange={(newDate) => {
                                        handleChange({ ...values, date: newDate });
                                    }}
                                    value={values.date}
                                    label="Date"
                                    minDate={startDate}
                                    maxDate={endDate}
                                    sx={{
                                        svg: { color: "#2ab7ca" },
                                        my: 2
                                    }}
                                    onKeyDown={onKeyDown}
                                    margin="normal"
                                    {...register('date')}
                                    error={Boolean(errors.date) ? (Boolean(dateError)) : false}
                                    helperText={Boolean(errors.date) && dateError}
                                /> */}
                <Controller
                  name={"date"}
                  defaultValue={new Date()}
                  control={control}
                  sx={{ mb: 1 }}
                  render={({ field }) => (
                    <DatePicker
                      disablePast
                      label="Date"
                      sx={{
                        svg: { color: "#2ab7ca" },
                        mt: 1,
                        mb: 1,
                        width: "50%",
                        minWidth: "200px",
                      }}
                      // renderInput={(params) =>
                      //     <TextField
                      //         {...params}
                      //         onKeyDown={onKeyDown}
                      //         error={!!errors.date}
                      //         helperText={errors.date?.message}
                      //     />
                      // }
                      onKeyDown={onKeyDown}
                      error={!!errors.date}
                      helperText={errors.date?.message}
                      {...field}
                    />
                  )}
                />
                {/* <DatePicker
                                    disablePast
                                    onChange={(newDate) => {
                                        handleChange({ ...values, date: newDate });
                                    }}
                                    value={values.date}
                                    label="Date"
                                    minDate={startDate}
                                    maxDate={endDate}
                                    sx={{
                                        svg: { color: "#2ab7ca" },
                                        my: 2
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            // sx={{
                                            //     svg: { color: "#2ab7ca" },
                                            //     mb: "24px"
                                            // }}
                                            onKeyDown={onKeyDown}
                                            label="Date"
                                            type="date"
                                            margin="normal"
                                            value={values.date}
                                            {...register('date')}
                                            error={Boolean(errors.date) ? (Boolean(dateError)) : false}
                                            helperText={Boolean(errors.date) && dateError}
                                            onChange={(event) => {
                                                handleChange({ ...values, date: event.target.value });
                                            }}
                                        />
                                    }
                                /> */}
              </LocalizationProvider>
            </Box>
            <DialogContentText variant="body1" sx={{ mt: 1, mb: -1 }}>
              Icon:
            </DialogContentText>
            <Box>
              <TextField
                sx={{ minWidth: "52px", width: "52px" }}
                select
                margin="normal"
                name="icon"
                variant="outlined"
                SelectProps={{
                  IconComponent: () => null,
                  autoWidth: true,
                }}
                {...register("icon")}
                error={errors.icon ? true : false}
                helperText={errors.icon?.message}
                value={values.icon || ""}
                onChange={(event) => {
                  handleChange({ ...values, icon: event.target.value });
                }}
              >
                {icons.map((icon) => (
                  <MenuItem
                    key={icon.id}
                    value={icon.value}
                    sx={{ px: 2, py: 1 }}
                  >
                    <Box sx={{ px: 0 }}>{icon.icon}</Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <DialogActions>
              {isCreating ? (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: "0",
                    color: "#FFFFFF",
                    width: "120px",
                  }}
                >
                  <CircularProgress size="24px" sx={{ color: "#FFFFFF" }} />
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    sx={{ borderRadius: "0" }}
                    onClick={() => close()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "#FFFFFF",
                      width: "120px",
                    }}
                  >
                    Create
                  </Button>
                </>
              )}
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
