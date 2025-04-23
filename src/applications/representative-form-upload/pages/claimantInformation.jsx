import React from 'react';
import PropTypes from 'prop-types';
import {
  addressSchema,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  emailSchema,
  emailToSendNotificationsUI,
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
  representativeTitleAndDescription,
  veteranTitleAndDescription,
} from './helpers';

const claimantSubPageUI = {
  claimantFullName: firstNameLastNameNoSuffixUI(),
  claimantSsn: ssnUI('Social Security Number'),
  claimantDateOfBirth: dateOfBirthUI({
    title: 'Date of Birth',
  }),
};

const claimantSubPageSchema = {
  claimantFullName: firstNameLastNameNoSuffixSchema,
  claimantSsn: ssnSchema,
  claimantDateOfBirth: dateOfBirthSchema,
};

const veteranSubPageUI = {
  veteranFullName: firstNameLastNameNoSuffixUI(),
  veteranSsn: ssnUI('Social Security Number'),
  veteranDateOfBirth: dateOfBirthUI({
    title: 'Date of Birth',
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
    ...claimantTitleAndDescription,
    ...claimantSubPageUI,
    ...veteranTitleAndDescription,
    ...veteranSubPageUI,
    ...representativeTitleAndDescription,
    email: emailToSendNotificationsUI(),
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
      'view:representativeTitle': emptyObjectSchema,
      'view:representativeDescription': emptyObjectSchema,
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
