const generateFeatureToggles = (toggles = {}) => {
  const { myVaUseExperimental = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'my_va_experimental',
          value: myVaUseExperimental,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
