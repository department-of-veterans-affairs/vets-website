const createMockRouter = ({ push = () => {}, currentPage = '' } = {}) => {
  const pathname =
    currentPage && !currentPage.startsWith('/')
      ? `/${currentPage}`
      : currentPage;
  return {
    push,
    location: {
      pathname,
    },
  };
};

export { createMockRouter };
