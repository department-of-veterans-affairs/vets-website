const generateFeatureToggles = (toggles = {}) => {
  const { profileUseVaosV2Api = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'profile_use_vaos_v2_api',
          value: profileUseVaosV2Api,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
