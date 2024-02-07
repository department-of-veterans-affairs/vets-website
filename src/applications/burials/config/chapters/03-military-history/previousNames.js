import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
// import { fullNameUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import FullNameField from '@department-of-veterans-affairs/platform-forms-system/FullNameField';
import fullNameUI from '@department-of-veterans-affairs/platform-forms/fullName';
import { merge } from 'lodash';
import { generateHelpText } from '../../../utils/helpers';

const { previousNames } = fullSchemaBurials.properties;

const modifiedPreviousNames = merge(previousNames, {
  items: {
    properties: {
      'view:serviceBranches': {
        type: 'object',
        properties: {},
      },
    },
  },
});

export default {
  uiSchema: {
    previousNames: {
      'ui:options': {
        viewField: FullNameField,
      },
      items: {
        ...fullNameUI,
        first: {
          'ui:title': 'Veteran’s first name',
        },
        middle: {
          'ui:title': 'Veteran’s middle name',
        },
        last: {
          'ui:title': 'Veteran’s last name',
        },
        'view:serviceBranches': {
          'ui:required': () => true,
          'ui:options': {
            replaceSchema: form => {
              const properties = form?.toursOfDuty?.map(tour => ({
                type: 'boolean',
                title: `${tour?.serviceBranch} - (Between ${
                  tour?.dateRange?.from
                } and ${tour?.dateRange?.to})`,
              }));
              if (
                form?.['view:separationDocuments'] === true ||
                form?.['view:separationDocuments'] === undefined
              ) {
                // Trying to say if this thing ^^ is true OR if the form.toursOfDuty array is empty
                return {
                  type: 'object',
                  properties: {
                    serviceBranch: {
                      type: 'string',
                    },
                  },
                };
              }
              return {
                type: 'object',
                properties: { ...properties },
              };
            },
          },
          serviceBranch: {
            'ui:title': 'Branch of service',
            'ui:description': generateHelpText('You may list more than one'),
            'ui:required': () => true,
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      previousNames: {
        ...modifiedPreviousNames,
        minItems: 1,
      },
    },
  },
};

// export default {
//     uiSchema: {
//       'ui:title': generateDescription('Previous names'),
//       previousNames: {
//         'ui:options': {
//           // itemName: 'Name',
//           viewField: FullNameField,
//         },
//         items: {
//           'ui:options': {
//             classNames: 'vads-u-padding-left--1',
//           },
//           ...fullNameUI,
//           first: {
//             'ui:title': 'Previous first name',
//           },
//           middle: {
//             'ui:title': 'Previous middle name',
//           },
//           last: {
//             'ui:title': 'Previous last name',
//           },
//           'view:serviceBranches': {
//             'ui:options': {
//               replaceSchema: form => {
//                 const properties = form?.toursOfDuty?.map(tour => ({
//                   type: 'boolean',
//                   title: `${tour?.serviceBranch} - (Between ${
//                     tour?.dateRange?.from
//                   } and ${tour?.dateRange?.to})`,
//                 }));
//                 if (form?.['view:separationDocuments'] === true) {
//                   // Trying to say if this thing ^^ is true OR if the form.toursOfDuty array is empty
//                   return {
//                     type: 'object',
//                     properties: {
//                       serviceBranch: {
//                         type: 'string',
//                       },
//                     },
//                   };
//                 }
//                 return {
//                   type: 'object',
//                   properties: { ...properties },
//                 };
//               },
//             },
//             serviceBranch: {
//               'ui:title': 'Branch of service',
//               'ui:description': generateHelpText('You may list more than one'),
//               'ui:required': () => true,
//             },
//           },
//         },
//       },
//     },
//     schema: {
//       type: 'object',
//       properties: {
//         previousNames: {
//           ...modifiedPreviousNames,
//           minItems: 1,
//         },
//       },
//     },
//   };
