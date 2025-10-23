const features = (enabled = true) => ({
  data: {
    type: 'feature_toggles',
    features: [{ name: 'avs_enabled', value: enabled }],
  },
});

export default features;
