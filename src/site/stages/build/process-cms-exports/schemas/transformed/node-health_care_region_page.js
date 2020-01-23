module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_region_page'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['health_care_region_page'] },
        title: { type: 'string' },
        entityUrl: { $ref: 'EntityUrl' },
        fieldNicknameForThisFacility: { type: 'string' },
        fieldPressReleaseBlurb: { $ref: 'ProcessedString' },
        // TODO: Figure out the type vs. __typename stuff
        entityMetaTags: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              __typename: { type: 'string' },
              key: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
      },
      required: [
        'title',
        'fieldNicknameForThisFacility',
        'fieldPressReleaseBlurb',
      ],
    },
  },
  required: ['entity'],
};
