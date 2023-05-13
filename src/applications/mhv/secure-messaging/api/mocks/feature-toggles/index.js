const generateFeatureToggles = (toggles = {}) => {
  const { mhvSecureMessagingToVAGovRelease = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhv_secure_messaging_to_va_gov_release',
          value: mhvSecureMessagingToVAGovRelease,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
