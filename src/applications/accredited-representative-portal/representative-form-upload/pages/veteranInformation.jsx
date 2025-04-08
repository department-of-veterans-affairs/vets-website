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
} from './helpers';

/** @type {PageSchema} */
export const veteranInformationPage = {
  uiSchema: {
    ...claimantTitleAndDescription,
    veteranFullName: firstNameLastNameNoSuffixUI(),
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
    veteranDateOfBirth: dateOfBirthUI(),
    ...representativeTitleAndDescription,
    email: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:claimantTitle': emptyObjectSchema,
      'view:claimantDescription': emptyObjectSchema,
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
      'view:representativeTitle': emptyObjectSchema,
      'view:representativeDescription': emptyObjectSchema,
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
    'veteran-information',
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
