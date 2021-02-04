module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['media-document_external'] },
    entityType: { enum: ['media'] },
    entityBundle: { enum: ['document_external'] },
    name: { type: 'string' },
    fieldDescription: { type: 'string' },
    fieldMediaExternalFile: {
      type: 'object',
      properties: {
        uri: { type: 'string' },
        title: { type: 'string' },
      },
    },
    fieldMediaInLibrary: { type: 'boolean' },
    fieldMimeType: { type: 'string' },
    fieldOwner: { $ref: 'output/taxonomy_term-administration' },
  },
  required: [
    'name',
    'fieldDescription',
    'fieldMediaExternalFile',
    'fieldMediaInLibrary',
    'fieldMimeType',
    'fieldOwner',
  ],
};
