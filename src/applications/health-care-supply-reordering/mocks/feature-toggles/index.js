const generateFeatureToggles = (toggles = {}) => {
  const {
    supplyReorderingSleepApneaEnabled = true,
    mhvSupplyReorderingEnabled = false,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'supply_reordering_sleep_apnea_enabled',
          value: supplyReorderingSleepApneaEnabled,
        },
        {
          name: 'mhv_supply_reordering_enabled',
          value: mhvSupplyReorderingEnabled,
        },
        {
          name: 'supplyReorderingSleepApneaEnabled',
          value: supplyReorderingSleepApneaEnabled,
        },
        {
          name: 'mhvSupplyReorderingEnabled',
          value: mhvSupplyReorderingEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
