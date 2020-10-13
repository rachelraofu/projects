import React from "react";
import { Paper, Typography } from "@material-ui/core";

export default ({ vids }) => {
  const ts = Math.max(1 , Math.floor(((new Date()).getTime() + parseInt(vids[0].len) - parseInt(vids[0].end))/1000));
    console.log('in: ',ts);
  const videoSrc = `https://www.youtube.com/embed/${vids[0].vid}?start=${ts}&autoplay=1&controls=0`;
  const videoOri = `https://www.youtube.com/watch?v=${vids[0].vid}`;
console.log(videoSrc);
  return (
    <React.Fragment>
      <Paper elevation={6} style={{ height: "100%" }}>
        <iframe
          frameBorder="0"
          height="680px"
          width="100%"
          allow="autoplay"
          title="Video Player"
          src={videoSrc}
        />
        </Paper>
        <Paper elevation={6} style={{ padding: "15px" }}>
          <Typography variant="h4">
            {vids[0].title}
          </Typography>
          <p><a href={videoOri}>Watch original video</a></p>
       </Paper>
    </React.Fragment>
  );
}
