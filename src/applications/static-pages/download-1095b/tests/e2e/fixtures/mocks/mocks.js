const featureToggles = {
  data: {
    type: 'feature_toggles',
    features: [{ name: 'show_digital_form_1095b', value: false }],
  },
};

const form = {
  availableForms: [
    {
      year: 2021,
      lastUpdated: '2022-08-03T20:38:29.382Z',
    },
  ],
};

const formUnavailable = {
  availableForms: [],
};

module.exports = {
  featureToggles,
  form,
  formUnavailable,
};
