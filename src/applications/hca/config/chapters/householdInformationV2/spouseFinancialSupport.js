import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

const { provideSupportLastYear } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s financial support',
    provideSupportLastYear: {
      'ui:title':
        'If your spouse did not live with you last year, did you provide financial support?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      provideSupportLastYear,
    },
  },
};
