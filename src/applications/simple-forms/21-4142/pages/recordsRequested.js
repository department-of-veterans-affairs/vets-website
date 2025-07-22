import React from 'react';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import environment from 'platform/utilities/environment';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import {
  titleUI,
  textUI,
  textSchema,
  textareaUI,
  textareaSchema,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms-system/src/js/utilities/validations';
import {
  patientIdentificationFields,
  providerFacilityFields,
} from '../definitions/constants';

import RecordField from '../components/RecordField';

/**
 * For production environments, use the original UI implementation
 */
const originalImplementation = {
  uiSchema: {
    'ui:description': (
      <div className="vads-u-margin-bottom--2">
        Let us know where the person you’re requesting medical records for
        received treatment. You may add up to 5 medical record or information
        requests.
      </div>
    ),
    'ui:options': {
      updateSchema: formData => {
        let patientId = 'patient';
        if (
          formData[patientIdentificationFields.parentObject][
            patientIdentificationFields.isRequestingOwnMedicalRecords
          ]
        )
          patientId = 'Veteran';
        const title = (
          <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
            Tell us where the {patientId} received treatment
          </h3>
        );
        return { title };
      },
    },
    [providerFacilityFields.parentObject]: {
      'ui:options': {
        itemName: 'Treatment record',
        viewField: RecordField,
        keepInPageOnReview: true,
        useDlWrap: true,
        customTitle: ' ',
        confirmRemove: true,
        confirmRemoveDescription:
          'This will remove the facility and all of the treatment records associated from your authorization request.',
        itemAriaLabel: formData =>
          `${formData[providerFacilityFields.providerFacilityName]}` ||
          'facility',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        'ui:order': [
          providerFacilityFields.providerFacilityName,
          providerFacilityFields.providerFacilityAddress,
          providerFacilityFields.conditionsTreated,
          providerFacilityFields.treatmentDateRange,
        ],
        [providerFacilityFields.providerFacilityName]: {
          'ui:title': 'Name of private provider or hospital',
          'ui:required': () => true,
          'ui:errorMessages': {
            required:
              'Please provide the name of the private provider or hospital',
          },
        },
        [providerFacilityFields.providerFacilityAddress]: address.uiSchema(
          null,
          false,
          () => true,
        ),
        [providerFacilityFields.conditionsTreated]: {
          'ui:title':
            'List the conditions the person received treatment for at this facility',
          'ui:widget': 'textarea',
          'ui:required': () => true,
          'ui:errorMessages': {
            required: 'Please list at least one condition',
            maxLength: 'Please limit your answer to no more than 75 characters',
          },
          'ui:options': {
            updateSchema: () => ({
              type: 'string',
              maxLength: 75,
            }),
          },
        },
        [providerFacilityFields.treatmentDateRange]: {
          from: {
            ...dateUI('First treatment date (you can estimate)'),
            'ui:errorMessages': {
              required:
                'Select a month and day. And enter a valid 4-digit year.',
              pattern:
                'Select a month and day. And enter a valid 4-digit year.',
            },
          },
          to: {
            ...dateUI('Last treatment date (you can estimate)'),
            'ui:errorMessages': {
              required:
                'Select a month and day. And enter a valid 4-digit year.',
              pattern:
                'Select a month and day. And enter a valid 4-digit year.',
            },
          },
        },
        'ui:validations': [
          (errors, field) => {
            const treatmentDateFrom =
              field[providerFacilityFields.treatmentDateRange].from;
            const treatmentDateTo =
              field[providerFacilityFields.treatmentDateRange].to;
            const fromDate = convertToDateField(treatmentDateFrom);
            const toDate = convertToDateField(treatmentDateTo);

            if (!isValidDateRange(fromDate, toDate, true)) {
              errors[providerFacilityFields.treatmentDateRange].to.addError(
                'The end date must be after the start date',
              );
            }
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [providerFacilityFields.parentObject]: {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
          ...fullSchema.properties[providerFacilityFields.parentObject].items,
          properties: {
            ...fullSchema.properties[providerFacilityFields.parentObject].items
              .properties,
            [providerFacilityFields.providerFacilityAddress]: address.schema(
              fullSchema,
              () => true,
            ),
            [providerFacilityFields.treatmentDateRange]: {
              ...fullSchema.properties[providerFacilityFields.parentObject]
                .items.properties[providerFacilityFields.treatmentDateRange]
                .items,
            },
          },
        },
      },
    },
  },
};

/**
 * For non-production environments, implement array builder pattern with web components
 */
const getWebComponentImplementation = () => {
  /** @type {ArrayBuilderOptions} */
  const options = {
    arrayPath: providerFacilityFields.parentObject,
    nounSingular: 'treatment record',
    nounPlural: 'treatment records',
    required: true,
    isItemIncomplete: item =>
      !item?.[providerFacilityFields.providerFacilityName] ||
      !item?.[providerFacilityFields.providerFacilityAddress] ||
      !item?.[providerFacilityFields.conditionsTreated] ||
      !item?.[providerFacilityFields.treatmentDateRange],
    maxItems: 5,
    text: {
      getItemName: item => item[providerFacilityFields.providerFacilityName],
      cardDescription: item =>
        `${formatReviewDate(
          item?.[providerFacilityFields.treatmentDateRange].from,
        )} - ${formatReviewDate(
          item?.[providerFacilityFields.treatmentDateRange].to,
        )}`,
    },
  };

  /** @returns {PageSchema} */
  const introPage = {
    uiSchema: {
      ...titleUI(
        'Treatment Records',
        `In the next few questions, we'll ask you about the treatment records you're requesting. You must add at least one treatment request. You may add up to ${
          options.maxItems
        }.`,
      ),
    },
    schema: {
      type: 'object',
      properties: {},
    },
  };

  /**
   * @returns {PageSchema}
   */
  const summaryPage = {
    uiSchema: {
      'view:hasTreatmentRecords': arrayBuilderYesNoUI(options),
    },
    schema: {
      type: 'object',
      properties: {
        'view:hasTreatmentRecords': arrayBuilderYesNoSchema,
      },
      required: ['view:hasTreatmentRecords'],
    },
  };

  /** @returns {PageSchema} */
  const nameAndAddressPage = {
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'Tell us where the patient received treatment',
        nounSingular: options.nounSingular,
      }),
      [providerFacilityFields.providerFacilityName]: textUI({
        title: 'Name of private provider or hospital',
        errorMessages: {
          required:
            'Enter the name of the private provider or hospital where you received treatment',
        },
      }),
      [providerFacilityFields.providerFacilityAddress]: addressNoMilitaryUI({
        omit: ['street3'],
      }),
    },
    schema: {
      type: 'object',
      properties: {
        [providerFacilityFields.providerFacilityName]: textSchema,
        [providerFacilityFields.providerFacilityAddress]: addressNoMilitarySchema(
          { omit: ['street3'] },
        ),
      },
      required: [
        providerFacilityFields.providerFacilityName,
        providerFacilityFields.providerFacilityAddress,
      ],
    },
  };

  /** @returns {PageSchema} */
  const conditionsPage = {
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          `Conditions treated at ${
            formData[providerFacilityFields.providerFacilityName]
          }`,
      ),
      [providerFacilityFields.conditionsTreated]: textareaUI({
        title:
          'List the conditions the person received treatment for at this facility.',
        errorMessages: {
          required:
            'You must enter at least one condition the person received treatment for at this facility',
        },
      }),
    },
    schema: {
      type: 'object',
      properties: {
        [providerFacilityFields.conditionsTreated]: textareaSchema,
      },
      required: [providerFacilityFields.conditionsTreated],
    },
  };

  /** @returns {PageSchema} */
  const treatmentDatesPage = {
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          `Treatment dates at ${
            formData[providerFacilityFields.providerFacilityName]
          }`,
      ),
      [providerFacilityFields.treatmentDateRange]: currentOrPastDateRangeUI(
        {
          title: 'First treatment date (you can estimate)',
          errorMessages: {
            required: 'Enter the date you first received treatment',
          },
        },
        {
          title: 'Last treatment date (you can estimate)',
          errorMessages: {
            required: 'Enter the date of your last treatment',
          },
        },
      ),
    },
    schema: {
      type: 'object',
      properties: {
        [providerFacilityFields.treatmentDateRange]: currentOrPastDateRangeSchema,
      },
      required: [providerFacilityFields.treatmentDateRange],
    },
  };

  return arrayBuilderPages(options, pageBuilder => ({
    recordsRequested: pageBuilder.introPage({
      title: 'Records requested',
      path: 'records-requested',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    recordsRequestedSummary: pageBuilder.summaryPage({
      title: 'Review your medical providers',
      path: 'records-requested-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    recordsRequestedNameAndAddressPage: pageBuilder.itemPage({
      title: 'Provider Information',
      path: 'records-requested/:index/name-and-address',
      uiSchema: nameAndAddressPage.uiSchema,
      schema: nameAndAddressPage.schema,
    }),
    recordsRequestedConditionsPage: pageBuilder.itemPage({
      title: 'Conditions Treated',
      path: 'records-requested/:index/conditions',
      uiSchema: conditionsPage.uiSchema,
      schema: conditionsPage.schema,
    }),
    recordsRequestedTreatmentDatesPage: pageBuilder.itemPage({
      title: 'Treatment Dates',
      path: 'records-requested/:index/treatment-dates',
      uiSchema: treatmentDatesPage.uiSchema,
      schema: treatmentDatesPage.schema,
    }),
  }));
};

/** @type {PageSchema} */
export default (environment.isProduction()
  ? originalImplementation
  : getWebComponentImplementation());
