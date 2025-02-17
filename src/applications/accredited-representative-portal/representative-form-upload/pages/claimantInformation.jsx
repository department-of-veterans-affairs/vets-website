import React from 'react';
import PropTypes from 'prop-types';
import {
  addressSchema,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  emailSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

/** @type {PageSchema} */
export const claimantInformationPage = {
  uiSchema: {
    ...titleUI('Claimant’s information'),
    fullName: firstNameLastNameNoSuffixUI(),
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
    idNumber: ssnOrVaFileNumberUI(),
    phoneNumber: phoneUI(),
    email: emailToSendNotificationsUI(),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: firstNameLastNameNoSuffixSchema,
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
      idNumber: ssnOrVaFileNumberSchema,
      phoneNumber: phoneSchema,
      email: emailSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['email'],
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
