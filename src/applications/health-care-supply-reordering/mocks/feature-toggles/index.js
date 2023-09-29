const generateFeatureToggles = (toggles = {}) => {
  const { supplyReorderingSleepApneaEnabled = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'supply_reordering_sleep_apnea_enabled',
          value: supplyReorderingSleepApneaEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
