export const useRouteMetadata = router => {
  const { pathname } = router.location;

  // check that there is a route with a urlPrefix and a path property, then combine them
  const foundRoute = router.routes.find(
    route =>
      route.urlPrefix &&
      route.path &&
      `${route.urlPrefix}${route.path}` === pathname,
  );

  if (!foundRoute) {
    return null;
  }

  return foundRoute;
};
