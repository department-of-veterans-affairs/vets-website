import React from 'react';
import PropTypes from 'prop-types';
import {
  addressSchema,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  emailSchema,
  emailToSendNotificationsUI,
  titleUI,
  ssnSchema,
  ssnUI,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

function veteranFormatTitle(name) {
  return `Veteran ${name}`;
}

/** @type {PageSchema} */
export const veteranInformationPage = {
  uiSchema: {
    ...titleUI('Veteran’s information'),
    veteranFullName: firstNameLastNameNoSuffixUI(veteranFormatTitle),
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
    veteranSsn: ssnUI(),
    email: emailToSendNotificationsUI(),
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: firstNameLastNameNoSuffixSchema,
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
      veteranSsn: ssnSchema,
      veteranDateOfBirth: dateOfBirthSchema,
      email: emailSchema,
    },
    required: [
      'veteranSsn',
      'veteranDateOfBirth',
      'email',
      'address',
      'veteranFullName',
    ],
  },
};

/** @type {CustomPageType} */
export function VeteranInformationPage(props) {
  const alert = MUST_MATCH_ALERT(
    'claimant-information',
    onCloseAlert,
    props.data,
  );
  return <CustomAlertPage {...props} alert={alert} />;
}

veteranInformationPage.propTypes = {
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
