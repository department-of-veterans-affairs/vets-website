const generateFeatureToggles = (toggles = {}) => {
  const { defaultRoutingUseNewVersion = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'default_routing_use_new_version',
          value: defaultRoutingUseNewVersion,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
