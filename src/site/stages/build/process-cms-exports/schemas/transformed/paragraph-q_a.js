const contentModelType = 'paragraph-q_a';

module.exports = {
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
