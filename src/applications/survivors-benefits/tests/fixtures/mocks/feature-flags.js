const APPLICATION_FEATURE_FLAGS = Object.freeze({
  survivorsBenefitsFormEnabled: true,
  survivorsBenefitsForm2025VersionEnabled: false,
});

const generateFeatureFlags = ({ toggles = APPLICATION_FEATURE_FLAGS } = {}) => {
  // const {
  //   survivorsBenefitsFormEnabled,
  //   survivorsBenefitsForm2025VersionEnabled,
  // } = toggles;

  // eslint-disable-next-line no-console
  console.log(toggles);

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'survivors_benefits_form_enabled',
          value: true,
        },
        {
          name: 'survivorsBenefitsFormEnabled',
          value: true,
        },
      ],
    },
  };
};

module.exports = { generateFeatureFlags };
