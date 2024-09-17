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
import { isVeteran } from '../../utils/helpers';
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
    cancelAddNo: () => {
      return 'No, keep this';
    },
    deleteTitle: item => {
      const servicePeriodName = item?.name;

      return `Are you sure want to remove this ${servicePeriodName} service period?`;
    },
    deleteDescription: () => {
      return 'If you remove this service period, we’ll take you to a screen where you can add another service period. You’ll need to list at least one service period for us to process this form.';
    },
    deleteYes: () => {
      return 'Yes, remove this';
    },
    deleteNo: () => {
      return 'No, keep this';
    },
    cancelEditTitle: item => {
      const servicePeriodName = item?.name;

      return `Cancel editing ${servicePeriodName} service period?`;
    },
    cancelEditDescription: () => {
      return 'If you cancel, you’ll lose any changes you made on this screen and you will be returned to the service periods review page.';
    },
    cancelEditYes: () => {
      return 'Yes, remove this';
    },
    cancelEditNo: () => {
      return 'No, keep this';
    },
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'Service Period(s)',
      'In the next few questions, we’ll ask you about service periods. You must add at least one branch of service. You can add up to 3 service periods.',
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
function servicePeriodInformationPage(isVet) {
  return {
    // uiSchema: {
    //   ...arrayBuilderItemFirstPageTitleUI({
    //     title: 'Name',
    //     nounSingular: options.nounSingular,
    //   }),
    //   name: textUI('Name'),
    // },
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: isVet
          ? 'Your service period(s)'
          : 'Sponsor’s service periods(s)',
        servicePeriod: options.servicePeriod,
      }),
      application: {
        veteran: {
          'ui:order': [
            'serviceBranch',
            'dateRange',
            'dischargeType',
            'highestRank',
            'nationalGuardState',
          ],
          serviceBranch: autosuggest.uiSchema(
            isVet ? 'Branch of service' : 'Sponsor’s branch of service',
            null,
            {
              'ui:options': {
                labels: serviceLabels,
              },
            },
          ),
          dateRange: dateRangeUI(
            isVet ? 'Service start date' : 'Sponsor’s service start date',
            isVet ? 'Service end date' : 'Sponsor’s service end date',
            'Service start date must be after end date',
          ),
          dischargeType: {
            'ui:title': isVet
              ? 'Discharge character of service'
              : 'Sponsor’s discharge character of service',
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
            'ui:title': isVet
              ? 'Highest rank attained'
              : 'Sponsor’s highest rank attained',
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
}

const servicePeriodInformationPageVeteran = servicePeriodInformationPage(true);

const servicePeriodInformationPageNonVeteran = servicePeriodInformationPage(
  false,
);

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

export const servicePeriodsPagesVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    servicePeriodsVeteran: pageBuilder.introPage({
      title: 'Service periods',
      path: 'service-periods-veteran',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => isVeteran(formData),
    }),
    servicePeriodsSummaryVeteran: pageBuilder.summaryPage({
      title: 'Your service period(s)',
      path: 'service-periods-summary-veteran',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: formData => isVeteran(formData),
    }),
    servicePeriodInformationPageVeteran: pageBuilder.itemPage({
      title: 'Service period',
      path: 'service-periods-veteran/:index/service-period',
      uiSchema: servicePeriodInformationPageVeteran.uiSchema,
      schema: servicePeriodInformationPageVeteran.schema,
      depends: formData => isVeteran(formData),
    }),
  }),
);

export const servicePeriodsPagesNonVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    servicePeriodsNonVeteran: pageBuilder.introPage({
      title: 'Service periods',
      path: 'service-periods-nonveteran',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => !isVeteran(formData),
    }),
    servicePeriodsSummaryNonVeteran: pageBuilder.summaryPage({
      title: 'Sponsor’s service period(s)',
      path: 'service-periods-summary-nonveteran',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: formData => !isVeteran(formData),
    }),
    servicePeriodInformationPageNonVeteran: pageBuilder.itemPage({
      title: 'Service period',
      path: 'service-periods-nonveteran/:index/service-period',
      uiSchema: servicePeriodInformationPageNonVeteran.uiSchema,
      schema: servicePeriodInformationPageNonVeteran.schema,
      depends: formData => !isVeteran(formData),
    }),
  }),
);
