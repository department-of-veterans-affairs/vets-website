const contentModelType = 'paragraph-q_a';

module.exports = {
  $id: contentModelType,
  type: 'object',
  baseType: {
    enum: ['paragraph'],
  },
  contentModelType: {
    enum: [contentModelType],
  },
};
