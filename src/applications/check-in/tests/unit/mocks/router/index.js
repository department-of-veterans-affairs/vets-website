const createMockRouter = ({
  push = () => {},
  createHref = () => {},
  currentPage = '',
  params = {},
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
  };
};

export { createMockRouter };
