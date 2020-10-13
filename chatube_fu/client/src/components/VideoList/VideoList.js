import React from "react";
import { Grid } from "@material-ui/core";

import VideoItem from "./VideoItem";

export default ({ videos, onVideoSelect }) => {
  const listOfVideos = videos.map(video => (
    <VideoItem
      video={video}
    />
  ));

  return (
    <Grid xs={12} container spacing={2}>
      {listOfVideos}
    </Grid>
  );
}
