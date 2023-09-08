import React from 'react';
import { Route } from 'react-router-dom';

import Avs from './containers/Avs';

const routes = [<Route path="/:id" key="/:id" component={Avs} />];

export default routes;
