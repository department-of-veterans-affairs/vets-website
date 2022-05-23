import React, { ReactElement } from 'react';
import { createRoutesFromChildren, RouteObject } from 'react-router-dom';
import { RouterContextProps, RouterProps } from './types';

import { IRouterContext } from './types';

const RouterContextDefaultState = {
  listOfRoutes: [],
};

export const RouterContext = React.createContext<IRouterContext>(
  RouterContextDefaultState
);

export const routeObjectsReducer = (routeObjectsArray: RouteObject[]) => {
  return routeObjectsArray.reduce<string[]>(
    (accumulator, current): string[] => {
      if (current.children) {
        return [
          ...accumulator,
          current?.path ? current.path : '/',
          ...current.children.map((child) =>
            child?.path ? (current?.path as string) + '/' + child.path : '/'
          ),
        ];
      }
      return [...accumulator, current?.path ? current.path : '/'];
    },
    []
  );
};

export function RouterContextProvider(props: RouterContextProps): JSX.Element {
  const routeObjects = createRoutesFromChildren(props.routes),
    listOfRoutes = routeObjectsReducer(routeObjects);

  return (
    <RouterContext.Provider value={{ listOfRoutes: listOfRoutes }}>
      {props.children}
    </RouterContext.Provider>
  );
}
