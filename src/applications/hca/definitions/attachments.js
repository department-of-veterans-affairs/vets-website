export const attachmentsSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['attachmentId', 'name'],
    properties: {
      name: {
        type: 'string',
      },
      size: {
        type: 'integer',
      },
      confirmationCode: {
        type: 'string',
      },
      attachmentId: {
        type: 'string',
        enum: ['1', '2', '3', '4', '5', '6', '7'],
        enumNames: [
          'DD214',
          'DD215 (used to correct or make additions to the DD214)',
          'WD AGO 53-55 (report of separation used prior to 1950)',
          'Other discharge papers (like your DD256, DD257, or NGB22)',
          'Official documentation of a military award (like a Purple Heart, Medal of Honor, or Silver Star)',
          'Disability rating letter from the Veterans Benefit Administration (VBA)',
          'Other official military document',
        ],
      },
    },
  },
};
