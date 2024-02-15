import { merge } from 'lodash';

import {
  applicantDemographicsDescription,
  applicantDemographicsSubHeader,
  veteranUI,
  applicantDemographicsGenderTitle,
  applicantDemographicsMaritalStatusTitle,
} from '../../utils/helpers';

export function uiSchema(
  genderTitle = applicantDemographicsGenderTitle,
  maritalStatusTitle = applicantDemographicsMaritalStatusTitle,
) {
  return {
    application: {
      'ui:title': applicantDemographicsSubHeader,
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
          // properties: pick(veteran.properties, [
          //   'maritalStatus',
          //   'gender',
          // ]),
          properties: {
            maritalStatus: {
              type: 'string',
              enum: [
                'Single',
                'Separated',
                'Married',
                'Divorced',
                'Widowed',
                'na',
              ],
            },
            gender: {
              type: 'string',
              enum: ['Female', 'Male', 'na'],
            },
          },
        },
      },
    },
  },
};
