const generateFeatureToggles = (toggles = {}) => {
  const { supplyReorderingSleepApneaEnabled = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'supply-reordering-sleep-apnea-enabled',
          value: supplyReorderingSleepApneaEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
