const contentModelType = 'taxonomy_term-administration';

module.exports = {
  $id: contentModelType,
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
