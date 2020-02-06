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
        fieldRelatedLinks: {
          $ref: 'transformed/paragraph-list_of_link_teasers',
        },
        fieldPressReleaseBlurb: { $ref: 'ProcessedString' },
        entityMetaTags: { $ref: 'MetaTags' },
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
