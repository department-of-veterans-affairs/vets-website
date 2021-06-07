import React from 'react';
import { Route, Switch } from 'react-router-dom';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/:token" component={() => <>token</>} />
      <Route path="/:token/insurance" component={() => <>insurance</>} />
      <Route path="/:token/details" component={() => <>details</>} />
      <Route path="/:token/confirmed" component={() => <>confirmed</>} />
      <Route path="/:token/failed" component={() => <>failed</>} />
    </Switch>
  );
};
export default createRoutesWithStore;
