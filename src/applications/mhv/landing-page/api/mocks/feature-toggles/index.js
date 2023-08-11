export const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPageEnabled = true,
    mhvLinkYourLinkNameHereToggle = true, // see utilities/data/data.unit.spec.js
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhv_landing_page_enabled',
          value: mhvLandingPageEnabled,
        },
        {
          name: 'mhv_link_your_link_name_here_toggle',
          value: mhvLinkYourLinkNameHereToggle,
        },
      ],
    },
  };
};
