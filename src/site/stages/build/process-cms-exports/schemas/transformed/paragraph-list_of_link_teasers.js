const contentModelType = 'paragraph-list_of_link_teasers';

module.exports = {
  type: 'object',
  baseType: {
    enum: ['paragraph'],
  },
  contentModelType: {
    enum: [contentModelType],
  },
};
