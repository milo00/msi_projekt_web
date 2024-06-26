import { useState } from "react";
import { useEffect } from "react";
import { Card } from "@mui/material";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/material";
import { MenuItem } from "@mui/material";
import { ButtonBase } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChurchIcon from '@mui/icons-material/Church';
import CastleIcon from '@mui/icons-material/Castle';
import SailingIcon from '@mui/icons-material/Sailing';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import WaterIcon from '@mui/icons-material/Water';
import LandscapeIcon from '@mui/icons-material/Landscape';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';
import { DeleteDayPlanDialog } from "./DeleteDayPlanDialog";
import { EditDayPlanDialog } from "./EditDayPlanDialog";
import { doGet } from "../utils/fetch-utils";


const icons = [
    {
        id: 0,
        value: 0,
        icon: <ChurchIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
    {
        id: 1,
        value: 1,
        icon: <DirectionsWalkIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
    {
        id: 2,
        value: 2,
        icon: <LocationCityIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
    {
        id: 3,
        value: 3,
        icon: <LandscapeIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
    {
        id: 4,
        value: 4,
        icon: <RestaurantIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
    {
        id: 5,
        value: 5,
        icon: <CastleIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
    {
        id: 6,
        value: 6,
        icon: <SailingIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
    {
        id: 7,
        value: 7,
        icon: <WaterIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
    {
        id: 8,
        value: 8,
        icon: <DownhillSkiingIcon sx={{ color: "primary.main", fontSize: "40px", mx: 2, my: 1 }} />
    },
];

export const DayPlanCard = ({ dayPlanData, groupId, showDetailedPlan, onSuccess, onSuccessDelete }) => {

    const [isCoordinator, setIsCoordinator] = useState(true);

    useEffect(() => {
        isCorinator();
    }, []);

    const isCorinator = async () => {
        var resp = await doGet('/api/v1/user-group/role?' + new URLSearchParams({ groupId: groupId, userId: sessionStorage.getItem("userId") }).toString())
            .catch(err => console.log(err.message));
        var body = await resp.json();
        setIsCoordinator(body);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const editAction = () => {
        setEditDialogOpen(true);
        setAnchorEl(null);
    };

    const deleteAction = () => {
        setDeleteDialogOpen(true);
        setAnchorEl(null);
    };

    const removeMenus = () => {
        setAnchorEl(null);
    };

    window.addEventListener('scroll', removeMenus);

    const dayPlanIcon = icons.filter(icon => icon.id === dayPlanData.iconType).map(icon =>
        <Box key={icon.id}>
            {icon.icon}
        </Box>);

    return (
        <>
            <EditDayPlanDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                dayPlanData={dayPlanData}
                onSuccess={() => onSuccess()}
            />
            <DeleteDayPlanDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                dayPlanId={dayPlanData.dayPlanId}
                onSuccess={() => onSuccessDelete()}
            />

            <Card
                sx={{
                    width: "100%",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderStyle: "solid",
                    borderWidth: "2px",
                    borderColor: "#dee2e6",
                    "&:hover": {
                        borderColor: "primary.main",
                    }
                }}>
                <ButtonBase
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    onClick={() => showDetailedPlan(dayPlanData.name, dayPlanData.date, dayPlanData.dayAttractions, dayPlanData.dayPlanId)}
                >
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        {dayPlanIcon}
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography
                                align="left"
                                sx={{ fontSize: "16px", color: "text.primary" }}
                            >
                                {dayPlanData.name}
                            </Typography>
                            <Typography
                                align="left"
                                sx={{ fontSize: "14px", color: "text.secondary" }}
                            >
                                {dayPlanData.date}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Typography
                            sx={{
                                color: "primary.main",
                                fontSize: "20px",
                                padding: 0
                            }}
                        >
                            {dayPlanData.dayAttractions.length}
                        </Typography>
                        <LocationOnIcon sx={{ color: "primary.main", fontSize: "28px" }} />
                    </Box>
                </ButtonBase>
                <Box sx={{
                    display: "flex", flexDirection: "row", alignItems: "center", mr: 1, my: 1
                }}>
                    {isCoordinator && <Box >
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{
                                color: "primary.main",
                                padding: 0
                            }}
                        >
                            <MoreVertIcon sx={{ fontSize: "30px" }} />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            disableScrollLock={true}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={editAction}>
                                <EditIcon sx={{ mr: "20px", color: "primary.main" }} />
                                <Typography sx={{ color: "primary.main" }}>
                                    Edit
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={deleteAction}>
                                <DeleteIcon sx={{ mr: "20px", color: "error.main" }} />
                                <Typography sx={{ color: "error.main" }}>
                                    Delete
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>}
                </Box>
            </Card>
        </>
    );
};