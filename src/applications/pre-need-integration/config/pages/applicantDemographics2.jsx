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
          'ui:title': 'Additional Information on Race',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            expandUnder: 'race',
            expandUnderCondition: false,
            // expandedContentFocus: false,
          },
          'ui:errorMessages': {
            required: "This field is required when 'Other' is selected.",
          },
        },
        'ui:options': {
          updateSchema: (formData, formSchema) => {
            if (formSchema.properties.raceComment['ui:collapsed']) {
              return { ...formSchema, required: ['race'] };
            }
            return {
              ...formSchema,
              required: ['race', 'raceComment'],
            };
          },
        },
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
          required: ['ethnicity', 'race'],
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
