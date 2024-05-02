import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import { merge, pick } from 'lodash';

import {
  applicantDemographicsDescription,
  applicantDemographicsSubHeader,
  veteranUI,
  applicantDemographicsEthnicityTitle,
  applicantDemographicsRaceTitle,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export function uiSchema(
  subHeader = applicantDemographicsSubHeader,
  ethnicityTitle = applicantDemographicsEthnicityTitle,
  raceTitle = applicantDemographicsRaceTitle,
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
        ethnicity: { 'ui:title': ethnicityTitle },
        race: { 'ui:title': raceTitle },
        raceComment: {
          'ui:title': 'Enter the race that best describes you',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            // maxLength: 100,
            expandUnder: 'race',
            required: 'Yes',
            expandUnderCondition: 'na',
            expandedContentFocus: true,
          },
        },
        // This is attempted fuctionality from src/platform/forms-system/src/js/web-component-patterns/relationshipToVeteranPattern.jsx
        // 'ui:options': {
        //   updateSchema: (formData, formSchema) => {
        //     if (formSchema.properties.raceComment['ui:collapsed']) {
        //       return { ...formSchema, required: ['race'] };
        //     }
        //     return {
        //       ...formSchema,
        //       required: ['race', 'raceComment'],
        //     };
        //   },
        // },
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
          required: ['ethnicity', 'race', 'raceComment'],
          properties: merge(
            {},
            pick(veteran.properties, ['ethnicity', 'race']),
            {
              raceComment: {
                type: 'string',
                maxLength: 100,
              },
            },
          ),
        },
      },
    },
  },
};
