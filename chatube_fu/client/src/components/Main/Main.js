import React from 'react';
import Chat from '../Chat/Chat';
import Video from '../Video/Video';
import './Main.css';

const Main = ({ location }) => {
  return (
    <div className="outerContainer">
        <Video location = { location }/>
    </div>
  );
}

export default Main;
