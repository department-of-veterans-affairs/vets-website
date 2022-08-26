import commonDefinitions from 'vets-json-schema/dist/definitions.json';

const { usaPhone } = commonDefinitions;

export function phoneSchema() {
  return {
    type: 'object',
    properties: {
      phone: {
        ...usaPhone,
        pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
      },
      isInternational: {
        type: 'boolean',
      },
    },
  };
}
