import React from 'react'
import { Grid, TextField, Button, Typography, CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom';
import { FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useForm, SubmitHandler, Controller, set } from 'react-hook-form';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    root: {
        padding: '2rem'
    },
    formControl: {
        "& .MuiFormControlLabel-label": {
            color: "black"
        }
    },
    footerContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    footerGrid:{
        display: "flex",
        fontSize: "1rem",
        margin: 0
    }
}))

interface Inputs {
    username: string,
    password: string,
}

interface InputProps {
    username: "username" | "password",
    label: string,
    type: string,
    required: boolean,
}

const fields:Array<InputProps> = [
    {
        username: "username",
        label: "User name",
        type: "text",
        required: true,
    },
    {
        username: "password",
        label: "Password",
        type: "password",
        required: true,
    }
]

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const LoginForm: React.FC = () => {
    const classes = useStyles();
    const btnstyle = { margin: '8px 0' }
    const [showPassword, setShowPassword] = React.useState(false);
    const [isSigningIn, setIsSigningIn] = React.useState(false);
    const [error, setError] = React.useState(false);

    const { handleSubmit, control } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        setIsSigningIn(true);
        // TODO: Add login logic here
        // Get response from server
        // If success, redirect to home page
        // If fail, show error message by setError(true)
        setError(true);
        setIsSigningIn(false);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }

        setError(false);
    };

    return (
        <Grid container className={classes.root}>
            <Grid>
                <h2 style={{color: "black"}}>Sign In</h2>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => (
                    <Controller
                        key={index}
                        name={field.username}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                        <TextField
                            placeholder={`Enter ${field.label}`}
                            variant="outlined"
                            type={field.username === "password" ? (showPassword ? "text" : "password") : field.type}
                            sx={{ paddingBottom: '1rem' }}
                            fullWidth
                            required
                            onChange={onChange} value={value} label={field.label}
                            InputProps={field.username !== "password" ? undefined : ({
                                endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>,
                            })}
                        />
                        )}
                    />
                ))}
                <FormControlLabel
                    control={
                        <Checkbox
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="Remember me"
                    className={classes.formControl}
                />

                <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>
                    {isSigningIn ? <CircularProgress size={25} sx={{color: "white"}}/> :  "Sign up"}
                </Button>
            </form>

            <Grid container className={classes.footerContainer}>
                <Grid item xs={12}>
                    <Link to="/signup" className={classes.footerGrid}>
                        Change password ?
                    </Link>
                </Grid>
                <Grid item xs={12}>
                <Typography>
                    <h4 style={{color: "black", marginBottom: "5px", height: "fit-content"}}>Don't have an account ?</h4>
                    <Link to="/signup" className={classes.footerGrid}>
                        Sign Up
                    </Link>
                </Typography>
                </Grid>
            </Grid>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    <AlertTitle>Error</AlertTitle>
                     Login error — <strong>check it out!</strong>
                </Alert>
            </Snackbar>
        </Grid>
    )
}
