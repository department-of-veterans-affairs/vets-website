import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { MedicalTreatmentViewField } from '../components/MedicalTreatmentViewField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Where did the Veteran receive medical treatment?',
      'List VA medical centers, Defense Department military treatment facilities, or private medical facilities where the Veteran was treated. Provide the approximate date that the treatment started. You may add up to 5 facilities.',
    ),
    medicalTreatments: {
      'ui:options': {
        itemName: 'Treatment facility',
        viewField: MedicalTreatmentViewField,
        keepInPageOnReview: true,
        useVaCards: true,
        customTitle: ' ',
        useDlWrap: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'This will remove the facility from your priority processing request.',
      },
      items: {
        facilityName: {
          'ui:title': 'Name of treatment facility',
          'ui:webComponentField': VaTextInputField,
          'ui:errorMessages': {
            required:
              'Enter the name of the facility where the Veteran received treatment',
          },
          'ui:options': {
            charcount: 40,
          },
        },
        facilityAddress: addressNoMilitaryUI({
          omit: ['street2', 'street3'],
        }),
        startDate: currentOrPastDateUI({
          title: 'Approximate start date of treatment',
          errorMessages: {
            required: 'Enter the approximate date of when treatment began',
          },
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      medicalTreatments: {
        type: 'array',
        minItems: 1,
        maxItems: 4,
        items: {
          type: 'object',
          properties: {
            facilityName: {
              type: 'string',
              maxLength: 40,
            },
            facilityAddress: addressNoMilitarySchema({
              omit: ['street2', 'street3'],
            }),
            startDate: currentOrPastDateSchema,
          },
          required: ['facilityName', 'facilityAddress', 'startDate'],
        },
      },
    },
  },
};
