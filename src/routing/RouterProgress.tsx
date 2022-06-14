import React, { useContext } from 'react';
import ProgressBar from '../form-layout/ProgressBar';
import { RouterContext } from './RouterContext';
import { RouteInfo } from './types';

const RESTRICTED_ROUTES = ['/', '/confirmation'];

export default function RouterProgress(): JSX.Element {
  const { currentRoute, listOfRoutes } = useContext(RouterContext),
    viableListOfRoutes = listOfRoutes
      .filter((route: RouteInfo) => !RESTRICTED_ROUTES.includes(route.path))
      .filter((item) => !item.conditional || item.isShown),
    findIndex = viableListOfRoutes.indexOf(
      listOfRoutes.filter((item) => item.path === currentRoute)[0]
    ),
    currentIndex = findIndex >= 0 ? findIndex + 1 : 0,
    stepTitle = viableListOfRoutes[findIndex]?.title,
    numberOfSteps = viableListOfRoutes.length | 0;

  return findIndex > -1 ? (
    <ProgressBar
      currentStep={currentIndex}
      numberOfSteps={numberOfSteps}
      stepTitle={stepTitle}
    />
  ) : (
    <></>
  );
}
