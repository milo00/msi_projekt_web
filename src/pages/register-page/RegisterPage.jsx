import * as React from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputAdornment, Toolbar } from "@mui/material";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Link } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { doPost } from "../../components/utils/fetch-utils";
import { SuccessToast } from "../../components/toasts/SuccessToast";
import { ErrorToast } from "../../components/toasts/ErrorToast";
import DrawerAppBar from "../../components/navbars/drawerNavbar";

export const URL = "/register";
export const NAME = "Register";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [creationError, setCreationError] = useState(
    "Something gone wrong. Try again"
  );
  const [registerProcess, setRegisterProcess] = useState(false);

  const defaultInputValues = {
    email: "",
    firstName: "",
    surname: "",
    code: "48",
    phone: "",
    birthDate: new Date(),
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("You have to provide email")
      .max(150, "Too long email, max. 150 characters"),
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
    password: Yup.string()
      .required("Password is required")
      .matches(
        "^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z-0-9]{6,}$",
        "Password must have min 6 characters, at least one letter and one number"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords don't match")
      .required("Confirm your password"),
  });

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

  const handleRegister = async (values) => {
    console.log(values.birthDate);
    setRegisterProcess(true);
    var postBody = {
      email: values.email,
      phoneNumber: "+" + values.code + " " + values.phone,
      password: values.confirmPassword,
      firstName: values.firstName,
      surname: values.surname,
      birthday: values.birthDate,
    };
    await doPost("/api/v1/auth/register", postBody, false)
      .then((response) => {
        if (response.ok) {
          setSuccessToastOpen(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      })
      .catch((err) => {
        setRegisterProcess(false);
        if (err.message !== "") {
          setCreationError(err.message);
        }
        setErrorToastOpen(true);
      });
    setRegisterProcess(false);
  };

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <SuccessToast
        open={successToastOpen}
        onClose={() => setSuccessToastOpen(false)}
        message="Account created. You will be redirected to login page"
      />
      <ErrorToast
        open={errorToastOpen}
        onClose={() => setErrorToastOpen(false)}
        message={creationError}
      />
      <Box
        sx={{
          height: "100%",
          position: "relative",
        }}
      >
        <DrawerAppBar />
        <Box
          component="main"
          sx={{
            mb: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Toolbar />
          <Box mb={2}>
            <Typography variant="h3">sign up</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 2,
              px: "40px",
              pb: "0px",
              minHeight: "200px",
            }}
          >
            <Box sx={{ height: "100%", width: "75%" }}>
              <form onSubmit={handleSubmit(handleRegister)}>
                <TextField
                  type="string"
                  autoFocus
                  margin="normal"
                  placeholder="Email"
                  name="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  type="string"
                  margin="normal"
                  placeholder="First name"
                  name="first name"
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
                <Box sx={{ display: "flex", mb: "10px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
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
                    sx={{ width: "100%" }}
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
                    name={"birthDate"}
                    control={control}
                    sx={{ mb: 1 }}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        disableFuture
                        label="Birth date"
                        sx={{
                          svg: { color: "#2ab7ca" },
                          mt: 1,
                          mb: 1,
                          width: "50%",
                          minWidth: "200px",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onKeyDown={onKeyDown}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate?.message}
                          />
                        )}
                        value={value}
                        onChange={onChange}
                        inputFormat="yyyy-MM-dd"
                      />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  type={showPassword ? "string" : "password"}
                  margin="normal"
                  placeholder="Password"
                  name="password"
                  label="Password"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff color="primary" />
                          ) : (
                            <Visibility color="primary" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  type={showConfirmPassword ? "string" : "password"}
                  margin="normal"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  label="Confirm Password"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff color="primary" />
                          ) : (
                            <Visibility color="primary" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      borderRadius: "0",
                      boxShadow: 0,
                      width: "150px",
                      color: "#FFFFFF",
                    }}
                  >
                    {registerProcess ? (
                      <CircularProgress size="24px" sx={{ color: "#FFFFFF" }} />
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </Box>
              </form>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    href="/login"
                    variant="body2"
                    sx={{ cursor: "pointer" }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
