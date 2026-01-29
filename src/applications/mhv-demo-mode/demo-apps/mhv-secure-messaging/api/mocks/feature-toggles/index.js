const generateFeatureToggles = () => {
  return {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'mhv_secure_messaging_cerner_pilot', value: false }],
    },
  };
};

module.exports = { generateFeatureToggles };
