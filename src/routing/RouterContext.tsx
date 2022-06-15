import { useField, useFormikContext } from 'formik';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
  createRoutesFromChildren,
  RouteObject,
  useLocation,
} from 'react-router-dom';
import { IRouterContext, RouteInfo, RouterContextProps } from './types';

const RouterContextDefaultState = {
  listOfRoutes: [
    {
      path: '',
      title: '',
      conditional: false,
      isShown: true,
    },
  ],
  currentRoute: '',
  updateRoute: (value: string) => null,
  previousRoute: '',
  nextRoute: '',
};

export const RouterContext = React.createContext<IRouterContext>(
  RouterContextDefaultState
);

export const routeObjectsReducer = (routeObjectsArray: RouteObject[]) => {
  return routeObjectsArray.reduce<RouteInfo[]>(
    (accumulator, current): RouteInfo[] => {
      let accumulatorItem: RouteInfo[] = [...accumulator];
      const conditionalPath =
        ((current?.element as ReactElement)?.props as { type: string })
          ?.type === 'conditional';
      const condition = (
        (current?.element as ReactElement)?.props as { condition: string }
      )?.condition;
      const field = condition ? useField(condition) : null;

      if (current.path === '*') return accumulatorItem;

      accumulatorItem = [
        ...accumulatorItem,
        {
          path: current?.path ? current.path : '/',
          title: (
            (current?.element as ReactElement)?.props as { title: string }
          )?.title,
          conditional: conditionalPath,
          isShown: conditionalPath && field && field[0].value === true,
        },
      ];
      if (current.children) {
        accumulatorItem = [
          ...accumulatorItem,
          ...current.children.map((child) => {
            return {
              path: child?.path
                ? (current?.path as string) + '/' + child.path
                : '/',
              title: (
                (child?.element as ReactElement)?.props as { title: string }
              )?.title,
              // logic needs to be added to child path but isn't relevant now
              conditional: false,
              isShown: false,
            };
          }),
        ];
      }
      return accumulatorItem;
    },
    []
  );
};

export const getPreviousRoute = (routes: RouteInfo[], currentPath: string) => {
  const findIndex = routes.indexOf(
    routes.filter((item) => item.path === currentPath)[0]
  );

  let matchNext: RouteInfo | null = null;
  let i = findIndex >= 0 ? findIndex - 1 : 0;
  while (i < findIndex && i >= 0) {
    if (!routes[i].conditional || routes[i].isShown === true) {
      matchNext = routes[i];
      break;
    }
    i--;
  }
  return matchNext;
};

export const getNextRoute = (routes: RouteInfo[], currentPath: string) => {
  const findIndex = routes.indexOf(
    routes.filter((item) => item.path === currentPath)[0]
  );
  let matchNext: RouteInfo | null = null;
  let i = findIndex >= 0 ? findIndex + 1 : 0;

  while (i >= findIndex && i < routes.length) {
    if (!routes[i].conditional || routes[i].isShown) {
      matchNext = routes[i];
      break;
    }
    i++;
  }
  return matchNext;
};

export function RouterContextProvider(props: RouterContextProps): JSX.Element {
  const routeObjects = createRoutesFromChildren(props.routes),
    listOfRoutes = routeObjectsReducer(routeObjects);

  const [route, updateRoute] = useState('/');
  const currentLocation = useLocation();
  const previousRoute = getPreviousRoute(
    listOfRoutes,
    currentLocation.pathname
  );
  const nextRoute = getNextRoute(listOfRoutes, currentLocation.pathname);

  useEffect(
    () =>
      updateRoute(
        currentLocation.pathname !== '' ? currentLocation.pathname : '/'
      ),
    [currentLocation]
  );

  return (
    <RouterContext.Provider
      value={{
        ...props,
        listOfRoutes: listOfRoutes,
        currentRoute: route,
        previousRoute: previousRoute?.path ? previousRoute?.path : null,
        nextRoute: nextRoute?.path ? nextRoute?.path : null,
      }}
    >
      {props.children}
    </RouterContext.Provider>
  );
}
