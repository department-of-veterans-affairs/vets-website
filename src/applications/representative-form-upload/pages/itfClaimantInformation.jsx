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
import {
  emptyObjectSchema,
  claimantTitleAndDescription,
  veteranTitleAndDescription,
} from './helpers';
import ClaimantInfoViewField from '../components/ClaimantInfoViewField';

const claimantSubPageUI = {
  claimantFullName: firstNameLastNameNoSuffixUI(),
  claimantSsn: ssnUI(),
  claimantDateOfBirth: dateOfBirthUI(),
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
  veteranSsn: ssnUI(),
  veteranDateOfBirth: dateOfBirthUI(),
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
  veteranDateOfBirth: dateOfBirthSchema,
  vaFileNumber: vaFileNumberSchema,
};

/** @type {PageSchema} */
export const itfClaimantInformationPage = {
  uiSchema: {
    ...claimantTitleAndDescription,
    'ui:objectViewField': ClaimantInfoViewField,
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
      'address',
      'veteranFullName',
    ],
  },
};

itfClaimantInformationPage.propTypes = {
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
