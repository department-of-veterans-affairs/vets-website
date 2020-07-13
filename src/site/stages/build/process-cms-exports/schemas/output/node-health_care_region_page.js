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
        fieldLinkFacilityEmergList: {
          type: ['object', 'null'],
          properties: {
            url: {
              type: 'object',
              properties: {
                path: { type: 'string' },
              },
            },
          },
          required: ['url'],
        },
        fieldRelatedLinks: {
          $ref: 'output/paragraph-list_of_link_teasers',
        },
        fieldPressReleaseBlurb: { $ref: 'ProcessedString' },
        entityMetaTags: { $ref: 'MetaTags' },
      },
      required: [
        'title',
        'fieldNicknameForThisFacility',
        'fieldLinkFacilityEmergList',
        'fieldPressReleaseBlurb',
      ],
    },
  },
  required: ['entity'],
};
