import React from 'react';
import PropTypes from 'prop-types';
import {
  addressSchema,
  addressUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CustomAlertPage } from './helpers';
import { getAlert } from '../helpers';

/** @type {PageSchema} */
export const nameAndZipCodePage = {
  uiSchema: {
    ...titleUI(
      'Veteran’s name and postal code',
      <div className="vads-u-margin-top--3">
        {getAlert({ name: 'nameAndZipCodePage' }, false)}
      </div>,
    ),
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
  return <CustomAlertPage {...props} />;
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
  pagePerItemIndex: PropTypes.number,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};
