module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['media'] },
    entityBundle: { type: 'string', enum: ['video'] },
    name: { type: 'string' },
    thumbnail: { $ref: 'output/file' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldMediaInLibrary: { type: 'boolean' },
    fieldMediaVideoEmbedField: { type: 'string' },
    fieldOwner: { $ref: 'output/taxonomy_term-administration' },
  },
  required: [
    'name',
    'thumbnail',
    'entityMetatags',
    'fieldMediaInLibrary',
    'fieldMediaVideoEmbedField',
  ],
};
