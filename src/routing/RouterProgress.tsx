import React, { useContext } from 'react';
import ProgressBar from '../form-layout/ProgressBar';
import { RouterContext } from './RouterContext';
import { RouteInfo } from "./types";

const RESTRICTED_ROUTES = ['/', '/confirmation']

export default function RouterProgress(props: { route: string }): JSX.Element {
  const { currentRoute, listOfRoutes } = useContext(RouterContext);
  const routesWithProgressBar = listOfRoutes.filter((route: RouteInfo) => !RESTRICTED_ROUTES.includes(route.path));

  const findIndex = routesWithProgressBar.indexOf(
      routesWithProgressBar.filter((item) => item.path === currentRoute)[0]
    ),
    currentIndex = findIndex >= 0 ? findIndex + 1 : 0,
    stepTitle = routesWithProgressBar[findIndex]?.title,
    numberOfSteps = routesWithProgressBar.length | 0;

  return findIndex > -1
         ? (
           <ProgressBar
             currentStep={currentIndex}
             numberOfSteps={numberOfSteps}
             stepTitle={stepTitle}
           />
         )
         : <></>;
}
