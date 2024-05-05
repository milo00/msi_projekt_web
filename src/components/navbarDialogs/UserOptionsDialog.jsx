import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import { DialogContent } from "@mui/material";
import { DialogTitle } from "@mui/material";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputAdornment } from "@mui/material";
import { Avatar } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { TextField } from "@mui/material";
import { DialogActions } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { doGet } from "../../components/utils/fetch-utils";
import { doPatch } from "../../components/utils/fetch-utils";
import { UpdatedUserConfirmationDialog } from "./UpdatedUserConfirmationDialog";
import { ErrorToast } from "../toasts/ErrorToast";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export const UserOptionsDialog = ({ open, onClose, userData }) => {
  const today = new Date();
  // const [userData, setUserData] = useState([])
  const [confirmUpdatedDialogOpen, setConfirmUpdateDialogOpen] =
    useState(false);
  const [confirmErrorToastOpen, setConfirmErrorToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // useEffect(() => {
  //     getUserData();
  // }, []);

  // useEffect(() => {
  //     getUserData();
  // }, [open]);

  // const getUserData = async () => {
  //     await doGet('/api/v1/user?' + new URLSearchParams({ userId: sessionStorage.getItem("userId") }).toString())
  //         .then(response => response.json())
  //         .then(response => {
  //             setNecessaryData(response);
  //         })
  //         .catch(err => console.log('Request Failed', err));
  // };

  // const setNecessaryData = (response) => {
  //     const allPhoneNumber = response.phoneNumber.split(" ");
  //     var code = allPhoneNumber[0].slice();
  //     code = code.slice(1, code.length)
  //     const phoneNumber = allPhoneNumber[1];
  //     setUserData({
  //         userId: response.userId, email: response.email, firstName: response.firstName, surname: response.surname,
  //         code: code, phone: phoneNumber, birthDate: response.birthday
  //     });
  //     console.log(response.birthday);
  // };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("You have to provide first name")
      .max(50, "Too long first name, max. 50 characters"),
    surname: Yup.string()
      .required("You have to provide surname")
      .max(50, "Too long surname, max. 50 characters"),
    code: Yup.string()
      .required("You have to provide country code")
      .min(1, "Country code too short")
      .max(4, "Country code too long")
      .matches(/^[0-9]{1,4}$/, "Country code is not valid"),
    phone: Yup.string()
      .required("You have to provide phone number")
      .min(5, "Phone number too short")
      .max(13, "Phone number too long")
      .matches(/^[0-9]{5,13}$/, "Phone number is not valid"),
    birthDate: Yup.date()
      .max(today)
      .required("You have to provide your birth date"),
  });

  const defaultInputValues = {
    email: userData.email,
    firstName: userData.firstName,
    surname: userData.surname,
    code: userData.code,
    phone: userData.phone,
    birthDate: parseISO(userData.birthDate),
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultInputValues,
  });

  const handleChangeData = (values) => {
    editUserAccount(getValues());
  };

  const handleSuccess = () => {
    setConfirmUpdateDialogOpen(true);
  };

  const editUserAccount = async (values) => {
    setIsUpdating(true);
    console.log("hello there");
    console.log(values);
    console.log(values.birthDate);
    var postBody = {
      userId: sessionStorage.getItem("userId"),
      phoneNumber: "+" + values.code + " " + values.phone,
      firstName: values.firstName,
      surname: values.surname,
      birthday: values.birthDate,
    };
    await doPatch("/api/v1/user", postBody)
      .then((response) => response.json())
      .then((response) => {
        // setNecessaryData(response);
        handleSuccess();
      })
      .catch((err) => {
        setConfirmErrorToastOpen(true);
        setErrorMessage(err.message);
        setIsUpdating(false);
        console.log("Request Failed", err.message);
      });
    setIsUpdating(false);
  };

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <UpdatedUserConfirmationDialog
        open={confirmUpdatedDialogOpen}
        onClose={() => setConfirmUpdateDialogOpen(false)}
      />
      <ErrorToast
        open={confirmErrorToastOpen}
        onClose={() => setConfirmErrorToastOpen(false)}
        message="There was an error while updating your account. Sorry for inconvenience. Try again later."
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
          <Typography sx={{ fontSize: "32px" }}>Manage profile data</Typography>
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
              <form onSubmit={handleSubmit(handleChangeData)}>
                <TextField
                  disabled
                  type="string"
                  name="email"
                  label="Email"
                  margin="normal"
                  value={userData.email}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="string"
                  margin="normal"
                  placeholder="First name"
                  name="First name"
                  label="First name"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlinedIcon
                          sx={{ color: "primary.main" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
                <TextField
                  type="string"
                  margin="normal"
                  placeholder="Surname"
                  name="surname"
                  label="Surname"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  {...register("surname")}
                  error={!!errors.surname}
                  helperText={errors.surname?.message}
                />
                <Box sx={{ display: "flex", mt: "-10px", mb: "10px" }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <TextField
                      sx={{
                        minWidth: "100px",
                        maxWidth: "100px",
                        mr: "1rem",
                      }}
                      type="string"
                      margin="normal"
                      placeholder="Code"
                      name="code"
                      label="Code"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ color: "primary.main" }}>
                              +
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      {...register("code")}
                      error={!!errors.code}
                    />
                    <FormHelperText
                      error={!!errors.code}
                      sx={{
                        ml: 1,
                        mt: "-5px",
                        maxWidth: "120px",
                      }}
                    >
                      <span>{!!errors.code && errors.code?.message}</span>
                    </FormHelperText>
                  </Box>
                  <TextField
                    fullWidth
                    type="string"
                    margin="normal"
                    placeholder="Phone"
                    name="phone"
                    label="Phone"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    {...register("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="birthDate"
                    control={control}
                    sx={{ mb: 1 }}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        disableFuture
                        disabled
                        label="Birth date"
                        sx={{
                          svg: { color: "#2ab7ca" },
                          mt: 1,
                          mb: 1,
                          width: "50%",
                          minWidth: "200px",
                        }}
                        // slotProps={{
                        //     textField: {
                        //         svg: { color: "#2ab7ca" },
                        //         mt: 1,
                        //         mb: 1,
                        //         width: "50%",
                        //         minWidth: "200px"
                        //     }
                        // }}
                        // renderInput={(params) =>
                        //     <TextField
                        //         {...params}
                        //         sx={{
                        //             svg: { color: "#2ab7ca" },
                        //             mt: 1,
                        //             mb: 1,
                        //             width: "50%",
                        //             minWidth: "200px"
                        //         }}
                        //         onKeyDown={onKeyDown}
                        //         error={!!errors.birthDate}
                        //         helperText={errors.birthDate?.message}
                        //     />
                        // }
                        onKeyDown={onKeyDown}
                        error={!!errors.birthDate}
                        helperText={errors.birthDate?.message}
                        value={value}
                        onChange={onChange}
                        format="yyyy-MM-dd"
                      />
                    )}
                  />
                </LocalizationProvider>
                <DialogActions>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: "0",
                      width: "150px",
                      color: "#FFFFFF",
                      mr: -2,
                    }}
                  >
                    {isUpdating ? (
                      <CircularProgress size="24px" sx={{ color: "#FFFFFF" }} />
                    ) : (
                      "Change data"
                    )}
                  </Button>
                </DialogActions>
              </form>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
