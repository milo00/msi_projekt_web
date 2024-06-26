import { useState } from "react";
import { Card } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { ButtonBase } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import { ExpandMore } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MapIcon from "@mui/icons-material/Map";
import { PLACEHOLDER_IMAGE } from "../images/Images";

export const AttractionCandidateCard = ({
  attractionData,
  openSelectAttractionDialog,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [mapsLink, setMapsLink] = useState(attractionData.url);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  var getPhotoUrl = (photoReference) => {
    return (
      "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
      photoReference +
      "&key=" +
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    );
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: "10px",
          "&:hover": {
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "primary.main",
          },
        }}
        elevation={2}
      >
        <CardContent sx={{ width: "100%" }}>
          <ButtonBase
            sx={{
              width: "100%",
            }}
            onClick={openSelectAttractionDialog}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyCOntent: "space-between",
                width: "100%",
                columnGap: "20px",
              }}
            >
              <Box sx={{ width: "40%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    height: "200px",
                    width: "100%",
                  }}
                >
                  <CardMedia
                    sx={{ borderRadius: "0" }}
                    component="img"
                    image={
                      attractionData.photoLink !== null
                        ? getPhotoUrl(attractionData.photoLink)
                        : PLACEHOLDER_IMAGE
                    }
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  width: "55%",
                  minHeight: "180px",
                  maxHeight: "180px",
                  mb: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    minHeight: "30%",
                    maxHeight: "70%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontSize: "28px",
                      display: "-webkit-box",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                    align="left"
                  >
                    {attractionData.attractionName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: "30%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                    sx={{
                      display: "-webkit-box",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {attractionData.address}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ButtonBase>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -5 }}>
            <Button
              variant="outlined"
              target="_blank"
              rel="noreferrer"
              href={mapsLink}
              sx={{
                color: "primary.main",
                borderColor: "primary.main",
                borderRadius: "20px",
                width: "180px",
                "&:hover": {
                  color: "#FFFFFF",
                  backgroundColor: "primary.main",
                  borderColor: "primary.main",
                },
              }}
            >
              <MapIcon sx={{ mr: "10px" }} />
              <Typography>See in maps</Typography>
            </Button>
          </Box>
        </CardContent>
        {/* <CardActions
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignContent: "center",
                        flexWrap: "wrap",
                        mt: -8,
                        mb: 1,
                        ml: 1
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "50%" }}>
                        <Box mx="10px">
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon sx={{ color: "primary.main" }} />
                            </ExpandMore>
                        </Box>
                    </Box>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>
                            "No description provided" :
                        </Typography>
                    </CardContent>
                </Collapse> */}
      </Card>
    </>
  );
};
