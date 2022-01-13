const createMockRouter = ({
  push = () => {},
  currentPage = '',
  params = {},
} = {}) => {
  const pathname =
    currentPage && !currentPage.startsWith('/')
      ? `/${currentPage}`
      : currentPage;
  return {
    push,
    location: {
      pathname,
    },
    params,
  };
};

export { createMockRouter };
