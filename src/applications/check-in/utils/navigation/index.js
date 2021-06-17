const getTokenFromRouter = router => {
  const { token } = router.params;
  return token;
};

const goToNextPageWithToken = (router, route) => {
  const token = getTokenFromRouter(router);
  router.push(`/${token}/${route}`);
};

export { goToNextPageWithToken, getTokenFromRouter };
