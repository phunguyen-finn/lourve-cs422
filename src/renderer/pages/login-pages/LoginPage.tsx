import { LoginForm } from "./components/LoginForm";
import { makeStyles } from "@mui/styles";
import { CardMedia, Grid } from "@mui/material";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import doraemonBackground from "../../../../assets/doraemon-background.jpg";
import store from "renderer/store";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "600px",
        maxWidth: "800px",
    }
}));

export const LoginPage = () => {
    const classes = useStyles();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = store.get("token");
        if (token) {
            setUser(token);
        }
    });


    return (
        <>
        {user && <Navigate to="/access" />}
        {!user && <Grid container className={classes.root}>
            <Grid item xs={6}>
                <Card
                    sx={{ maxHeigh: "100%" }}>
                    <CardMedia
                        sx={{ height: "600px" }}
                        image={doraemonBackground}
                        title="green iguana"
                    />
                </Card>
            </Grid>
            <Grid item xs={6} sx={{ background: "white" }}>
                <LoginForm />
            </Grid>
        </Grid>}
        </>
    );
}