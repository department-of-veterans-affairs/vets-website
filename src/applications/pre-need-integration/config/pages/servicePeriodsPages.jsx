import {
  arrayBuilderItemFirstPageTitleUI,
  // arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  // currentOrPastDateSchema,
  // currentOrPastDateUI,
  // textUI,
  // textSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { serviceLabels } from '../../utils/labels';
// import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
// import { serviceRecordsUI } from '../../utils/helpers';
// const { veteran } = fullSchemaPreNeed.properties.application.properties;

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'servicePeriods',
  nounSingular: 'service period',
  nounPlural: 'service periods',
  required: true,
  isItemIncomplete: item => !item?.application?.veteran?.serviceBranch, // include all required fields here
  maxItems: 3,
  text: {
    getItemName: item => {
      return item?.application?.veteran?.serviceBranch
        ? serviceLabels[item.application.veteran.serviceBranch]
        : null;
    },
    cardDescription: item => {
      const dateRangeFrom = item?.application?.veteran?.dateRange?.from;
      const dateRangeTo = item?.application?.veteran?.dateRange?.to;

      let range = '';

      if (dateRangeFrom) {
        range += formatReviewDate(dateRangeFrom);
      }

      if (dateRangeFrom && dateRangeTo) {
        range += ' - ';
      }

      if (dateRangeTo) {
        range += formatReviewDate(dateRangeTo);
      }

      return range;
    },
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Your ${options.nounPlural}`,
      `In the next few questions, we’ll ask you about your ${
        options.nounPlural
      }. You must add at least one ${
        options.nounSingular
      }. You may add up to 3 ${options.nounPlural}.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasServicePeriods': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasServicePeriods': arrayBuilderYesNoSchema,
    },
    required: ['view:hasServicePeriods'],
  },
};

