import React from 'react';
import PropTypes from 'prop-types';
import {
  addressSchema,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  vaFileNumberUI,
  vaFileNumberSchema,
  ssnSchema,
  ssnUI,
  dateOfBirthUI,
  dateOfBirthSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CustomAlertPage, ITFBenefitTypes } from './helpers';

const veteranSubPageUI = {
  veteranFullName: firstNameLastNameNoSuffixUI(),
  veteranSsn: ssnUI(),
  veteranDateOfBirth: dateOfBirthUI(),
  address: addressUI({
    labels: {
      postalCode: 'Postal code',
    },
    omit: [
      'country',
      'city',
      'isMilitary',
      'state',
      'street',
      'street2',
      'street3',
    ],
    required: true,
  }),
  vaFileNumber: {
    ...vaFileNumberUI,
    'ui:title': 'VA file number',
    'ui:errorMessages': {
      pattern: 'Your VA file number must be 8 or 9 digits',
    },
  },
};

const veteranSubPageSchema = {
  veteranFullName: firstNameLastNameNoSuffixSchema,
  veteranSsn: ssnSchema,
  veteranDateOfBirth: dateOfBirthSchema,
  address: addressSchema({
    omit: [
      'country',
      'city',
      'isMilitary',
      'state',
      'street',
      'street2',
      'street3',
      'postalCode',
    ],
  }),
  vaFileNumber: vaFileNumberSchema,
};

/** @type {PageSchema} */
export const itfVeteranInformationPage = {
  uiSchema: {
    veteranSubPage: {
      'ui:title': 'Veteran identification information',
      ...veteranSubPageUI,
    },
    benefitType: radioUI({
      title: 'Select the benefit you intend to file a claim for',
      labelHeaderLevel: '3',
      tile: true,
      required: () => true,
      labels: ITFBenefitTypes.labels,
      descriptions: ITFBenefitTypes.descriptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSubPage: {
        type: 'object',
        properties: {
          ...veteranSubPageSchema,
        },
        required: [
          'veteranSsn',
          'veteranDateOfBirth',
          'address',
          'veteranFullName',
        ],
      },
      benefitType: radioSchema(Object.keys(ITFBenefitTypes.labels)),
    },
  },
};

/** @type {CustomPageType} */
export function VeteranInformationPage(props) {
  return <CustomAlertPage {...props} />;
}

itfVeteranInformationPage.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};
