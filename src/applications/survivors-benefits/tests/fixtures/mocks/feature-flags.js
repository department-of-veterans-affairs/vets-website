const APPLICATION_FEATURE_FLAGS = Object.freeze({
  survivorsBenefitsFormEnabled: true,
  survivorsBenefitsForm2025VersionEnabled: false,
  survivorsBenefitsIdp: false,
});

const generateFeatureFlags = ({ toggles = APPLICATION_FEATURE_FLAGS } = {}) => {
  const {
    survivorsBenefitsFormEnabled,
    survivorsBenefitsForm2025VersionEnabled,
    survivorsBenefitsIdp,
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
        {
          name: 'survivors_benefits_idp',
          value: survivorsBenefitsIdp,
        },
      ],
    },
  };
};

module.exports = { generateFeatureFlags };
