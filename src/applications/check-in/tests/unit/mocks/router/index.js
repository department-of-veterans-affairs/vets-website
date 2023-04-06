const createMockRouter = ({
  push = () => {},
  createHref = () => {},
  currentPage = '',
  params = {},
  replace = () => {},
  go = () => {},
  goBack = () => {},
  goForward = () => {},
  setRouteLeaveHook = () => {},
  isActive = () => {},
} = {}) => {
  const pathname =
    currentPage && !currentPage.startsWith('/')
      ? `/${currentPage}`
      : currentPage;
  return {
    push,
    createHref,
    location: {
      pathname,
    },
    params,
    replace,
    go,
    goBack,
    goForward,
    setRouteLeaveHook,
    isActive,
  };
};

export { createMockRouter };
