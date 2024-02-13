import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
// import { useSelector } from 'react-redux';
// import { createSelector } from 'reselect';
import {
  fullNameUI,
  // checkboxGroupUI,
  // checkboxGroupSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
// import get from '@department-of-veterans-affairs/platform-forms-system/get';
import FullNameField from '@department-of-veterans-affairs/platform-forms-system/FullNameField';
import { merge } from 'lodash';
import { generateTitle } from '../../../utils/helpers';
// import { generateHelpText, labelSize } from '../../../utils/helpers';

const { previousNames } = fullSchemaBurials.properties;

const modifiedPreviousNames = merge(previousNames, {
  items: {
    properties: {
      'view:serviceBranches': {
        type: 'object',
        properties: {
          serviceBranch: {
            type: 'string',
          },
        },
      },
    },
  },
});

export default {
  uiSchema: {
    previousNames: {
      'ui:title': generateTitle('Previous names'),
      'ui:options': {
        viewField: FullNameField,
      },
      items: {
        ...fullNameUI(),
        first: {
          'ui:title': 'Veteran’s first name',
        },
        middle: {
          'ui:title': 'Veteran’s middle name',
        },
        last: {
          'ui:title': 'Veteran’s last name',
        },
        // 'view:serviceBranches': createSelector(
        //   form => form['view:separationDocuments'],
        //   separationDocuments =>
        //     separationDocuments === true
        //       ? {
        //           serviceBranch: {
        //             'ui:title': 'Title',
        //             'ui:description': 'Description',
        //             'ui:options': {},
        //           },
        //         }
        //       : {
        //           serviceBranch: {
        //             ...checkboxGroupUI({
        //               title: 'Checkbox group',
        //               hint: 'This is a hint',
        //               required: false,
        //               description: 'Please select at least one option',
        //               labelHeaderLevel: '',
        //               tile: true,
        //               labels: {
        //                 hasA: 'Type A',
        //                 hasB: 'Type B',
        //               },
        //               errorMessages: {
        //                 required: 'Please select at least one option',
        //               },
        //             }),
        //           },
        //         },
        // ),
        // 'ui:options': {
        //   replaceSchema: form => {
        //     if (!form?.['view:separationDocuments']) {
        //       return {
        //         type: 'object',
        //         properties: {
        //           'view:serviceBranches': {
        //             type: 'object',
        //             properties: {
        //               serviceBranch: {
        //                 ...checkboxGroupSchema(['hasA', 'hasB']),
        //               },
        //             },
        //           },
        //         },
        //       };
        //     }
        //     return {
        //       type: 'object',
        //       properties: {
        //         'view:serviceBranches': {
        //           type: 'object',
        //           properties: {
        //             serviceBranch: {
        //               type: 'string',
        //             },
        //           },
        //         },
        //       },
        //     };
        //   },
        // },

        // 'view:serviceBranches': {
        //   'ui:required': () => true,
        //   'ui:options': {
        //     replaceSchema: form => {
        //       const properties = form?.toursOfDuty?.map(tour => ({
        //         type: 'boolean',
        //         title: `${tour?.serviceBranch} - (Between ${
        //           tour?.dateRange?.from
        //         } and ${tour?.dateRange?.to})`,
        //       }));
        //       if (
        //         form?.['view:separationDocuments'] === true ||
        //         form?.['view:separationDocuments'] === undefined
        //       ) {
        //         return {
        //           type: 'object',
        //           properties: {
        //             serviceBranch: {
        //               type: 'string',
        //             },
        //           },
        //         };
        //       }
        //       return {
        //         type: 'object',
        //         properties: {
        //           serviceBranch: {
        //             type: 'object',
        //             properties: { ...properties },
        //           },
        //         },
        //       };
        //     },
        //   },
        //   serviceBranch: {
        //     'ui:title': labelSize('Branch of service'),
        //     'ui:description': generateHelpText('You may list more than one'),
        //     'ui:required': () => true,
        //   },
        // },
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
