const contentModelType = 'paragraph-list_of_link_teasers';

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
