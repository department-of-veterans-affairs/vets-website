module.exports = {
  $id: 'EntityUrl',
  type: 'object',
  properties: {
    path: { type: ['string', 'null'] },
    breadcrumb: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              routed: { type: 'boolean' },
            },
          },
          text: { type: 'string' },
        },
      },
    },
  },
  // breadcrumbs are left out for now until we get them from the CMS
  required: ['path'],
};
