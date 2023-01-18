import React from 'react';
import { Switch } from 'react-router-dom';
import Routes from './Routes';

const App = () => {
  return (
    <div className="vads-l-grid-container">
      <Switch>
        <Routes />
      </Switch>
    </div>
  );
};

export default App;
