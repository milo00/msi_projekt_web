import * as React from "react";
import { useState } from "react";
import { useMemo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { MenuItem } from "@mui/material";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { DialogContent } from "@mui/material";
import { DialogActions } from "@mui/material";
import { DialogTitle } from "@mui/material";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputAdornment } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { UpdatedTripConfirmationDialog } from "./UpdatedTripConfirmationDialog";
import { ErrorTripConfirmationDialog } from "./ErrorTripConfirmationDialog";
import { doGet } from "../../components/utils/fetch-utils";
import { doPatch } from "../../components/utils/fetch-utils";
import { useEffect } from "react";
import Rule from "@mui/icons-material/Rule";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const currencies = [
  {
    id: 1,
    value: "USD",
    label: "USD",
  },
  {
    id: 2,
    value: "EUR",
    label: "EUR",
  },
  {
    id: 3,
    value: "PLN",
    label: "PLN",
  },
  {
    id: 4,
    value: "CZK",
    label: "CZK",
  },
  {
    id: 5,
    value: "GBP",
    label: "GBP",
  },
  {
    id: 6,
    value: "HRK",
    label: "HRK",
  },
  {
    id: 7,
    value: "UAH",
    label: "UAH",
  },
  {
    id: 8,
    value: "JPY",
    label: "JPY",
  },
];

