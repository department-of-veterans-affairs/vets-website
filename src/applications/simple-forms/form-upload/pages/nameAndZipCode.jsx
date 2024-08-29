import React from 'react';
import PropTypes from 'prop-types';
import {
  addressSchema,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

/** @type {PageSchema} */
export const nameAndZipCodePage = {
  uiSchema: {
    ...titleUI(
      'Veteran’s name and zip code',
      'We’ll use this information to make sure we send your form to the right place.',
    ),
    fullName: firstNameLastNameNoSuffixUI(),
    address: addressUI({
      labels: {
        postalCode: 'Zip code',
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
    },
  },
};

/** @type {CustomPageType} */
export function NameAndZipCodePage(props) {
  const alert = MUST_MATCH_ALERT('name-and-zip-code', onCloseAlert, props.data);
  return <CustomAlertPage {...props} alert={alert} />;
}

NameAndZipCodePage.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
};
