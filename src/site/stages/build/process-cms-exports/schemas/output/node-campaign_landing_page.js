/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { type: 'number' },
    entityBundle: { type: 'string', enum: ['campaign_landing_page'] },
    entityMetatags: { $ref: 'MetaTags' },
    entityType: { type: 'string', enum: ['node'] },
    title: { type: 'string' },
    fieldAdministration: {
      $ref: 'output/taxonomy_term-administration',
    },
    fieldBenefitCategories: {
      type: 'array',
      items: {
        $ref: 'output/node-landing_page',
      },
    },
    fieldClpAudience: { $ref: 'output/taxonomy_term-audience_tags' },
    fieldClpConnectWithUs: {
      $ref: 'output/taxonomy_term-administration',
    },
    fieldClpEventsHeader: {
      type: 'string',
    },
    fieldClpEventsPanel: {
      type: 'boolean',
    },
    fieldClpEventsReferences: {
      type: 'array',
      items: {
        $ref: 'output/node-event',
      },
    },
    fieldClpFaqCta: {
      $ref: 'output/paragraph-button',
    },
    fieldClpFaqPanel: {
      type: 'boolean',
    },
    fieldClpFaqParagraphs: {
      type: 'array',
      items: {
        $ref: 'output/paragraph-q_a',
      },
    },
    fieldClpResources: {
      type: 'array',
      items: {
        $ref: 'output/media-document_external',
      },
    },
    fieldClpResourcesCta: {
      $ref: 'output/paragraph-button',
    },
    fieldClpResourcesHeader: {
      type: 'string',
    },
    fieldClpResourcesIntroText: {
      type: 'string',
    },
    fieldClpResourcesPanel: {
      type: 'boolean',
    },
    fieldClpSpotlightCta: {
      $ref: 'output/paragraph-button',
    },
    fieldClpSpotlightHeader: {
      type: 'string',
    },
    fieldClpSpotlightIntroText: {
      type: 'string',
    },
    fieldClpSpotlightLinkTeasers: {
      type: 'array',
      items: {
        $ref: 'output/paragraph-link_teaser',
      },
    },
    fieldClpSpotlightPanel: {
      type: 'boolean',
    },
    fieldClpStoriesCta: {
      oneOf: [
        { $ref: 'output/paragraph-button' },
        { type: 'array', maxItems: 0 },
      ],
    },
    fieldClpStoriesHeader: {
      type: 'string',
    },
    fieldClpStoriesIntro: {
      type: 'string',
    },
    fieldClpStoriesPanel: {
      type: 'boolean',
    },
    fieldClpStoriesTeasers: {
      type: 'array',
      items: {
        $ref: 'output/paragraph-link_teaser_with_image',
      },
    },
    fieldClpVideoPanel: {
      type: 'boolean',
    },
    fieldClpVideoPanelHeader: {
      type: 'string',
    },
    fieldClpVideoPanelMoreVideo: {
      $ref: 'output/paragraph-button',
    },
    fieldClpWhatYouCanDoHeader: {
      type: 'string',
    },
    fieldClpWhatYouCanDoIntro: {
      type: 'string',
    },
    fieldClpWhatYouCanDoPromos: {
      type: 'array',
      items: {
        $ref: 'output/block_content-promo',
      },
    },
    fieldClpWhyThisMatters: {
      type: 'string',
    },
    fieldHeroBlurb: {
      type: 'string',
    },
    fieldHeroImage: {
      $ref: 'output/media-image',
    },
    fieldMedia: {
      $ref: 'output/media-video',
    },
    fieldPrimaryCallToAction: {
      $ref: 'output/paragraph-button',
    },
    fieldSecondaryCallToAction: {
      $ref: 'output/paragraph-button',
    },
  },
  required: [
    'changed',
    'entityBundle',
    'entityMetatags',
    'entityType',
    'title',
    'fieldAdministration',
    'fieldBenefitCategories',
    'fieldClpAudience',
    'fieldClpConnectWithUs',
    'fieldClpEventsHeader',
    'fieldClpEventsPanel',
    'fieldClpEventsReferences',
    'fieldClpFaqCta',
    'fieldClpFaqPanel',
    'fieldClpFaqParagraphs',
    'fieldClpResources',
    'fieldClpResourcesCta',
    'fieldClpResourcesHeader',
    'fieldClpResourcesIntroText',
    'fieldClpResourcesPanel',
    'fieldClpSpotlightCta',
    'fieldClpSpotlightHeader',
    'fieldClpSpotlightIntroText',
    'fieldClpSpotlightLinkTeasers',
    'fieldClpSpotlightPanel',
    'fieldClpStoriesCta',
    'fieldClpStoriesHeader',
    'fieldClpStoriesIntro',
    'fieldClpStoriesPanel',
    'fieldClpStoriesTeasers',
    'fieldClpVideoPanel',
    'fieldClpVideoPanelHeader',
    'fieldClpVideoPanelMoreVideo',
    'fieldClpWhatYouCanDoHeader',
    'fieldClpWhatYouCanDoIntro',
    'fieldClpWhatYouCanDoPromos',
    'fieldClpWhyThisMatters',
    'fieldHeroBlurb',
    'fieldHeroImage',
    'fieldMedia',
    'fieldPrimaryCallToAction',
    'fieldSecondaryCallToAction',
  ],
};
