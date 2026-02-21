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
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ITFClaimantInfoViewField from '../components/ITFClaimantInfoViewField';
import { ITFVetBenefits } from './helpers';

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
    'ui:errorMessages': {
      pattern: 'Your VA file number must be 8 or 9 digits',
    },
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
      'postalCode',
    ],
  }),
  veteranDateOfBirth: dateOfBirthSchema,
  vaFileNumber: vaFileNumberSchema,
};

/** @type {PageSchema} */
export const itfClaimantInformationPage = {
  uiSchema: {
    'ui:objectViewField': ITFClaimantInfoViewField,
    claimantSubPage: {
      'ui:title': 'Claimant information',
      ...claimantSubPageUI,
    },
    veteranSubPage: {
      'ui:title': 'Veteran identification information',
      ...veteranSubPageUI,
    },
    selectBenefits: checkboxGroupUI({
      title: 'Select the benefit you intend to file a claim for',
      labelHeaderLevel: '3',
      required: true,
      tile: true,
      labels: ITFVetBenefits,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      claimantSubPage: {
        type: 'object',
        properties: {
          ...claimantSubPageSchema,
        },
        required: ['claimantSsn', 'claimantDateOfBirth'],
      },
      veteranSubPage: {
        type: 'object',
        properties: {
          ...veteranSubPageSchema,
        },
        required: [
          'veteranSsn',
          'address',
          'veteranFullName',
          'veteranDateOfBirth',
        ],
      },
      selectBenefits: checkboxGroupSchema(Object.keys(ITFVetBenefits)),
    },
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
