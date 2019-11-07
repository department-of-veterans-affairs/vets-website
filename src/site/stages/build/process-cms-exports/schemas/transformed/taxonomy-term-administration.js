const contentModelType = 'taxonomy_term-administration';

module.exports = {
  $id: contentModelType,
  type: 'object',
  baseType: {
    enum: ['taxonomy_term'],
  },
  contentModelType: {
    enum: [contentModelType],
  },
};
