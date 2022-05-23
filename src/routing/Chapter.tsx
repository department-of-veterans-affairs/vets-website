import React, { ReactElement, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RouterContext } from './RouterContext';
import { ChapterProps } from './types';

/**
 * Renders the chapter contents
 *
 * @beta
 */
export default function Chapter(props: ChapterProps): JSX.Element {
  const listOfRoutes = useContext(RouterContext).listOfRoutes;
  const currentLocation = useLocation();

  return (
    <div className="chapter">
      {props.title && <h2>{props.title}</h2>}
      {props.children}
      <Outlet />
    </div>
  );
}
