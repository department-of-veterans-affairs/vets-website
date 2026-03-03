const APPLICATION_FEATURE_FLAGS = Object.freeze({
  survivorsBenefitsFormEnabled: true,
  survivorsBenefitsForm2025VersionEnabled: true,
});

const generateFeatureFlags = ({ toggles = APPLICATION_FEATURE_FLAGS } = {}) => {
  const {
    survivorsBenefitsFormEnabled,
    survivorsBenefitsForm2025VersionEnabled,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'survivors_benefits_form_enabled',
          value: survivorsBenefitsFormEnabled,
        },
        {
          name: 'survivors_benefits_form_2025_version_enabled',
          value: survivorsBenefitsForm2025VersionEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureFlags };
