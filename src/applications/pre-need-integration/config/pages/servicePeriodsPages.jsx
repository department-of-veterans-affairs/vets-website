import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { serviceLabels } from '../../utils/labels';
import {
  isVeteran,
  isAuthorizedAgent,
  hasServiceRecord,
  validateMilitaryHistory,
} from '../../utils/helpers';
import rankEnums from '../../utils/rankEnums';
import { rankLabels } from '../../utils/rankLabels';

export function handleGetItemName(item) {
  return item?.serviceBranch ? serviceLabels[item.serviceBranch] : null;
}

export function handleAlertMaxItems() {
  return 'You have added the maximum number of allowed service periods for this application. You may edit or delete a service period or choose to continue the application.';
}

export function handleCardDescription(item) {
  const dateRangeFrom = item?.dateRange?.from;
  const dateRangeTo = item?.dateRange?.to;

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
}

export function handleCancelAddTitle(props) {
  const servicePeriodName = props.getItemName(props.itemData);

  if (servicePeriodName === null) {
    return `Cancel adding this service period`;
  }
  return `Cancel adding ${servicePeriodName} service period`;
}

export function handleCancelAddNo() {
  return 'No, keep this';
}

export function handleDeleteTitle(props) {
  const servicePeriodName = props.getItemName(props.itemData);

  return `Are you sure you want to remove this ${servicePeriodName} service period?`;
}

export function handleDeleteDescription(props) {
  const servicePeriodName = props.getItemName(props.itemData);

  return `This will remove ${servicePeriodName} and all the information from the service period records.`;
}

export function handleDeleteNeedAtLeastOneDescription() {
  return 'If you remove this service period, we’ll take you to a screen where you can add another service period. You’ll need to list at least one service period for us to process this form.';
}

export function handleDeleteYes() {
  return 'Yes, remove this';
}

export function handleDeleteNo() {
  return 'No, keep this';
}

export function handleCancelEditTitle(props) {
  const servicePeriodName = props.getItemName(props.itemData);

  return `Cancel editing ${servicePeriodName} service period?`;
}

export function handleCancelEditDescription() {
  return 'If you cancel, you’ll lose any changes you made on this screen and you will be returned to the service periods review page.';
}

export function handleCancelEditYes() {
  return 'Yes, cancel';
}

export function handleCancelEditNo() {
  return 'No, keep this';
}

export function handleSummaryTitle(formData) {
  return hasServiceRecord(formData)
    ? 'Veteran’s service period(s)'
    : 'Review service period records';
}

export function handleVeteranDepends(formData) {
  return isVeteran(formData) && !isAuthorizedAgent(formData);
}

export function handlePreparerVeteranDepends(formData) {
  return isVeteran(formData) && isAuthorizedAgent(formData);
}

export function handleNonVeteranDepends(formData) {
  return !isVeteran(formData) && !isAuthorizedAgent(formData);
}

export function handlePreparerNonVeteranDepends(formData) {
  return !isVeteran(formData) && isAuthorizedAgent(formData);
}

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'serviceRecords',
  nounSingular: 'service period',
  nounPlural: 'service periods',
  required: true,
  isItemIncomplete: item => !item?.serviceBranch, // include all required fields here
  maxItems: 3,
  text: {
    getItemName: handleGetItemName,
    alertMaxItems: handleAlertMaxItems,
    cardDescription: handleCardDescription,
    cancelAddTitle: handleCancelAddTitle,
    cancelAddNo: handleCancelAddNo,
    deleteTitle: handleDeleteTitle,
    deleteDescription: handleDeleteDescription,
    deleteNeedAtLeastOneDescription: handleDeleteNeedAtLeastOneDescription,
    deleteYes: handleDeleteYes,
    deleteNo: handleDeleteNo,
    cancelEditTitle: handleCancelEditTitle,
    cancelEditDescription: handleCancelEditDescription,
    cancelEditYes: handleCancelEditYes,
    cancelEditNo: handleCancelEditNo,
    summaryTitle: handleSummaryTitle,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'Service period(s)',
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

function handleTitle(isVet, isPrep, vetTitle, sponsorTitle, prepTitle) {
  if (isVet) {
    if (isPrep) {
      return prepTitle;
    }
    return vetTitle;
  }
  return sponsorTitle;
}

/** @returns {PageSchema} */
export function servicePeriodInformationPage(isVet, isPrep) {
  return {
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: handleTitle(
          isVet,
          isPrep,
          'Your service period(s)',
          'Sponsor’s service periods(s)',
          'Applicant’s service period(s)',
        ),
        nounSingular: 'service period',
        servicePeriod: options.servicePeriod,
        hasMultipleItemPages: false,
      }),
      'ui:order': [
        'serviceBranch',
        'dateRange',
        'highestRank',
        'dischargeType',
        'nationalGuardState',
      ],
      'ui:validations': [validateMilitaryHistory],
      'ui:options': {
        useAllFormData: true,
      },
      serviceBranch: autosuggest.uiSchema(
        handleTitle(
          isVet,
          isPrep,
          'Branch of service',
          'Sponsor’s branch of service',
          'Applicant’s branch of service',
        ),
        null,
        {
          'ui:options': {
            labels: serviceLabels,
          },
        },
      ),
      dateRange: dateRangeUI(
        handleTitle(
          isVet,
          isPrep,
          'Service start date',
          'Sponsor’s service start date',
          'Applicant’s service start date',
        ),
        handleTitle(
          isVet,
          isPrep,
          'Service end date',
          'Sponsor’s service end date',
          'Applicant’s service end date',
        ),
      ),
      dischargeType: {
        'ui:title': handleTitle(
          isVet,
          isPrep,
          'Discharge character of service',
          'Sponsor’s discharge character of service',
          'Applicant’s discharge character of service',
        ),
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
      highestRank: autosuggest.uiSchema('Highest rank attained', null, {
        'ui:options': {
          labels: rankLabels,
          hint:
            'This field may clear if the branch of service or service start and end dates are updated.',
        },
      }),
      nationalGuardState: {
        'ui:title': 'State (for National Guard Service only)',
        'ui:options': {
          hideIf: (formData, index) => {
            if (
              index !== null &&
              typeof formData?.serviceRecords !== 'undefined'
            ) {
              return !['AG', 'NG'].includes(
                formData?.serviceRecords[index]?.serviceBranch,
              );
            }
            return !['AG', 'NG'].includes(formData?.serviceBranch);
          },
        },
      },
    },
    schema: {
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
            'AD',
            'AS',
            'AV',
            'CW',
            'DT',
            'FC',
            'IR',
            'NC',
            'O1',
            'O2',
            'O3',
            'O4',
            'O5',
            'O6',
            'OA',
            'OB',
            'OC',
            'OD',
            'OE',
            'OF',
            'OH',
            'OI',
            'OJ',
            'OK',
            'OL',
            'ON',
            'OP',
            'OR',
            'OT',
            'OU',
            'OV',
            'OW',
            'OX',
            'OY',
            'OZ',
            'QC',
            'RA',
            'RR',
            'SA',
            'SF',
            'SP',
            'UT',
          ],
        },
        dischargeType: {
          type: 'string',
          enum: ['1', '2', '3', '4', '5', '6', '7'],
        },
        highestRank: {
          type: 'string',
          enum: rankEnums,
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
  };
}

