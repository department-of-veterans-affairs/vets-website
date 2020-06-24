const transformer = fieldData => ({
  // TODO: Get the breadcrumb from the CMS export when it's available
  breadcrumb: [],
  path: fieldData[0].alias,
});

const schemaMap = [
  {
    input: { $ref: 'RawPath' },
    output: [{ $ref: 'EntityUrl' }],
  },
];

module.exports = { transformer, schemaMap };
