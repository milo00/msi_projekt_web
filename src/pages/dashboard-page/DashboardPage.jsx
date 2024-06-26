import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import { Divider } from "@mui/material";
import { Button } from "@mui/material";
import { NavigationNavbar } from "../../components/navbars/navigationNavbar/NavigationNavbar.jsx";
import { CreateTripDialog } from "../../components/dashboard/CreateTripDialog.jsx";
import { FutureTrips } from "../../components/dashboard/tripsList/futureTrips/FutureTrips.jsx";
import { CurrentTrips } from "../../components/dashboard/tripsList/currentTrips/CurrentTrips.jsx";
import { PastTrips } from "../../components/dashboard/tripsList/pastTrips/PastTrips.jsx";
import { BACKGROUND_DASHBOARD } from "../../components/images/Images.jsx";
import { doGet } from "../../components/utils/fetch-utils";
import "./dashboardPage.css";

export const URL = "/dashboard";
export const NAME = "Dashboard";

const testTrips = [
  {
    groupId: 1,
    name: "Future trip",
    description: "This is placeholder for trip description.",
    groupStage: "PLANNING_STAGE",
  },
  {
    groupId: 2,
    name: "Current trip",
    description: "This is placeholder for trip description.",
    groupStage: "TRIP_STAGE",
  },
  {
    groupId: 3,
    name: "Past trip",
    description: "This is placeholder for trip description.",
    groupStage: "AFTER_TRIP_STAGE",
  },
];

export const DashboardPage = () => {
  const [createTripDialogOpen, setCreateTripDialogOpen] = useState(false);
  const [tripsList, setTripsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTrips = async () => {
    setIsLoading(true);
    await doGet("/api/v1/trip-group/groups/" + sessionStorage.getItem("userId"))
      .then((response) => response.json())
      .then((response) => setTripsList(response))
      .then(setIsLoading(false))
      .catch((err) => console.log("Request Failed", err));
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <>
      <CreateTripDialog
        open={createTripDialogOpen}
        onClose={() => setCreateTripDialogOpen(false)}
        onSuccess={() => getTrips()}
      />
      {/* <SimpleNavbar /> */}
      <NavigationNavbar buttonsData={[]} animated />
      <Box
        className="background-fade-in"
        sx={{
          backgroundImage: `url(${BACKGROUND_DASHBOARD})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          mt: -5,
          placeItems: "center",
          height: "90vh",
          width: "100%",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Grid item xs={12} justifyContent="center" mx="auto">
            <Typography
              variant="h1"
              mt={-8}
              textAlign="center"
              color="#FFFFFF"
              sx={{
                fontSize: "40px",
              }}
            >
              explore the world with us
            </Typography>
          </Grid>
          <Grid item xs={12} justifyContent="center" mx="auto">
            <Typography
              variant="body1"
              color="white"
              textAlign="center"
              px={{ xs: 6, lg: 12 }}
              mt={1}
            >
              <Button
                variant="outlined"
                onClick={() => setCreateTripDialogOpen(true)}
                sx={{ color: "#FFFFFF", borderRadius: "0", mt: 2 }}
              >
                start planning
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <CurrentTrips trips={tripsList} isLoading={isLoading} />

      {/* <Divider variant="middle" /> */}
      {/* <FutureTrips trips={testTrips} /> */}

      {/* <Divider variant="middle" /> */}
      {/* <PastTrips trips={testTrips} isLoading={isLoading} /> */}
    </>
  );
};
