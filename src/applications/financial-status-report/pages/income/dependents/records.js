export const schemaEnhanced = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        dependents: {
          type: 'array',
          items: {
            type: 'object',
            required: ['dependentAge'],
            properties: {
              dependentAge: {
                type: 'string',
                pattern: '^\\d+$',
              },
            },
          },
        },
      },
    },
  },
};
