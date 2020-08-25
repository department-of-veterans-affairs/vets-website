module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['media'] },
    entityBundle: { type: 'string', enum: ['image'] },
    name: { type: 'string' },
    thumbnail: { $ref: 'output/file' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldMediaInLibrary: { type: 'boolean' },
    fieldOwner: { $ref: 'output/taxonomy_term-administration' },
    // image: { $ref: 'output/file' },
    image: {
      type: 'object',
      properties: {
        alt: { type: ['string'] },
        title: { type: 'string' },
        url: { type: ['string'] },
        derivative: {
          type: 'object',
          properties: {
            url: { type: ['string', 'null'] },
          },
          required: ['url'],
        },
      },
      required: ['url'],
    },
  },
  required: [
    'name',
    'thumbnail',
    'entityMetatags',
    'fieldMediaInLibrary',
    'image',
  ],
};
