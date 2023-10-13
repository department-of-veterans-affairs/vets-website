const emptyFunc = () => {
  return 'test';
};

const createMockRouter = ({
  push = emptyFunc,
  createHref = emptyFunc,
  currentPage = '',
  params = {},
  replace = emptyFunc,
  go = emptyFunc,
  goBack = emptyFunc,
  goForward = emptyFunc,
  setRouteLeaveHook = emptyFunc,
  isActive = emptyFunc,
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

export { createMockRouter, emptyFunc };
