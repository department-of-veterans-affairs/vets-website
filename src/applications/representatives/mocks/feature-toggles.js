export const generateFeatureToggles = (toggles = {}) => {
  const { representativesPortalFrontend = false } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'representatives_portal_frontend',
          value: representativesPortalFrontend,
        },
      ],
    },
  };
};
