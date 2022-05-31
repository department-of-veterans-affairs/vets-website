import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RouterContext } from './RouterContext';
import { ChapterProps } from './types';

/**
 * Renders the chapter contents
 *
 * @beta
 */
export default function Chapter(props: ChapterProps): JSX.Element {
  const { listOfRoutes, updateRoute } = useContext(RouterContext);
  const currentLocation = useLocation();

  useEffect(
    () =>
      updateRoute(
        currentLocation.pathname !== '' ? currentLocation.pathname : '/'
      ),
    [currentLocation]
  );

  return (
    <div className="chapter">
      {props.title && <h2>{props.title}</h2>}
      {props.children}
      <Outlet />
    </div>
  );
}