export const TripGroupOptionsDialog = ({ open, onClose, groupId }) => {
  const [confirmUpdatedDialogOpen, setConfirmUpdateDialogOpen] =
    useState(false);
  const [confirmErrorDialogOpen, setConfirmErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [tripData, setTripData] = useState({});
  const [groupStage, setGroupStage] = useState([]);
  const DESCRIPTION_LIMIT = 120;

  useEffect(() => {
    if (groupId) {
      getTripData();
    }
  }, []);

  const getTripData = async () => {
    setIsLoading(true);
    await doGet(
      "/api/v1/trip-group/data?" +
        new URLSearchParams({ groupId: groupId }).toString()
    )
      .then((response) => response.json())
      .then((response) => {
        setNecessaryData(response);
      })
      .catch((err) => console.log("Request Failed", err));
    setIsLoading(false);
  };

  useEffect(() => {
    reset(tripData);
  }, [tripData]);

  const validationSchema = Yup.object().shape({
    tripName: Yup.string()
      .required("You have to provide trip name")
      .max(50, "Too long name, max. 50 characters"),
    destiantion: Yup.string()
      .required("You have to provide destination")
      .max(100, "Too long starting location, max. 100 characters"),
    currency: Yup.string().required(
      "You have to provide currency for trip group"
    ),
    // minDays: Yup
    //     .number()
    //     .min(1, "Number of days must be equal or higher than 1")
    //     .required("You have to provide duration of the trip"),
    // minParticipants: Yup
    //     .number()
    //     .min(1, "Number of participants must be equal or higher than 1")
    //     .required("You have to provide min number of participants"),
    description: Yup.string().max(
      DESCRIPTION_LIMIT,
      "You have exceeded characters limit for description"
    ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => {
      return tripData;
    }, [tripData]),
  });

  const setNecessaryData = (response) => {
    setDescriptionLength(response.description.length);
    setTripData({
      tripName: response.name,
      //zamiana na destination?
      destination: response.destinationLocation,
      currency: response.currency,
      // minDays: response.minimalNumberOfDays,
      // minParticipants: response.minimalNumberOfParticipants,
      description: response.description,
    });
    setGroupStage(response.groupStage);
  };
  const handleUpdateTrip = () => {
    editUserAccount(getValues());
  };

  const handleSuccess = () => {
    setConfirmUpdateDialogOpen(true);
  };

  const close = () => {
    reset();
    onClose();
  };

  const editUserAccount = async (values) => {
    setIsUpdating(true);
    console.log("hello there");
    console.log(values);
    var postBody = {
      name: values.tripName,
      currency: values.currency,
      description: values.description,
      // zmiana na destination?
      destinationLocation: values.destination,
      // 'minimalNumberOfDays': values.minDays,
      // 'minimalNumberOfParticipants': values.minParticipants
    };

    await doPatch(
      "/api/v1/trip-group/group?" +
        new URLSearchParams({ groupId: groupId }).toString(),
      postBody
    )
      .then((response) => {
        getTripData();
        handleSuccess();
      })
      .catch((err) => {
        setConfirmErrorDialogOpen(true);
        setErrorMessage(err.message);
        console.log("Request Failed", err.message);
      });
    setIsUpdating(false);
  };

  const isPlanningStage = groupStage === "PLANNING_STAGE" ? false : true;
  const descriptionWatch = watch("description");

  return (
    <>
      <UpdatedTripConfirmationDialog
        open={confirmUpdatedDialogOpen}
        onClose={() => setConfirmUpdateDialogOpen(false)}
      />
      <ErrorTripConfirmationDialog
        open={confirmErrorDialogOpen}
        onClose={() => setConfirmErrorDialogOpen(false)}
        message={errorMessage}
      />
      <Dialog open={open} onClose={onClose}>
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: "32px" }}>Trip group settings</Typography>
          <IconButton sx={{ p: 0 }} onClick={onClose}>
            <CloseIcon sx={{ color: "primary.main", fontSize: "32px" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: "100%",
              position: "relative",
            }}
          >
            <Box sx={{ height: "100%", width: "100%" }}>
              {isLoading ? (
                <Box
                  sx={{
                    minHeight: "485px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleSubmit(handleUpdateTrip)}>
                  <TextField
                    sx={{ mt: "30px" }}
                    type="string"
                    autoFocus
                    margin="normal"
                    placeholder="Trip name"
                    disabled={isPlanningStage}
                    name="trip name"
                    label="Trip name"
                    defaultValue={tripData.tripName}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EditIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    {...register("tripName")}
                    error={!!errors.tripName}
                    helperText={errors.tripName?.message}
                  />

                  <TextField
                    type="string"
                    margin="normal"
                    placeholder="Destination"
                    name="destination"
                    defaultValue={tripData.destinationLocation}
                    disabled={isPlanningStage}
                    label="Destination"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    {...register("destination")}
                    error={!!errors.destination}
                    helperText={errors.destination?.message}
                  />
                  <Box sx={{ display: "flex" }}>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          sx={{
                            minWidth: "150px",
                            width: "150px",
                            mr: 5,
                          }}
                          fullWidth
                          select
                          margin="normal"
                          variant="outlined"
                          defaultValue={tripData.currency}
                          disabled={isPlanningStage}
                          label="Currency"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CurrencyExchangeIcon
                                  sx={{
                                    color: "primary.main",
                                    mr: "10px",
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          value={value}
                          onChange={onChange}
                          error={!!errors.currency}
                          helperText={errors.currency?.message}
                        >
                          {currencies.map((currency) => (
                            <MenuItem
                              key={currency.label}
                              value={currency.value}
                            >
                              {currency.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    {/* <TextField
                                                        sx={{ minWidth: "150px", width: "150px" }}
                                                        type="number"
                                                        margin="normal"
                                                        placeholder='Number of days'
                                                        name='minDays'
                                                        defaultValue={tripData.minDays}
                                                        disabled={isPlanningStage}
                                                        label='Number of days'
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <AccessTimeIcon sx={{ color: "primary.main" }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        {...register('minDays')}
                                                        error={!!errors.minDays}
                                                        helperText={errors.minDays?.message}
                                                    /> */}
                    {/* <TextField
                                                        sx={{ minWidth: "150px", width: "150px" }}
                                                        type="number"
                                                        margin="normal"
                                                        placeholder='Min participants'
                                                        name='minParticipants'
                                                        defaultValue={tripData.minParticipants}
                                                        disabled={isPlanningStage}
                                                        label='Min participants'
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PeopleAltOutlinedIcon sx={{ color: "primary.main" }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        {...register('minParticipants')}
                                                        error={!!errors.minParticipants}
                                                        helperText={errors.minParticipants?.message}
                                                    /> */}
                  </Box>
                  <TextField
                    type="string"
                    margin="normal"
                    multiline
                    rows={4}
                    placeholder="Description"
                    name="description"
                    label="Description"
                    defaultValue={tripData.description}
                    disabled={isPlanningStage}
                    fullWidth
                    variant="outlined"
                    {...register("description")}
                    error={!!errors.description}
                  />
                  <FormHelperText
                    error={!!errors.description}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 10px",
                      pb: "10px",
                    }}
                  >
                    <span>{errors.description?.message}</span>
                    <span>
                      {descriptionWatch ? descriptionWatch.length : 0}/
                      {DESCRIPTION_LIMIT}
                    </span>
                  </FormHelperText>
                  {!isPlanningStage ? (
                    <DialogActions>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          borderRadius: "0",
                          color: "#FFFFFF",
                          width: "140px",
                        }}
                      >
                        {isUpdating ? (
                          <CircularProgress
                            size="24px"
                            sx={{ color: "#FFFFFF" }}
                          />
                        ) : (
                          "Update data"
                        )}
                      </Button>
                    </DialogActions>
                  ) : (
                    <Box></Box>
                  )}
                </form>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
