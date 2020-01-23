module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-landing_page'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['landing_page'] },
        title: { type: 'string' },
        changed: { type: 'string' },
        entityUrl: { $ref: 'EntityUrl' },
        fieldAdministration: {
          $ref: 'transformed/taxonomy_term-administration',
        },
        fieldAlert: { type: ['string', 'null'] },
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
          $ref: 'transformed/paragraph-list_of_link_teasers',
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
    },
  },
  required: ['entity'],
};