const servicePeriodInformationPageVeteran = servicePeriodInformationPage(
  true,
  false,
);

const servicePeriodInformationPagePreparerVeteran = servicePeriodInformationPage(
  true,
  true,
);

const servicePeriodInformationPageNonVeteran = servicePeriodInformationPage(
  false,
  false,
);

const servicePeriodInformationPagePreparerNonVeteran = servicePeriodInformationPage(
  false,
  true,
);

export const servicePeriodsPagesVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    servicePeriodsVeteran: pageBuilder.introPage({
      title: 'Service periods',
      path: 'service-periods-veteran',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => handleVeteranDepends(formData),
    }),
    servicePeriodsSummaryVeteran: pageBuilder.summaryPage({
      title: 'Your service period(s)',
      path: 'service-periods-summary-veteran',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: formData => handleVeteranDepends(formData),
    }),
    servicePeriodInformationPageVeteran: pageBuilder.itemPage({
      title: 'Service period',
      path: 'service-periods-veteran/:index/service-period',
      uiSchema: servicePeriodInformationPageVeteran.uiSchema,
      schema: servicePeriodInformationPageVeteran.schema,
      depends: formData => handleVeteranDepends(formData),
    }),
  }),
);

export const servicePeriodsPagesPreparerVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    servicePeriodsPreparerVeteran: pageBuilder.introPage({
      title: 'Service periods',
      path: 'service-periods-preparer-veteran',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => handlePreparerVeteranDepends(formData),
    }),
    servicePeriodsSummaryPreparerVeteran: pageBuilder.summaryPage({
      title: 'Applicant’s service period(s)',
      path: 'service-periods-summary-preparer-veteran',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: formData => handlePreparerVeteranDepends(formData),
    }),
    servicePeriodInformationPagePreparerVeteran: pageBuilder.itemPage({
      title: 'Service period',
      path: 'service-periods-preparer-veteran/:index/service-period',
      uiSchema: servicePeriodInformationPagePreparerVeteran.uiSchema,
      schema: servicePeriodInformationPagePreparerVeteran.schema,
      depends: formData => handlePreparerVeteranDepends(formData),
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
      depends: formData => handleNonVeteranDepends(formData),
    }),
    servicePeriodsSummaryNonVeteran: pageBuilder.summaryPage({
      title: 'Sponsor’s service period(s)',
      path: 'service-periods-summary-nonveteran',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: formData => handleNonVeteranDepends(formData),
    }),
    servicePeriodInformationPageNonVeteran: pageBuilder.itemPage({
      title: 'Service period',
      path: 'service-periods-nonveteran/:index/service-period',
      uiSchema: servicePeriodInformationPageNonVeteran.uiSchema,
      schema: servicePeriodInformationPageNonVeteran.schema,
      depends: formData => handleNonVeteranDepends(formData),
    }),
  }),
);

export const servicePeriodsPagesPreparerNonVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    servicePeriodsPreparerNonVeteran: pageBuilder.introPage({
      title: 'Service periods',
      path: 'service-periods-preparer-nonveteran',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => handlePreparerNonVeteranDepends(formData),
    }),
    servicePeriodsSummaryPreparerNonVeteran: pageBuilder.summaryPage({
      title: 'Applicant’s service period(s)',
      path: 'service-periods-summary-preparer-nonveteran',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: formData => handlePreparerNonVeteranDepends(formData),
    }),
    servicePeriodInformationPagePreparerNonVeteran: pageBuilder.itemPage({
      title: 'Service period',
      path: 'service-periods-preparer-nonveteran/:index/service-period',
      uiSchema: servicePeriodInformationPagePreparerNonVeteran.uiSchema,
      schema: servicePeriodInformationPagePreparerNonVeteran.schema,
      depends: formData => handlePreparerNonVeteranDepends(formData),
    }),
  }),
);
