import React from 'react';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  addressUI,
  addressSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  textareaUI,
  textareaSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from 'platform/utilities/data/get';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import {
  MARRIAGE_FILTERED_STATES,
  STATE_NAMES,
  STATE_VALUES,
  COUNTRY_NAMES,
  COUNTRY_VALUES,
} from '../../../utils/labels';

/**
 * Pages for Veteran's previous marriages (array-builder)
 */

function introDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        Next we’ll ask you about the Veteran’s previous marriages. You may add
        up to 2 marriages.
      </p>
    </div>
  );
}
/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'previousMarriages',
  nounSingular: 'previous marriage',
  nounPlural: 'previous marriages',
  required: false,
  maxItems: 2,
  isItemIncomplete: item =>
    !item?.previousSpouseFirst ||
    !item?.previousSpouseLast ||
    !item?.marriageDate,
  text: {
    getItemName: item =>
      (item && item.previousSpouseLast && `${item.previousSpouseLast}`) ||
      'Previous marriage',
    cardDescription: () => '',
  },
};

const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Veteran’s previous marriages',
      nounSingular: options.nounSingular,
      nounPlural: options.nounPlural,
    }),
    'ui:description': introDescription,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:wasMarriedBefore': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Was the Veteran married to someone else before being married to you?',
        hint: '',
      },
      {
        title: 'Is there another previous marriage to add for the Veteran?',
        hint: '',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:wasMarriedBefore': arrayBuilderYesNoSchema,
    },
    required: ['view:wasMarriedBefore'],
  },
};

const namePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      "Veteran's previous spouse's name",
    ),
    previousSpouseFirst: textUI('First name'),
    previousSpouseMiddle: textUI('Middle name'),
    previousSpouseLast: textUI('Last name'),
    previousSpouseSuffix: textUI('Suffix'),
  },
  schema: {
    type: 'object',
    properties: {
      previousSpouseFirst: textSchema,
      previousSpouseMiddle: textSchema,
      previousSpouseLast: textSchema,
      previousSpouseSuffix: textSchema,
    },
    required: ['previousSpouseFirst', 'previousSpouseLast'],
  },
};

const marriageDatePlacePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'When and where did they get married?',
    ),
    marriageDate: currentOrPastDateUI('Date of marriage'),
    marriagePlace: {
      ...addressUI({
        labels: {
          militaryCheckbox: 'They got married outside the U.S.',
        },
      }),
      // Page-level override: when the user checks 'married outside the U.S.'
      // they are confirming the marriage place is a U.S. military base: (isMilitary === true)
      // State and Country are rendered in the same object select (using the filtered marriage state
      // values). When isMilitary is false we leave the default address
      // UI/schema unchanged. See addressPatterns.js for the base address UI/schema.
      city: {
        'ui:title': 'City',
        'ui:webComponentField': VaTextInputField,
        'ui:required': formData => !formData['view:marriagePlace'],
        'ui:options': {
          updateSchema: (formData, schema, _uiSchema, _index, path) => {
            const addressPath = Array.isArray(path) ? path.slice(0, -1) : [];
            const addressFormData = get(addressPath, formData) || {};
            const { isMilitary } = addressFormData;
            if (isMilitary) {
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:webComponentField'] = VaTextInputField;
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:errorMessages'] = {
                required: 'Please enter a city',
              };
            }
            return schema;
          },
        },
      },
      state: {
        'ui:webComponentField': VaSelectField,
        'ui:required': formData => !formData[MARRIAGE_FILTERED_STATES],
        'ui:options': {
          updateSchema: (formData, schema, _uiSchema, _index, path) => {
            const addressPath = Array.isArray(path) ? path.slice(0, -1) : [];
            const addressFormData = get(addressPath, formData) || {};
            const { isMilitary } = addressFormData;
            if (isMilitary) {
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:webComponentField'] = VaSelectField;
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:errorMessages'] = {
                required: 'Please select a country',
              };
              return {
                type: 'string',
                title: 'Country',
                enum: COUNTRY_VALUES,
                enumNames: COUNTRY_NAMES,
              };
            }

            if (!isMilitary) {
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:webComponentField'] = VaSelectField;
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:errorMessages'] = {
                required: 'Please select a state',
              };
              return {
                type: 'string',
                title: 'State',
                enum: STATE_VALUES,
                enumNames: STATE_NAMES,
              };
            }

            return { schema, required: ['marriagePlace'] };
          },
          hideEmptyValueInReview: true,
        },
        'ui:errorMessages': { required: 'Please select a state' },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriagePlace'],
    properties: {
      marriageDate: currentOrPastDateSchema,
      marriagePlace: {
        type: 'object',
        properties: {
          ...addressSchema({
            labels: {
              militaryCheckbox: 'They got married outside the U.S.',
            },
            omit: ['street', 'street2', 'street3', 'postalCode', 'country'],
          }).properties,
        },
      },
    },
  },
};

const endedPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('How did the marriage end?'),
    marriageEndedBy: radioUI({
      title: 'How did the marriage end?',
      labels: { DEATH: 'Death', DIVORCE: 'Divorce', OTHER: 'Other' },
    }),
    marriageEndedOther: textareaUI({
      title: 'Tell us how the marriage ended',
      expandUnder: 'marriageEndedBy',
      expandUnderCondition: field => field === 'OTHER',
      required: formData => formData?.marriageEndedBy === 'OTHER',
      errorMessages: { required: 'Please tell us how the marriage ended' },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      marriageEndedBy: radioSchema(['DEATH', 'DIVORCE', 'OTHER']),
      marriageEndedOther: textareaSchema,
    },
    required: ['marriageEndedBy'],
  },
};

const marriageEndDateLocationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'When and where did their marriage end?',
    ),
    dateOfTermination: currentOrPastDateUI('Date marriage ended'),
    marriageEndLocation: {
      ...addressUI({
        labels: {
          militaryCheckbox: 'Their marriage ended outside the U.S.',
        },
      }),
      city: {
        'ui:title': 'City',
        'ui:webComponentField': VaTextInputField,
        'ui:required': formData => !formData['view:marriageEndLocation'],
        'ui:errorMessages': {
          required: 'Please enter the city where the marriage ended',
        },
        'ui:options': {
          updateSchema: (formData, schema, _uiSchema, _index, path) => {
            const addressPath = Array.isArray(path) ? path.slice(0, -1) : [];
            const addressFormData = get(addressPath, formData) || {};
            const { isMilitary } = addressFormData;
            if (isMilitary) {
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:webComponentField'] = VaTextInputField;
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:errorMessages'] = {
                required: 'Please enter a city',
              };
            }
            return schema;
          },
        },
      },
      state: {
        'ui:webComponentField': VaSelectField,
        'ui:required': formData => !formData[MARRIAGE_FILTERED_STATES],
        'ui:options': {
          updateSchema: (formData, schema, _uiSchema, _index, path) => {
            const addressPath = Array.isArray(path) ? path.slice(0, -1) : [];
            const addressFormData = get(addressPath, formData) || {};
            const { isMilitary } = addressFormData;
            if (isMilitary) {
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:webComponentField'] = VaSelectField;
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:errorMessages'] = {
                required: 'Please select a country',
              };
              return {
                type: 'string',
                title: 'Country',
                enum: COUNTRY_VALUES,
                enumNames: COUNTRY_NAMES,
              };
            }

            if (!isMilitary) {
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:webComponentField'] = VaSelectField;
              // eslint-disable-next-line no-param-reassign
              _uiSchema['ui:errorMessages'] = {
                required: 'Please select a state',
              };
              return {
                type: 'string',
                title: 'State',
                enum: STATE_VALUES,
                enumNames: STATE_NAMES,
              };
            }
            return { schema, required: ['marriageEndLocation'] };
          },
          hideEmptyValueInReview: true,
        },
        'ui:errorMessages': {
          required: 'Please select a state',
        },
      },
      country: {},
    },
  },
  schema: {
    type: 'object',
    required: ['dateOfTermination', 'marriageEndLocation'],
    properties: {
      dateOfTermination: currentOrPastDateSchema,
      marriageEndLocation: {
        type: 'object',
        properties: {
          ...addressSchema({
            labels: {
              militaryCheckbox: 'Their marriage ended outside the U.S.',
            },
            omit: ['street', 'street2', 'street3', 'postalCode', 'country'],
          }).properties,
        },
      },
    },
  },
};

export const veteranMarriagesPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    veteranMarriagesIntro: pageBuilder.introPage({
      title: 'Veteran’s previous marriages',
      path: 'household/veteran-previous-marriages',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    veteranMarriagesSummary: pageBuilder.summaryPage({
      title:
        'Was the Veteran married to someone else before being married to you?',
      path: 'household/veteran-previous-marriages/add',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    veteranPreviousSpouseName: pageBuilder.itemPage({
      title: "Veteran's previous spouse's name",
      path: 'household/veteran-previous-marriages/:index/spouse-name',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
    veteranMarriageDatePlace: pageBuilder.itemPage({
      title: 'When and where did they get married?',
      path: 'household/veteran-previous-marriages/:index/marriage-date-place',
      uiSchema: marriageDatePlacePage.uiSchema,
      schema: marriageDatePlacePage.schema,
    }),
    veteranMarriageEnded: pageBuilder.itemPage({
      title: 'How did the marriage end?',
      path: 'household/veteran-previous-marriages/:index/marriage-ended',
      uiSchema: endedPage.uiSchema,
      schema: endedPage.schema,
    }),
    veteranMarriageEndDateLocation: pageBuilder.itemPage({
      title: 'When and where did their marriage end?',
      path:
        'household/veteran-previous-marriages/:index/marriage-end-date-location',
      uiSchema: marriageEndDateLocationPage.uiSchema,
      schema: marriageEndDateLocationPage.schema,
    }),
  }),
);

export default veteranMarriagesPages;
