import React from 'react';
import { useField } from 'formik';
import { ReactElement, useContext } from 'react';
import { Navigate, To, useLocation } from 'react-router-dom';
import { getNextRoute, RouterContext } from './RouterContext';
import { RouteInfo } from './types';

export function ConditionalRoute(props: {
  title: string;
  condition: string;
  type: string;
  children: ReactElement<any, any>;
}) {
  const { listOfRoutes } = useContext(RouterContext),
    condition = props?.condition || '',
    field = useField(condition),
    currentLocation = useLocation(),
    matchNextRoute = getNextRoute(listOfRoutes, currentLocation.pathname);

  return field && field[0].value === true ? (
    // use next in list of routes
    props.children
  ) : (
    <Navigate to={matchNextRoute?.path ? matchNextRoute?.path : ('/' as To)} />
  );
}
