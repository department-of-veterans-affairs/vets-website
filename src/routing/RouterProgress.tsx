import React, { useContext } from 'react';
import ProgressBar from '../form-layout/ProgressBar';
import { RouterContext } from './RouterContext';

export default function RouterProgress(props: { route: string }): JSX.Element {
  const { currentRoute, listOfRoutes } = useContext(RouterContext),
    findIndex = listOfRoutes.indexOf(
      listOfRoutes.filter((item) => item.path === currentRoute)[0]
    ),
    currentIndex = findIndex >= 0 ? findIndex + 1 : 0,
    stepTitle = listOfRoutes[findIndex]?.title ,
    numberOfSteps = listOfRoutes.length | 0;

  return (
    <ProgressBar
      currentStep={currentIndex}
      numberOfSteps={numberOfSteps}
      stepTitle={stepTitle}
    />
  );
}
