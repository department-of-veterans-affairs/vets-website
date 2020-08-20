module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string', enum: ['media'] },
        entityBundle: { type: 'string', enum: ['image'] },
        name: { type: 'string' },
        thumbnail: { $ref: 'output/file' },
        entityMetatags: { $ref: 'MetaTags' },
        fieldMediaInLibrary: { type: 'boolean' },
        fieldOwner: { $ref: 'output/taxonomy_term-administration' },
        image: { $ref: 'output/file' },
      },
      required: [
        'name',
        'thumbnail',
        'entityMetatags',
        'fieldMediaInLibrary',
        'image',
      ],
    },
  },
};
