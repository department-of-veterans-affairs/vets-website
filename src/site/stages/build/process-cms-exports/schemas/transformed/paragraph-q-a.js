const contentModelType = 'paragraph-q_a';

module.exports = {
  $id: contentModelType,
  type: 'object',
  properties: {
    baseType: {
      enum: ['paragraph'],
    },
    contentModelType: {
      enum: [contentModelType],
    },
  },
};