/** @returns {PageSchema} */
const servicePeriodInformationPage = {
  // uiSchema: {
  //   ...arrayBuilderItemFirstPageTitleUI({
  //     title: 'Name',
  //     nounSingular: options.nounSingular,
  //   }),
  //   name: textUI('Name'),
  // },
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name',
      servicePeriod: options.servicePeriod,
    }),
    application: {
      veteran: {
        'ui:order': [
          'serviceBranch',
          'highestRank',
          'dateRange',
          'dischargeType',
          'nationalGuardState',
        ],
        serviceBranch: autosuggest.uiSchema('Branch of service', null, {
          'ui:options': {
            labels: serviceLabels,
          },
        }),
        dateRange: dateRangeUI(
          'Service start date',
          'Service end date',
          'Service start date must be after end date',
        ),
        dischargeType: {
          'ui:title': 'Discharge character of service',
          'ui:options': {
            labels: {
              1: 'Honorable',
              2: 'General',
              3: 'Entry Level Separation/Uncharacterized',
              4: 'Other Than Honorable',
              5: 'Bad Conduct',
              6: 'Dishonorable',
              7: 'Other',
            },
          },
        },
        highestRank: {
          'ui:title': 'Highest rank attained',
        },
        nationalGuardState: {
          'ui:title': 'State (for National Guard Service only)',
          // 'ui:options': {
          //   hideIf: (formData, index) =>
          //     !['AG', 'NG'].includes(
          //       formData.application.veteran.serviceRecords[index].serviceBranch,
          //     ),
          // },
        },
      },
    },
  },
  // uiSchema: {
  //   application: {
  //     veteran: {
  //       serviceRecords: serviceRecordsUI,
  //     },
  //     'ui:options': {
  //       customTitle: ' ',
  //     },
  //   },
  // },
  // schema: {
  //   type: 'object',
  //   properties: {
  //     name: textSchema,
  //   },
  //   required: ['name'],
  // },
  schema: {
    type: 'object',
    properties: {
      application: {
        type: 'object',
        properties: {
          veteran: {
            type: 'object',
            properties: {
              dateRange: {
                type: 'object',
                properties: {
                  from: {
                    type: 'string',
                    format: 'date',
                  },
                  to: {
                    type: 'string',
                    format: 'date',
                  },
                },
              },
              serviceBranch: {
                type: 'string',
                enum: [
                  'AL',
                  'FS',
                  'FT',
                  'ES',
                  'CM',
                  'C3',
                  'C2',
                  'C4',
                  'C7',
                  'C5',
                  'GS',
                  'CI',
                  'FP',
                  'CS',
                  'CV',
                  'XG',
                  'CB',
                  'FF',
                  'GP',
                  'MO',
                  'NO',
                  'NN',
                  'NM',
                  'PA',
                  'PG',
                  'KC',
                  'PS',
                  'RO',
                  'CF',
                  'CE',
                  'AF',
                  'XF',
                  'AG',
                  'AR',
                  'AC',
                  'AA',
                  'AT',
                  'NG',
                  'XR',
                  'CO',
                  'CA',
                  'CC',
                  'GC',
                  'CG',
                  'XC',
                  'MC',
                  'MM',
                  'NA',
                  'XA',
                  'CD',
                  'PH',
                  'GU',
                  'WP',
                  'WA',
                  'WS',
                  'WR',
                ],
              },
              dischargeType: {
                type: 'string',
                enum: ['1', '2', '3', '4', '5', '6', '7'],
              },
              highestRank: {
                type: 'string',
                maxLength: 20,
              },
              nationalGuardState: {
                type: 'string',
                maxLength: 3,
                enum: [
                  'AL',
                  'AK',
                  'AZ',
                  'AR',
                  'CA',
                  'CO',
                  'CT',
                  'DE',
                  'DC',
                  'FL',
                  'GA',
                  'GU',
                  'HI',
                  'ID',
                  'IL',
                  'IN',
                  'IA',
                  'KS',
                  'KY',
                  'LA',
                  'ME',
                  'MD',
                  'MA',
                  'MI',
                  'MN',
                  'MS',
                  'MO',
                  'MT',
                  'NE',
                  'NV',
                  'NH',
                  'NJ',
                  'NM',
                  'NY',
                  'NC',
                  'ND',
                  'OH',
                  'OK',
                  'OR',
                  'PA',
                  'PR',
                  'RI',
                  'SC',
                  'SD',
                  'TN',
                  'TX',
                  'UT',
                  'VT',
                  'VI',
                  'VA',
                  'WA',
                  'WV',
                  'WI',
                  'WY',
                ],
                enumNames: [
                  'Alabama',
                  'Alaska',
                  'Arizona',
                  'Arkansas',
                  'California',
                  'Colorado',
                  'Connecticut',
                  'Delaware',
                  'District Of Columbia',
                  'Florida',
                  'Georgia',
                  'Guam',
                  'Hawaii',
                  'Idaho',
                  'Illinois',
                  'Indiana',
                  'Iowa',
                  'Kansas',
                  'Kentucky',
                  'Louisiana',
                  'Maine',
                  'Maryland',
                  'Massachusetts',
                  'Michigan',
                  'Minnesota',
                  'Mississippi',
                  'Missouri',
                  'Montana',
                  'Nebraska',
                  'Nevada',
                  'New Hampshire',
                  'New Jersey',
                  'New Mexico',
                  'New York',
                  'North Carolina',
                  'North Dakota',
                  'Ohio',
                  'Oklahoma',
                  'Oregon',
                  'Pennsylvania',
                  'Puerto Rico',
                  'Rhode Island',
                  'South Carolina',
                  'South Dakota',
                  'Tennessee',
                  'Texas',
                  'Utah',
                  'Vermont',
                  'Virgin Islands',
                  'Virginia',
                  'Washington',
                  'West Virginia',
                  'Wisconsin',
                  'Wyoming',
                ],
              },
            },
            required: ['serviceBranch'],
          },
        },
      },
    },
  },
  // schema: {
  //   type: 'object',
  //   properties: {
  //     application: {
  //       type: 'object',
  //       properties: {
  //         veteran: {
  //           type: 'object',
  //           properties: {
  //             serviceRecords: veteran.properties.serviceRecords,
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
};

// /** @returns {PageSchema} */
// const datePage = {
//   uiSchema: {
//     ...arrayBuilderItemSubsequentPageTitleUI(
//       ({ formData }) => (formData?.name ? `Date at ${formData.name}` : 'Date'),
//     ),
//     date: currentOrPastDateUI(),
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       date: currentOrPastDateSchema,
//     },
//     required: ['date'],
//   },
// };

export const servicePeriodsPages = arrayBuilderPages(options, pageBuilder => ({
  servicePeriods: pageBuilder.introPage({
    title: 'Service periods',
    path: 'service-periods',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  servicePeriodsSummary: pageBuilder.summaryPage({
    title: 'Review your service periods',
    path: 'service-periods-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  servicePeriodInformationPage: pageBuilder.itemPage({
    title: 'Service period',
    path: 'service-periods/:index/service period',
    uiSchema: servicePeriodInformationPage.uiSchema,
    schema: servicePeriodInformationPage.schema,
    // depends: isVeteran,
  }),
}));
