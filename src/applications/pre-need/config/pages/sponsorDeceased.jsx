import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import { veteranUI } from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:description': applicantDescription,
  application: {
    veteran: merge({}, veteranUI, {
      isDeceased: {
        'ui:title': 'Has the sponsor died?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            yes: 'Yes',
            no: 'No',
            unsure: 'I don’t know',
          },
        },
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          required: ['isDeceased'],
          properties: pick(veteran.properties, ['isDeceased']),
        },
      },
    },
  },
};
