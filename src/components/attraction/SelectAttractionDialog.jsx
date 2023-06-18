import * as React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { IconButton } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogActions } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { TextField } from '@mui/material';
import { FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CardMedia } from '@mui/material';
import { Grid } from '@mui/material';
import { MarkerF } from '@react-google-maps/api';
import { GoogleMap } from '@react-google-maps/api';
import { DirectionsRenderer } from '@react-google-maps/api';
import { useLoadScript } from '@react-google-maps/api';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { SuccessToast } from '../toasts/SuccessToast';
import { ErrorToast } from '../toasts/ErrorToast';
import { doPost } from "../../components/utils/fetch-utils";
import { PLACEHOLDER_IMAGE } from '../images/Images';



export const SelectAttractionDialog = ({ open, onClose, attractionData, closeWithSelect, dayPlanId, currentLocation }) => {

    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    const [successToastOpen, setSuccessToastOpen] = useState(false);
    const [errorToastOpen, setErrorToastOpen] = useState(false);

    const [attractionName, setAttractionName] = useState(attractionData.attractionName);

    const DESCRIPTION_LIMIT = 200;
    const [description, setDescription] = useState({ value: "", length: 0 });
    const [descriptionError, setDescriptionError] = useState(description.length > DESCRIPTION_LIMIT ? "You have exceeded characters limit for description" : null);
    const [creationError, setCreationError] = useState("Ups! Something went wrong. Try again.");

    const defaultInputValues = {
        attractionName: attractionName,
        description
    };

    const center = { lat: currentLocation.latitude, lng: currentLocation.longitude }
    const origin = `${currentLocation.latitude}, ${currentLocation.longitude}`
    const destination = `${attractionData.latitude}, ${attractionData.longitude}`
    const tripPoints = { origin: origin, destination: destination }

    const [values, setValues] = useState(defaultInputValues);

    useEffect(() => {
        Object.keys(currentLocation).length > 0 && calculateRoute();
    }, [open]);

    async function calculateRoute() {
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: center,
            destination: destination,
            // eslint-disable-next-line no-undef
            travelMode: 'WALKING'
        })
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
    };

    var getPhotoUrl = (photoReference) => {
        return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + photoReference + '&key=' + process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    };

    const onDescriptionChange = (value) => {
        setDescriptionError(
            value.length > DESCRIPTION_LIMIT ? "You have exceeded characters limit for description" : null
        );
        setDescription({ value: value, length: value.length });
    };

    const validationSchema = Yup.object().shape({
        description: Yup
            .string()
            .max(200, "Description is too long")
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });


    const handleAttractionAddition = async (name, description) => {
        attractionData.description = description;
        await doPost('/api/v1/attraction?dayPlanId=' + dayPlanId, attractionData)
            .then(response => {
                setValues(defaultInputValues);
                setDescription({ value: "", length: 0 });
                setSuccessToastOpen(response.ok);
                close();
            })
            .catch(err => {
                setErrorToastOpen(true);
                setCreationError(err.message)
            });
    };

    const close = () => {
        reset();
        closeWithSelect();
        onClose();
    };

    return (
        <div>
            {console.log(attractionData)}
            <SuccessToast open={successToastOpen} onClose={() => setSuccessToastOpen(false)} message="Attraction successfully added." />
            <ErrorToast open={errorToastOpen} onClose={() => setErrorToastOpen(false)} message={creationError} />
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="responsive-dialog-title"
                PaperProps={{
                    style: {
                        borderRadius: "20px"
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "primary.main",
                        color: "#FFFFFF",
                        mb: "10px",
                        py: 2
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignContent: "center"
                        }}>
                        <Typography variant="h4"
                        >
                            Select attraction
                        </Typography>
                        <IconButton
                            sx={{ p: 0 }}
                            onClick={onClose}
                        >
                            <CloseIcon sx={{ color: "secondary.main", fontSize: "32px" }} />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pb: 1 }}>
                    <DialogContentText variant="body1">
                        Add description to your selected attraction.
                    </DialogContentText>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            height: "200px",
                            width: "100%",
                            mt: 3,
                            mb: 1
                        }}
                    >
                        <CardMedia
                            sx={{ borderRadius: "10px" }}
                            component="img"
                            image={attractionData.photoLink !== null ? getPhotoUrl(attractionData.photoLink) : PLACEHOLDER_IMAGE}
                        />
                    </Box>
                    <form
                        onSubmit={handleSubmit(() => handleAttractionAddition(attractionName, description.value))}
                    >
                        <TextField
                            type="string"
                            disabled
                            autoFocus
                            label="Attraction name"
                            margin="normal"
                            step='any'
                            name='attractionName'
                            fullWidth
                            variant="outlined"
                            {...register('attractionName')}
                            value={attractionData.attractionName}
                        />
                        <TextField
                            type='string'
                            autoFocus
                            margin="normal"
                            multiline
                            rows={4}
                            placeholder='Description'
                            name='description'
                            label='Description'
                            fullWidth
                            variant="outlined"
                            {...register('description')}
                            error={Boolean(descriptionError)}
                            value={description.value}
                            onChange={(event) => onDescriptionChange(event.target.value)}
                        />
                        <FormHelperText
                            error={Boolean(descriptionError)}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "0 10px",
                                pb: "30px"
                            }}
                        >
                            <span>{descriptionError}</span>
                            <span>{`${description.length}/${DESCRIPTION_LIMIT}`}</span>
                        </FormHelperText>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyItems: "center",
                                alignItems: "center",
                                justifyContent: "space-around",
                                minHeight: "400px",
                                mt: -4
                            }}
                        >
                            <Grid container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Grid item xs={7} sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", minWidth: "400px" }}>
                                    {isLoaded ?
                                        Object.keys(currentLocation).length > 0 ?
                                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                                                <Typography>
                                                    Distance: {distance}
                                                </Typography>
                                                <Typography sx={{ my: 1 }}>
                                                    Duration: {duration}
                                                </Typography>
                                                <GoogleMap
                                                    zoom={14}
                                                    center={center}
                                                    mapContainerStyle={{ width: "400px", height: "300px" }}
                                                >
                                                    <MarkerF position={center} />
                                                    {directionsResponse && <DirectionsRenderer directions={directionsResponse} options={{ strokeColor: "#2ab7ca" }} />}
                                                </GoogleMap>
                                            </Box>
                                            :
                                            <Typography>
                                                Please allow sharing your location to see the map
                                            </Typography>
                                        :
                                        <Typography variant="h1">Loading...</Typography>}
                                </Grid>
                            </Grid>
                        </Box>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                sx={{
                                    borderRadius: "20px"
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ color: "#FFFFFF", borderRadius: "20px" }}
                            >
                                Select
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
};