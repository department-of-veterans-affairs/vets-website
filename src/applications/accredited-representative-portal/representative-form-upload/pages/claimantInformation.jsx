import React from 'react';
import PropTypes from 'prop-types';
import {
  addressSchema,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  emailSchema,
  emailToSendNotificationsUI,
  inlineTitleUI,
  ssnSchema,
  ssnUI,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

function claimantFormatTitle(name) {
  return `Claimant ${name}`;
}

function veteranFormatTitle(name) {
  return `Veteran ${name}`;
}

const claimantSubPageUI = {
  ...inlineTitleUI("Claimant's information"),
  claimantFullName: firstNameLastNameNoSuffixUI(claimantFormatTitle),
  claimantSsn: ssnUI('Claimant SSN'),
  claimantDateOfBirth: dateOfBirthUI({
    title: 'Claimant Date of Birth',
  }),
};

const claimantSubPageSchema = {
  claimantFullName: firstNameLastNameNoSuffixSchema,
  claimantSsn: ssnSchema,
  claimantDateOfBirth: dateOfBirthSchema,
};

const veteranSubPageUI = {
  ...inlineTitleUI(
    "Veteran's information",
    "If the Veteran's name and postal code here don't match the uploaded PDF, it will cause processing delays",
  ),
  veteranFullName: firstNameLastNameNoSuffixUI(veteranFormatTitle),
  veteranSsn: ssnUI('Veteran SSN'),
  veteranDateOfBirth: dateOfBirthUI({
    title: 'Veteran Date of Birth',
  }),
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
};

/** @type {PageSchema} */
export const claimantInformationPage = {
  uiSchema: {
    ...claimantSubPageUI,
    ...veteranSubPageUI,
    email: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      ...claimantSubPageSchema,
      ...veteranSubPageSchema,
      email: emailSchema,
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
