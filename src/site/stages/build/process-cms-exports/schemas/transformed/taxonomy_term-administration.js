const contentModelType = 'taxonomy_term-administration';

module.exports = {
  type: 'object',
  properties: {
    baseType: {
      enum: ['taxonomy_term'],
    },
    contentModelType: {
      enum: [contentModelType],
    },
  },
};
