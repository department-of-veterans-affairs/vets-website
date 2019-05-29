import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

const { isActiveDuty } = fullSchema1995.properties;

export const uiSchema = {
  isActiveDuty: {
    'ui:title': ' ',
    'ui:description':
      'Are you currently on active duty or do you anticipate you will be going on active duty?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  properties: {
    isActiveDuty,
  },
};
