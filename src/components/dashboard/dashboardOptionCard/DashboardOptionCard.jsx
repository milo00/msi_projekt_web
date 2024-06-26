import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Card } from "@mui/material";
import { BrowserRouter as Router, Link } from 'react-router-dom';


export const DashboardOptionCard = ({ icon, title, description, route, groupId }) => {

    return (
        <Link style={{ textDecoration: "none" }} to={route} state={groupId}>
            <Card
                sx={{
                    boxShadow: 2,
                    borderRadius: "0",
                    transition: "transform 0.15s ease-in-out",
                    minHeight: "238px",
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                    "&:hover": { transform: "scale3d(1.05, 1.05, 1)", boxShadow: 10 }
                }}>
                <Box p={2} textAlign="center">
                    {icon}
                    <Typography
                        sx={{ display: "block", fontSize: "24px", fontWeight: "bold", mt: 1, mb: 1 }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        display="block"
                        variant="body2"
                        sx={{ display: "block", fontSize: "16px" }}
                    >
                        {description}
                    </Typography>
                </Box>
            </Card>
        </Link>
    );
};