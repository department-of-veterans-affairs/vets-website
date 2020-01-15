module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-press_release'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['press_release'] },
        title: { type: 'string' },
        entityUrl: {
          type: 'object',
          properties: {
            path: { type: 'string' },
          },
          required: ['path'],
        },
        fieldAddress: {
          type: 'object',
          properties: {
            locality: { type: 'string' },
            administrativeArea: { type: 'string' },
          },
          required: ['locality', 'administrativeArea'],
        },
        fieldIntroText: { type: 'string' },
        fieldOffice: {
          type: 'object',
          properties: {
            entity: {
              type: 'object',
              properties: {
                entityLabel: { type: 'string' },
                fieldPressReleaseBlurb: {
                  type: 'object',
                  properties: {
                    processed: { type: 'string' },
                  },
                },
              },
              required: ['entityLabel', 'fieldPressReleaseBlurb'],
            },
          },
          required: ['entity'],
        },
        fieldPdfVersion: { type: ['string', 'null'] },
        fieldPressReleaseContact: { $ref: 'transformed/node-person_profile' },
        fieldPressReleaseDownloads: { type: 'array' },
        fieldPressReleaseFulltext: { type: 'string' },
        fieldReleaseDate: {
          type: 'object',
          // These properties are strings resembling dates
          properties: {
            value: { type: 'string' },
            date: { type: 'string' },
          },
          required: ['value', 'date'],
        },
      },
      required: [
        'title',
        'entityUrl',
        'fieldAddress',
        'fieldIntroText',
        'fieldOffice',
        'fieldPdfVersion',
        'fieldPressReleaseContact',
        'fieldPressReleaseDownloads',
        'fieldPressReleaseFulltext',
        'fieldReleaseDate',
      ],
    },
  },
  required: ['entity'],
};
