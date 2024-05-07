import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Container, Toolbar } from "@mui/material";
import "./StarterPage.css";
import { DestinationCard } from "../../components/destinationCard/DestinationCard";
import {
  BARCELONAURL,
  ROMEURL,
  LONDONURL,
  GLOBEURL,
  AMSTERDAMURL,
  MILANURL,
  LISBONURL,
} from "../../components/images/Images";
import DrawerAppBar from "../../components/navbars/drawerNavbar";

export const URL = "/starter";
export const NAME = "Starter";

export const StarterPage = () => {
  const navItems = [
    ["zarejestruj się", "/register"],
    ["zaloguj się", "/login"],
  ];

  return (
    <>
      <DrawerAppBar navItems={navItems} />
      <Box
        component="main"
        style={{
          mx: "50px",
          mb: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "20px",
          minWidth: "900px",
        }}
        elevation={2}
      >
        <Toolbar />
        <Grid container spacing={1}>
          <DestinationCard
            size={4}
            content={BARCELONAURL}
            text={"BARCELONA"}
          ></DestinationCard>
          <DestinationCard
            size={8}
            content={ROMEURL}
            text={"ROME"}
          ></DestinationCard>
          <DestinationCard
            size={4}
            content={LONDONURL}
            text={"LONDON"}
          ></DestinationCard>
          <DestinationCard
            size={4}
            content={GLOBEURL}
            text="find what suits You best"
          ></DestinationCard>
          <DestinationCard
            size={4}
            content={AMSTERDAMURL}
            text={"AMSTERDAM"}
          ></DestinationCard>
          <DestinationCard
            size={7}
            content={MILANURL}
            text={"MILAN"}
          ></DestinationCard>
          <DestinationCard
            size={5}
            content={LISBONURL}
            text={"LISBON"}
          ></DestinationCard>
        </Grid>
      </Box>
    </>
  );
};
