import React from "react";
import { makeStyles } from "@mui/styles";
import { CardMedia, Grid } from "@mui/material";
import { Card } from "@mui/material";
import { SignUpForm } from "./components/SignUpForm";
import doraemonBackground from "../../../../assets/doraemon-background.jpg";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "600px",
        maxWidth: "800px",
    }
}));

export const SignUpPage: React.FC = () => {
    const classes = useStyles();
    return (
        <Grid container className={classes.root}>
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
                <SignUpForm />
            </Grid>
        </Grid>
    );
}