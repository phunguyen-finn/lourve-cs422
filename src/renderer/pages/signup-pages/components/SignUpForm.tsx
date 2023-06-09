import React from 'react'
import { Grid, TextField, Button, Typography, List, CircularProgress } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { signUp } from '../../../api/';

interface Inputs {
    username: string,
    password: string,
    email: string,
    fullname: string,
}

interface InputProps {
    username: "username" | "password" | "email" | "fullname",
    label: string,
    type: string,
    required: boolean,
}

const useStyles = makeStyles(() => ({
    root: {
        padding: '2.5rem',
    },
    footerGrid:{
        display: "flex",
        fontSize: "1rem",
        margin: 0,
        marginLeft: "1rem"
    }
}))

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
    },
    {
        username: "email",
        label: "Email",
        type: "email",
        required: true,
    },
    {
        username: "fullname",
        label: "Fullname",
        type: "text",
        required: true,
    },
]

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SignUpForm: React.FC = () => {
    const classes = useStyles();
    const btnstyle = { margin: '8px 0' }
    const [isRegistering, setIsRegistering] = React.useState(false)
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const { handleSubmit, control, formState: {errors}} = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data)
        setIsRegistering(true)
        let response = await signUp(data)
        setIsRegistering(false)
        if (response.username !== undefined) {
            setSuccess(true)
        } else {
            setError(true)
            setErrorMessage(response.detail)
        }
        console.log(response)
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }

        if (success) {
            setSuccess(false)
        } else if (error) {
            setError(false)
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };


    return (
        <Grid container className={classes.root}>
            <Grid>
                <h2 style={{color: "black"}}>Sign Up</h2>
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

                <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>
                    {isRegistering ? <CircularProgress size={25} sx={{color: "white"}}/> :  "Sign up"}
                </Button>
            </form>

            <Typography sx={{display: "flex", flexDirection: "row"}}>
                <p style={{color: "black", marginBottom: "5px", height: "fit-content"}}>Already have an account ?</p>
                <Link to="/" className={classes.footerGrid}>
                    Sign In
                </Link>
            </Typography>

            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    <AlertTitle>Error</AlertTitle>
                     {errorMessage} — <strong>check it out!</strong>
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    <AlertTitle>Success</AlertTitle>
                    Register successully — <strong>check it out!</strong>
                </Alert>
            </Snackbar>

        </Grid>
    )
}
