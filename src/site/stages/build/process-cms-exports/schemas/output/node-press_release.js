module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-press_release'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['press_release'] },
    // uid is present in GraphQL output, but some uids don't exist ignoring for now
    // uid: {
    //   oneOf: [{ type: 'null' }, { $ref: 'output/user' }],
    // },
    title: { type: 'string' },
    created: { type: 'number' },
    promote: { type: 'boolean' },
    entityMetatags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          __typename: { type: 'string' },
          key: { type: 'string' },
          value: { type: 'string' },
        },
        required: ['__typename', 'key', 'value'],
      },
    },
    entityPublished: { type: 'boolean' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAddress: { $ref: 'Address' },
    fieldIntroText: { type: 'string' },
    fieldOffice: {
      oneOf: [
        { type: 'null' },
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/node-health_care_region_page' },
          },
        },
      ],
    },
    fieldPdfVersion: { $ref: 'Media' },
    fieldPressReleaseContact: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          entity: { $ref: 'output/node-person_profile' },
        },
        required: ['entity'],
      },
    },
    fieldPressReleaseDownloads: { type: 'array', items: { $ref: 'Media' } },
    fieldPressReleaseFulltext: { $ref: 'ProcessedString' },
    fieldReleaseDate: {
      type: 'object',
      // These properties are strings resembling dates
      properties: {
        value: { type: 'string' },
        date: { type: 'string' },
      },
      required: ['value', 'date'],
    },
    status: { type: 'boolean' },
  },
  required: [
    // 'uid',
    'title',
    'created',
    'promote',
    'entityPublished',
    'entityUrl',
    'fieldAddress',
    'fieldIntroText',
    'fieldOffice',
    'fieldPdfVersion',
    'fieldPressReleaseContact',
    'fieldPressReleaseDownloads',
    'fieldPressReleaseFulltext',
    'fieldReleaseDate',
    'status',
  ],
};
