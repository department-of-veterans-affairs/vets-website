module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['media'] },
    entityBundle: { type: 'string', enum: ['video'] },
    name: { type: 'string' },
    thumbnail: { $ref: 'output/file' },
    created: { type: 'number' },
    changed: { type: 'number' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldMediaInLibrary: { type: 'boolean' },
    fieldMediaVideoEmbedField: { type: 'string' },
    fieldOwner: { $ref: 'output/taxonomy_term-administration' },
  },
  required: [
    'name',
    'thumbnail',
    'created',
    'changed',
    'entityMetatags',
    'fieldMediaInLibrary',
    'fieldMediaVideoEmbedField',
  ],
};
