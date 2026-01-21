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
import {
  emptyObjectSchema,
  ITFClaimantTitleAndDescription,
  CustomAlertPage,
  ITFBenefitTypes,
} from './helpers';
import ITFClaimantInfoViewField from '../components/ITFClaimantInfoViewField';

/** @type {PageSchema} */
export const itfVeteranInformationPage = {
  uiSchema: {
    ...ITFClaimantTitleAndDescription,
    'ui:objectViewField': ITFClaimantInfoViewField,
    veteranFullName: firstNameLastNameNoSuffixUI(),
    address: addressUI({
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
      required: true,
    }),
    veteranSsn: ssnUI(),
    veteranDateOfBirth: dateOfBirthUI(),
    vaFileNumber: {
      ...vaFileNumberUI,
      'ui:title': 'VA file number',
      'ui:errorMessages': {
        pattern: 'Your VA file number must be 8 or 9 digits',
      },
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
      'view:claimantTitle': emptyObjectSchema,
      'view:claimantDescription': emptyObjectSchema,
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
      benefitType: radioSchema(Object.keys(ITFBenefitTypes.labels)),
    },
    required: [
      'veteranSsn',
      'veteranDateOfBirth',
      'address',
      'veteranFullName',
      'benefitType',
    ],
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
