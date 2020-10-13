import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import './VideoItem.css';
export default ({video}) => {
  return (
    <Grid item >
      <Paper style={{ display: "flex", alignItems: "center"}} >
      <Grid item xs={12}>

        <img style={{ marginBottom: "5px" }} alt="thumbnail" src={video.fig} />
        <div className="titleContainer">
        <Typography variant="subtitle1" >
          <b>{video.title.substring(0,100)}</b>
        </Typography>
        </div>

        </Grid>
      </Paper>
    </Grid>
  );
}
