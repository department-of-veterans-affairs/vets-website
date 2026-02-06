/* eslint-disable no-unused-vars */
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  titleUI,
  currentOrPastDateRangeUI,
  numberUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import AutosuggestField from '../components/AutosuggestFieldV3';
import { serviceLabels } from '../utils/labels';
import {
  isVeteran,
  isAuthorizedAgent,
  hasServiceRecord,
  validateMilitaryHistory,
  requestRecordsLink,
} from '../utils/helpers';

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
    ? 'Veteran service period(s)'
    : 'Review service period records';
}

export function handleDepends(formData) {
  return !isVeteran(formData) && !isAuthorizedAgent(formData);
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
      'Veteran service period(s)',
      'The next few questions are about the Veteran’s service periods. You must add at least 1 service period. If you don’t know the Veteran’s service periods, you can request their military service records.',
    ),
    'ui:description': requestRecordsLink,
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
export function servicePeriodInformationPage() {
  return {
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'Veteran service period(s)',
        nounSingular: 'service period',
        servicePeriod: options.servicePeriod,
        hasMultipleItemPages: false,
      }),
      'ui:order': [
        'serviceBranch',
        'militaryServiceNumber',
        'dateRange',
        'nationalGuardState',
      ],
      'ui:validations': [validateMilitaryHistory],
      'ui:options': {
        useAllFormData: true,
      },
      serviceBranch: {
        'ui:field': AutosuggestField,
        'ui:title': 'Branch of service',
        'ui:options': {
          getOptions: inputValue => {
            if (!inputValue) return [];

            const searchTerm = inputValue.toLowerCase();

            // If inputValue looks like a key (short, uppercase-ish), try exact key match first
            if (inputValue.length <= 3 && /^[A-Z0-9]+$/i.test(inputValue)) {
              const exactMatch = Object.entries(serviceLabels).find(
                ([key]) => key.toLowerCase() === searchTerm,
              );
              if (exactMatch) {
                return [
                  {
                    id: exactMatch[0],
                    label: exactMatch[1],
                    value: exactMatch[0],
                  },
                ];
              }
            }

            // If no exact key match or input is longer, do label search
            if (inputValue.length < 2) return [];

            return Object.entries(serviceLabels)
              .filter(
                ([key, label]) =>
                  label.toLowerCase().includes(searchTerm) ||
                  key.toLowerCase().includes(searchTerm),
              )
              .map(([key, label]) => ({
                id: key,
                label,
                value: key,
              }))
              .slice(0, 10); // Limit to 10 results
          },
        },
      },
      militaryServiceNumber: numberUI({
        title: 'Military service number',
      }),
      dateRange: currentOrPastDateRangeUI(
        {
          title: 'Service start date',
          required: () => false,
        },
        {
          title: 'Service end date',
          required: () => false,
        },
        'The service end date must be after the service start date.', // Range error message
      ),
      nationalGuardState: {
        'ui:title': 'State (for National Guard Service only)',
        'ui:webComponentField': VaSelectField,
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
          classNames: 'selectNonImposter',
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
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
        militaryServiceNumber: {
          type: 'string',
          minLength: 4,
          maxLength: 9,
          pattern: '^\\d*$',
        },
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

// This is needed to create a configuration object for the service period information page
const servicePeriodInformationPageConfig = servicePeriodInformationPage();

export const servicePeriodsPages = arrayBuilderPages(options, pageBuilder => ({
  servicePeriods: pageBuilder.introPage({
    title: 'Service periods',
    path: 'service-periods',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
    depends: formData => handleDepends(formData),
  }),
  servicePeriodsSummary: pageBuilder.summaryPage({
    title: 'Veteran service period(s) summary',
    path: 'service-periods-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    depends: formData => handleDepends(formData),
  }),
  servicePeriodInformationPage: pageBuilder.itemPage({
    title: 'Service period information',
    path: 'service-periods/:index/service-period',
    uiSchema: servicePeriodInformationPageConfig.uiSchema,
    schema: servicePeriodInformationPageConfig.schema,
    depends: formData => handleDepends(formData),
  }),
}));
