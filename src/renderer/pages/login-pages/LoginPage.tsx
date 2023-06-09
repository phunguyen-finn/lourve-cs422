import { LoginForm } from "./components/LoginForm";
import { makeStyles } from "@mui/styles";
import { CardMedia, Grid } from "@mui/material";
import { Card } from "@mui/material";
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

export const LoginPage = () => {
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
                <LoginForm />
            </Grid>
        </Grid>
    );
}