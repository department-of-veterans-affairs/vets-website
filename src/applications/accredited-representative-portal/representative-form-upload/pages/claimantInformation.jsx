import React from 'react';
import PropTypes from 'prop-types';
import {
  addressSchema,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  emailSchema,
  emailToSendNotificationsUI,
  // titleUI,
  inlineTitleUI,
  // arrayBuilderItemFirstPageTitleUI,
  // arrayBuilderItemSubsequentPageTitleUI,
  // descriptionUI,
  ssnSchema,
  ssnUI,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

// import claimantSubPageSchema2 from "./claimantInformationPage/claimantInformationSchema";
// import claimantSubPageUI2 from './claimantInformationPage/claimantSubPageUI2'
// debugger

function claimantFormatTitle(name) {
  return `Claimant ${name}`;
}

function veteranFormatTitle(name) {
  return `Veteran ${name}`;
}

const claimantSubPageUI = {
  // ...titleUI("Claimant's information"),
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
  // ...titleUI("Veteran's information", "If the Veteran's name and postal code here don't match the uploaded PDF, it will cause processing delays"),
  // ...arrayBuilderItemSubsequentPageTitleUI("Veteran's information"),
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
    // need to bold
    // ...descriptionUI("Claimant's information"),
    // claimantFullName: firstNameLastNameNoSuffixUI(claimantFormatTitle),
    // claimantSsn: ssnUI("Claimant SSN"),
    // claimantDateOfBirth: dateOfBirthUI({
    //   title: "Claimant Date of Birth"
    // }),
    // ...claimantSubPageUI,
    ...claimantSubPageUI,
    // -----
    ...veteranSubPageUI,
    // ...descriptionUI( "Veteran's information"),
    // // "If the Veteran's name and postal code here don't match the uploaded PDF, it will cause processing delays"
    // veteranFullName: firstNameLastNameNoSuffixUI(veteranFormatTitle),
    // veteranSsn: ssnUI("Veteran SSN"),
    // veteranDateOfBirth: dateOfBirthUI({
    //   title: "Veteran Date of Birth"
    // }),
    // address: addressUI({
    //   labels: {
    //     postalCode: 'Postal code',
    //   },
    //   omit: [
    //     'country',
    //     'city',
    //     'isMilitary',
    //     'state',
    //     'street',
    //     'street2',
    //     'street3',
    //   ],
    //   required: true,
    // }),
    // ------
    // ...titleUI("Representative contact Information"),
    // "We'll send any important information to this address."
    email: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      // claimantFullName: firstNameLastNameNoSuffixSchema,
      // claimantSsn: ssnSchema,
      // claimantDateOfBirth: dateOfBirthSchema,
      // ...claimantSubPageSchema,
      ...claimantSubPageSchema,
      // address: addressSchema({
      //   omit: [
      //     'country',
      //     'city',
      //     'isMilitary',
      //     'state',
      //     'street',
      //     'street2',
      //     'street3',
      //   ],
      // }),
      // veteranFullName: firstNameLastNameNoSuffixSchema,
      // veteranSsn: ssnSchema,
      // veteranDateOfBirth: dateOfBirthSchema,
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

// arrayBuilderItemFirstPageTitleUI

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
