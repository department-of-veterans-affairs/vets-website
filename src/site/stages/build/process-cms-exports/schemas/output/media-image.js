module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['media'] },
    entityBundle: { type: 'string', enum: ['image'] },
    name: { type: 'string' },
    thumbnail: { $ref: 'output/file' },
    created: { type: 'number' },
    changed: { type: 'number' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldMediaInLibrary: { type: 'boolean' },
    fieldOwner: { $ref: 'output/taxonomy_term-administration' },
    image: { $ref: 'output/file' },
  },
  required: [
    'name',
    'thumbnail',
    'created',
    'changed',
    'entityMetatags',
    'fieldMediaInLibrary',
    'image',
  ],
};
