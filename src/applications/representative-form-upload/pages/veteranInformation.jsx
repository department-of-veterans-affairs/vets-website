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
import { emptyObjectSchema, claimantTitleAndDescription } from './helpers';
import ClaimantInfoViewField from '../components/ClaimantInfoViewField';

/** @type {PageSchema} */
export const veteranInformationPage = {
  uiSchema: {
    ...claimantTitleAndDescription,
    'ui:objectViewField': ClaimantInfoViewField,
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
    vaFileNumber: {
      ...vaFileNumberUI,
      'ui:title': 'VA file number',
    },
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
        ],
      }),
      vaFileNumber: vaFileNumberSchema,
    },
    required: [
      'veteranSsn',
      'veteranDateOfBirth',
      'address',
      'veteranFullName',
    ],
  },
};

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
