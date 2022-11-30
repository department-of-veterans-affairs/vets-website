export const uiSchema = {};
// this schema is needed if a CustomPageReview isn't included, and is used
// for form validation
export const schema = {
  type: 'object',
  properties: {
    addIssue: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['name'], // no empty issue names
        properties: {
          // this property aren't really necessary, but here for completeness
          name: {
            type: 'string',
            maxLength: 140,
          },
        },
      },
    },
  },
};
