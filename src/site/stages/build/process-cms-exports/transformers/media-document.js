const transform = entity => ({
  entityType: 'media',
  entityBundle: 'document',
  fieldDocument: {
    entity: {
      filename: entity.fieldDocument[0].filename,
      url: encodeURI(entity.fieldDocument[0].url.replace('public:/', '/files')),
    },
  },
});

module.exports = {
  filter: ['name', 'path', 'field_document'],
  transform,
};
