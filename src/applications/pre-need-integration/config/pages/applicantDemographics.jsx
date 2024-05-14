import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';

import {
  applicantDemographicsDescription,
  applicantDemographicsSubHeader,
  veteranUI,
  applicantDemographicsGenderTitle,
  applicantDemographicsMaritalStatusTitle,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export function uiSchema(
  subHeader = applicantDemographicsSubHeader,
  genderTitle = applicantDemographicsGenderTitle,
  maritalStatusTitle = applicantDemographicsMaritalStatusTitle,
) {
  return {
    application: {
      'ui:title': subHeader,
      'view:applicantDemographicsDescription': {
        'ui:description': applicantDemographicsDescription,
        'ui:options': {
          displayEmptyObjectOnReview: true,
        },
      },
      veteran: merge({}, veteranUI, {
        gender: { 'ui:title': genderTitle },
        maritalStatus: { 'ui:title': maritalStatusTitle },
      }),
    },
  };
}

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        'view:applicantDemographicsDescription': {
          type: 'object',
          properties: {},
        },
        veteran: {
          type: 'object',
          required: ['maritalStatus', 'gender'],
          properties: pick(veteran.properties, ['maritalStatus', 'gender']),
        },
      },
    },
  },
};
