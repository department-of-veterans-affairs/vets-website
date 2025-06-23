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
} from 'platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import {
  CustomAlertPage,
  emptyObjectSchema,
  claimantTitleAndDescription,
  veteranTitleAndDescription,
} from './helpers';

const claimantSubPageUI = {
  claimantFullName: firstNameLastNameNoSuffixUI(),
  claimantSsn: {
    ...ssnUI,
    'ui:title': 'Social Security number',
  },
  claimantDateOfBirth: {
    ...dateOfBirthUI,
    'ui:title': 'Date of birth',
  },
  vaFileNumber: {
    ...vaFileNumberUI,
    'ui:title': 'VA file number',
  },
};

const claimantSubPageSchema = {
  claimantFullName: firstNameLastNameNoSuffixSchema,
  claimantSsn: ssnSchema,
  claimantDateOfBirth: dateOfBirthSchema,
};

const veteranSubPageUI = {
  veteranFullName: firstNameLastNameNoSuffixUI(),
  veteranSsn: {
    ...ssnUI,
    'ui:title': 'Social Security number',
  },
  veteranDateOfBirth: {
    ...dateOfBirthUI,
    'ui:title': 'Date of birth',
  },
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
    ],
  }),
  vaFileNumber: vaFileNumberSchema,
};

/** @type {PageSchema} */
export const claimantInformationPage = {
  uiSchema: {
    ...claimantTitleAndDescription,
    ...claimantSubPageUI,
    ...veteranTitleAndDescription,
    ...veteranSubPageUI,
  },
  schema: {
    type: 'object',
    properties: {
      'view:claimantTitle': emptyObjectSchema,
      'view:claimantDescription': emptyObjectSchema,
      ...claimantSubPageSchema,
      'view:veteranTitle': emptyObjectSchema,
      'view:veteranDescription': emptyObjectSchema,
      ...veteranSubPageSchema,
    },
    required: [
      'claimantSsn',
      'claimantDateOfBirth',
      'veteranSsn',
      'veteranDateOfBirth',
      'email',
      'address',
      'veteranFullName',
    ],
  },
};

/** @type {CustomPageType} */
export function ClaimantInformationPage(props) {
  const alert = MUST_MATCH_ALERT(
    'claimant-information',
    onCloseAlert,
    props.data,
  );
  return <CustomAlertPage {...props} alert={alert} />;
}

claimantInformationPage.propTypes = {
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
