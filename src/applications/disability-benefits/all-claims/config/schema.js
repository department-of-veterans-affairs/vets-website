// This file to be moved to vets-json-schema repo before form hits production

const serviceBranches = [
  'Air Force',
  'Army',
  'Coast Guard',
  'Marine Corps',
  'National Oceanic and Atmospheric Administration',
  'Navy',
  'Public Health Service'
];

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'APPLICATION FOR DISABILITY BENEFITS',
  type: 'object',
  definitions: {},
  properties: {
    alternateNames: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: ['first', 'last'],
        properties: {
          first: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          },
          middle: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          },
          last: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          }
        }
      }
    },
    militaryRetiredPayBranch: {
      type: 'string',
      'enum': serviceBranches
    },
    waiveRetirementPay: {
      type: 'boolean'
    },
    separationPayDate: {
      type: 'string'
    },
    separationPayBranch: {
      type: 'string',
      'enum': serviceBranches
    },
    waiveTrainingPay: {
      type: 'boolean'
    }
  }
};

export default schema;
