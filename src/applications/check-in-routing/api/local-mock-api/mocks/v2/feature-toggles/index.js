const generateFeatureToggles = (toggles = {}) => {
  const { checkInUnifiedExperience = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'check_in_unified_experience_enabled',
          value: checkInUnifiedExperience,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
