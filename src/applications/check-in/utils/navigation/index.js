const goToNextPageWithToken = (router, route) => {
  const { token } = router.params;

  router.push(`/${token}/${route}`);
};

export { goToNextPageWithToken };
