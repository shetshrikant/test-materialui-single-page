import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ActualTask from "./ActualTask";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function LandingPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ActualTask />
        </div>
    );
}