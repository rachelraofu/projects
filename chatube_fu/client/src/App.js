import React from 'react';

import Main from './components/Main/Main';
import Join from './components/Join/Join';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/chat" component={Main} />
    </Router>
  );
}

export default App;
