import { Grid } from '@mui/material';
import { Container } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Groups2Icon from '@mui/icons-material/Groups2';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MapIcon from '@mui/icons-material/Map';
import { DashboardFlipCard } from '../../dashboardFlipCard/DashboardFlipCard';
import { DashboardOptionCard } from '../../dashboardOptionCard/DashboardOptionCard';


export const CurrentTrips = ({ trips }) => {
    const tripStageTrips = trips.filter(trip => trip.groupStage === 'TRIP_STAGE');
    const currentTrips = tripStageTrips.map(({ groupId, name, description, groupStage }) => (
        <Grid container item spacing={3} sx={{ mx: "auto", mb: "50px" }} key={groupId}>
            <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
                <DashboardFlipCard
                    title={name}
                    description={description}
                    action={{
                        route: "/tripSummary/" + groupId,
                        label: "Trip summary",
                    }}
                />
            </Grid>
            <Grid item xs={12} lg={8} sx={{ ml: "auto" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <DashboardOptionCard
                            icon={<MapIcon sx={{ color: "primary.dark", fontSize: "46px" }} />}
                            title="Day plans"
                            description="Check what is the plan for every day of the trip"
                            route={`/dayPlan/${groupId}`}
                            groupId={groupId}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DashboardOptionCard
                            icon={<CurrencyExchangeIcon sx={{ color: "primary.dark", fontSize: "46px" }} />}
                            title="Finances"
                            description="Control finances during the trip"
                            route={`/finances/${groupId}`}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DashboardOptionCard
                            icon={<Groups2Icon sx={{ color: "primary.dark", fontSize: "46px" }} />}
                            title="Participants"
                            description="See other participants of the trip"
                            route={`/participants/${groupId}`}
                            groupId={groupId}

                        />
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                        <DashboardOptionCard
                            icon={<FactCheckIcon sx={{ color: "primary.dark", fontSize: "46px" }} />}
                            title="Trip summary"
                            description="Check general info about the trip"
                            route={`/tripSummary/${groupId}`}
                        />
                    </Grid> */}
                </Grid>
            </Grid>
        </Grid>
    ));

    return (
        <Box component="section" py={6} my={6}>
            <Container>
                <Grid container item xs={11} spacing={3} alignItems="center" sx={{ mx: "auto" }}>
                    <Typography variant="h3" sx={{ width: "100%", display: "flex", justifyContent: "center", mb: "30px" }}>current trips</Typography>
                    {currentTrips.length === 0 ?
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%"
                        }}>
                            <Typography
                                variant="h5"
                                sx={{ margin: "50px", color: "primary.main" }}
                            >
                                no current trips
                            </Typography>
                        </Box>
                        :
                        currentTrips
                    }
                </Grid>
            </Container>
        </Box>
    );
};