import { Grid } from "@mui/material";
import { Card } from "@mui/material";
import { Box } from "@mui/material";
import "./DestinationCard.css";

export const DestinationCard = ({ size, content, text }) => {
  return (
    <Grid item xs={size}>
      <Card
        sx={{
          borderRadius: "0",
          height: "300px",
          boxShadow: "none"
        }}
      >
        <Box sx={{ height: "100%" }}>
          <Box
            className="content-box"
            sx={{
              backgroundImage: `url(${content})`,
              height: "100%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="content-title">{text}</div>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
};
