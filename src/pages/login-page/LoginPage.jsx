import * as React from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  InputAdornment,
  ListItemSecondaryAction,
  Toolbar,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { Card } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { doPost } from "../../components/utils/fetch-utils";
import { ErrorToast } from "../../components/toasts/ErrorToast";
import DrawerAppBar from "../../components/navbars/drawerNavbar";
import { InfoToast } from "../../components/toasts/InfoToast";

export const URL = "/login";
export const NAME = "Login";

export const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [invalidData, setInvalidData] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [creationError, setCreationError] = useState(
    "Something gone wrong. Try again"
  );
  const [loginLoading, setLoginLoading] = useState(false);
  const [infoToastOpen, setInfoToastOpen] = useState(false);

  const defaultInputValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("You have to provide email"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        "^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z-0-9]{6,}$",
        "Incorrect password or email address"
      ),
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
    // resolver: yupResolver(validationSchema),
    defaultValues: defaultInputValues,
  });

  const handleLogin = async (values) => {
    setLoginLoading(true);
    var postBody = {
      email: values.email,
      password: values.password,
    };
    await doPost("/api/v1/auth/login", postBody, false)
      .then((response) => {
        if (response.ok) {
          sessionStorage.setItem(
            "ACCESS_TOKEN",
            response.headers.get("Authorization")
          );
        }
        setInvalidData(false);
        return response.json();
      })
      .then((json) => {
        sessionStorage.setItem("userId", json.userId);
        reset();
        if (searchParams.get("redirectTo") !== null) {
          navigate(searchParams.get("redirectTo"));
        } else {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        setLoginLoading(false);
        if (err.message === "401") {
          setInvalidData(true);
        } else {
          setErrorToastOpen(true);
        }
      });
    // reset();
  };

  // const handleLogin = (values) => {
  //     console.log(values);
  //     console.log(getValues());
  //     reset();
  //     navigate("/dashboard");
  // };

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // const registerRedirect = () => {
  //     if (searchParams.get("redirectTo") !== null) {
  //         setInfoToastOpen(true);
  //         setTimeout(() => {
  //             navigate("/register");
  //         }, 3000);
  //     } else {
  //         navigate("/register");
  //     }
  // }

  const registerRedirect = () => {
    setInfoToastOpen(true);
    setTimeout(() => {
      navigate("/register");
    }, 3000);
  };

  return (
    <div>
      <InfoToast
        open={infoToastOpen}
        onClose={() => setInfoToastOpen(false)}
        message="After successful registration use your invitation link again."
        hideTime={3000}
      />
      <ErrorToast
        open={errorToastOpen}
        onClose={() => setErrorToastOpen(false)}
        message={creationError}
      />
      <Box
        sx={{
          position: "relative",
          height: "100%",
          minWidth: "600px",
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
            <Typography variant="h3">sign in</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 2,
              pt: "20px",
              px: "50px",
              pb: "50px",
              minHeight: "200px",
            }}
          >
            <Box sx={{ height: "100%", width: "100%", mt: 2 }}>
              <form onSubmit={handleSubmit(handleLogin)}>
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
                  error={invalidData}
                />
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
                  error={invalidData}
                  helperText={invalidData && "Incorrect email or password"}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {/* {true ?
                                            <Box sx={{ my: 2 }}>
                                                <CircularProgress />
                                            </Box>
                                            :
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={{
                                                    mt: 3, mb: 2, borderRadius: "10px", width: "150px", color: "#FFFFFF"
                                                }}
                                            >
                                                Sign In
                                            </Button>
                                        } */}

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
                    {loginLoading ? (
                      <CircularProgress size="24px" sx={{ color: "#FFFFFF" }} />
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </Box>
              </form>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    onClick={registerRedirect}
                    variant="body2"
                    sx={{ cursor: "pointer" }}
                  >
                    Don't have an account? Sign Up
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
