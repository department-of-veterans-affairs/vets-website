module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-landing_page'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['landing_page'] },
    entityMetatags: { $ref: 'MetaTags' },
    title: { type: 'string' },
    changed: { type: 'string' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAdministration: {
      $ref: 'transformed/taxonomy_term-administration',
    },
    fieldAlert: {
      oneOf: [{ $ref: 'transformed/block_content-alert' }, { type: 'null' }],
    },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: 'string' },
    fieldLinks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: {
            type: 'object',
            properties: {
              path: { type: 'string' },
            },
            required: ['path'],
          },
        },
        required: ['title', 'url'],
      },
    },
    fieldPageLastBuilt: { type: 'string' },
    fieldPlainlanguageDate: { type: ['string', 'null'] },
    fieldPromo: { $ref: 'transformed/block_content-promo' },
    fieldRelatedLinks: {
      oneOf: [
        {
          $ref: 'transformed/paragraph-list_of_link_teasers',
        },
        { type: 'null' },
      ],
    },
    fieldSpokes: {
      type: 'array',
      items: {
        $ref: 'transformed/paragraph-list_of_link_teasers',
      },
    },
    fieldSupportServices: {
      type: 'array',
      items: { $ref: 'transformed/node-support_service' },
    },
    fieldTitleIcon: { type: 'string' },
  },
  required: [
    'title',
    'entityMetatags',
    'changed',
    'entityUrl',
    'fieldAdministration',
    'fieldAlert',
    'fieldDescription',
    'fieldIntroText',
    'fieldLinks',
    'fieldPageLastBuilt',
    'fieldPlainlanguageDate',
    'fieldPromo',
    'fieldRelatedLinks',
    'fieldSpokes',
    'fieldSupportServices',
    'fieldTitleIcon',
  ],
};
