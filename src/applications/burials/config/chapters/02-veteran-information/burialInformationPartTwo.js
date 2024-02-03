import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  radioUI,
  // radioSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
// import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import { generateTitle } from '../../../utils/helpers';
import { locationOfDeathLabels } from '../../../utils/labels';

const { locationOfDeath } = fullSchemaBurials.properties;

// export const locationOfDeathUI = options => {
//   const { personTitle } =
//     typeof options === 'object' ? options : { personTitle: options };
//   const person = personTitle ?? 'Veteran';

//   return {
//     relationshipToVeteran: radioUI({
//       title: `Whats your relationship to the ${person}?`,
//       labels: relationshipLabels,
//       errorMessages: {
//         required: `Select your relationship to the ${person}`,
//       },
//       labelHeaderLevel: '',
//     }),
//     otherRelationshipToVeteran: {
//       'ui:title': `Since your relationship with the ${person} was not listed, please describe it here`,
//       'ui:webComponentField': VaTextInputField,
//       'ui:options': {
//         expandUnder: 'relationshipToVeteran',
//         expandUnderCondition: 'otherFamily',
//         expandedContentFocus: true,
//       },
//       'ui:errorMessages': {
//         required: `Enter your relationship to the ${person}`,
//       },
//     },
//     'ui:options': {
//       updateSchema: (formData, formSchema) => {
//         if (formSchema.properties.otherRelationshipToVeteran['ui:collapsed']) {
//           return { ...formSchema, required: ['relationshipToVeteran'] };
//         }
//         return {
//           ...formSchema,
//           required: ['relationshipToVeteran', 'otherRelationshipToVeteran'],
//         };
//       },
//     },
//   };
// };

export default {
  uiSchema: {
    'ui:title': generateTitle('Burial information'),
    locationOfDeath: {
      location: {
        ...radioUI({
          title: `Where did the Veteran's death occur?`,
          labels: locationOfDeathLabels,
          errorMessages: {
            required: `Select your relationship to the Veteran`,
          },
          labelHeaderLevel: '',
        }),
        // 'ui:options': {
        //   classNames: 'vads-u-margin-top--3',
        // },
      },
      // location: {
      //   'ui:title': 'Where did the Veteran’s death occur?',
      //   'ui:widget': 'radio',
      //   'ui:errorMessages': {
      //     required: 'Select where the Veteran’s death happened',
      //   },
      //   'ui:options': {
      //     labels: locationOfDeathLabels,
      //   },
      // },
      nursingHomePaid: {
        facilityName: {
          'ui:title': 'Name of the facility or nursing home that VA pays for',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'nursingHomePaid' &&
            !form.facilityName,
          'ui:errorMessages': {
            required:
              'Enter the name of the facility or nursing home that VA pays for',
          },
        },
        facilityLocation: {
          'ui:title':
            'City and state of the facility or nursing home that VA pays for',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'nursingHomePaid' &&
            !form.facilityLocation,
          'ui:errorMessages': {
            required:
              'Enter the city and state of the facility or nursing home that VA pays for',
          },
        },
        'ui:options': {
          // hideIf: form =>
          //   get('locationOfDeath.location', form) !== 'nursingHomePaid',
          expandUnder: 'nursingHomePaid',
          expandUnderCondition: 'nursingHomePaid',
          expandedContentFocus: true,
        },
      },
      vaMedicalCenter: {
        facilityName: {
          'ui:title': 'Name of the VA medical center',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'vaMedicalCenter' &&
            !form.facilityName,
          'ui:errorMessages': {
            required: 'Enter the Name of the VA medical center',
          },
        },
        facilityLocation: {
          'ui:title': 'City and state of the VA medical center',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'vaMedicalCenter' &&
            !form.facilityLocation,
          'ui:errorMessages': {
            required: 'Enter the city and state of the VA medical center',
          },
        },
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'vaMedicalCenter',
        },
      },
      stateVeteransHome: {
        facilityName: {
          'ui:title': 'Name of the state Veterans facility',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'stateVeteransHome' &&
            !form.facilityName,
          'ui:errorMessages': {
            required: 'Enter the name of the state Veterans facility',
          },
        },
        facilityLocation: {
          'ui:title': 'City and state of the state Veterans facility',
          'ui:required': form =>
            get('locationOfDeath.location', form) === 'stateVeteransHome' &&
            !form.facilityLocation,
          'ui:errorMessages': {
            required: 'Enter the city and state of the state Veterans facility',
          },
        },
        'ui:options': {
          hideIf: form =>
            get('locationOfDeath.location', form) !== 'stateVeteransHome',
        },
      },
      other: {
        'ui:title': 'Place where the Veteran’s death happened',
        'ui:errorMessages': {
          required: 'Enter where the Veteran’s death happened',
        },
        'ui:required': form =>
          get('locationOfDeath.location', form) === 'other',
        'ui:options': {
          hideIf: form => get('locationOfDeath.location', form) !== 'other',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['locationOfDeath'],
    properties: {
      locationOfDeath,
    },
  },
};
