module.exports = {
  $id: 'ProcessedString',
  type: 'object',
  properties: {
    processed: { type: 'string' },
  },
  // breadcrumbs are left out for now until we get them from the CMS
  required: ['processed'],
};
