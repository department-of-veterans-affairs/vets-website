import React from 'react';
import * as address from 'platform/forms-system/src/js/definitions/address';
import get from 'platform/utilities/data/get';
import constants from 'vets-json-schema/dist/constants.json';
import { isValidUSZipCode, isValidCanPostalCode } from 'platform/forms/address';
import { useSelector, useDispatch } from 'react-redux';

import fullSchema from '../../../../22-1990-schema.json';

import LearnMoreAboutMilitaryBaseTooltip from '../../../../components/LearnMoreAboutMilitaryBaseTooltip';
import YesNoReviewField from '../../../../components/YesNoReviewField';
import AddressValidationModal from '../../../../components/AddressValidationModal';

import { formFields } from '../../../../constants';
import {
  setAddressValidationModalOpen,
  acceptValidatedAddress,
  validateAddress,
  resetAddressValidation,
} from '../../../../actions';

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

const stateRequiredCountries = new Set(['USA']);
function customValidateAddress(errors, addressData, formData, currentSchema) {
  if (
    stateRequiredCountries.has(addressData.country) &&
    addressData.state === undefined &&
    currentSchema.required.length
  ) {
    errors.state.addError('Please select a state');
  }
  let isValidPostalCode = true;
  if (addressData.country === 'USA') {
    isValidPostalCode = isValidUSZipCode(addressData.postalCode);
  }
  if (addressData.country === 'CAN') {
    isValidPostalCode = isValidCanPostalCode(addressData.postalCode);
  }

  if (addressData.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }
}

// This is the container component that will connect to Redux and handle address validation
const NewMailingAddressWithValidation = ({ formData, viewForm, onSubmit }) => {
  const { addressValidation } = useSelector(state => state.data);
  const dispatch = useDispatch();

  // Handlers for address validation modal
  const handleCloseModal = () => {
    dispatch(setAddressValidationModalOpen(false));
  };

  const handleAcceptAddress = addressData => {
    // Update the form data with the selected address
    const updatedFormData = {
      ...formData,
      [formFields.viewMailingAddress]: {
        ...formData[formFields.viewMailingAddress],
        [formFields.address]: addressData,
      },
    };

    // Accept the address in Redux state
    dispatch(acceptValidatedAddress(addressData));

    // Continue with form submission
    onSubmit(updatedFormData);
  };

  // Custom onSubmit handler for the form to handle address validation
  const handleSubmit = () => {
    const mailingAddress =
      formData[formFields.viewMailingAddress]?.[formFields.address];

    // Skip validation for military bases and non-US addresses
    if (
      formData[formFields.viewMailingAddress]?.[
        formFields.livesOnMilitaryBase
      ] ||
      mailingAddress?.country !== 'USA'
    ) {
      onSubmit(formData);
      return;
    }

    // Validate the address
    dispatch(validateAddress(mailingAddress))
      .then(response => {
        // If we got suggested addresses and they're different from user input, show the validation modal
        if (
          response?.addresses?.length > 0 &&
          response.addresses[0].addressMetaData.confidenceScore < 100
        ) {
          dispatch(setAddressValidationModalOpen(true));
        } else {
          // No suggested addresses or high confidence score, continue with form submission
          onSubmit(formData);
        }
      })
      .catch(() => {
        // If validation fails, still allow the form to submit
        onSubmit(formData);
      });
  };

  // Create a modified viewForm with the custom submit handler
  const modifiedViewForm = React.cloneElement(viewForm, {
    onSubmit: handleSubmit,
  });

  // Clean up when unmounting
  React.useEffect(
    () => {
      return () => {
        dispatch(resetAddressValidation());
      };
    },
    [dispatch],
  );

  return (
    <>
      {modifiedViewForm}
      {addressValidation.modalOpen && (
        <AddressValidationModal
          isOpen={addressValidation.modalOpen}
          onClose={handleCloseModal}
          userEnteredAddress={
            formData[formFields.viewMailingAddress]?.[formFields.address]
          }
          suggestedAddresses={addressValidation.suggestedAddresses || []}
          onAcceptAddress={handleAcceptAddress}
        />
      )}
    </>
  );
};

// Extend the UI Schema to add the validate address function to props
const uiSchemaWithValidation = {
  'view:subHeadings': {
    'ui:description': (
      <>
        <h3>Review your mailing address</h3>
        <p>
          We’ll send any important information about your application to this
          address.
        </p>
        <p>
          This is the mailing address we have on file for you. If you notice any
          errors, please correct them now. Any updates you make will change the
          information for your education benefits only.
        </p>
        <p>
          <strong>Note:</strong> If you want to update your personal information
          for other VA benefits, you can do that from your profile.
        </p>
        <p>
          <a href="/profile/personal-information">Go to your profile</a>
        </p>
      </>
    ),
  },
  [formFields.viewMailingAddress]: {
    'ui:description': (
      <>
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only">
          Mailing address
        </h4>
        <p className="meb-review-page-only">
          If you’d like to update your mailing address, please edit the form
          fields below.
        </p>
      </>
    ),
    [formFields.livesOnMilitaryBase]: {
      'ui:title': (
        <span id="LiveOnMilitaryBaseTooltip">
          I live on a United States military base outside of the country
        </span>
      ),
      'ui:reviewField': YesNoReviewField,
    },
    livesOnMilitaryBaseInfo: {
      'ui:description': LearnMoreAboutMilitaryBaseTooltip(),
    },
    [formFields.address]: {
      ...address.uiSchema('', false, null, true),
      'ui:validations': [customValidateAddress],
      'ui:options': {
        updateSchema: (formData, addressSchema) => {
          const livesOnMilitaryBase =
            formData['view:mailingAddress']?.livesOnMilitaryBase;
          const country =
            formData['view:mailingAddress']?.address?.country || 'USA';
          // Get the current required fields, excluding state
          const required = (addressSchema.required || []).filter(
            field => field !== 'state',
          );

          // Only add state as required for USA or military base
          if (livesOnMilitaryBase || country === 'USA') {
            required.push('state');
          }
          if (livesOnMilitaryBase) {
            return {
              ...addressSchema,
              required,
              properties: {
                ...addressSchema.properties,
                state: {
                  type: 'string',
                  title: 'AE/AA/AP',
                  enum: ['AE', 'AA', 'AP'],
                  enumNames: [
                    'AE - APO/DPO/FPO',
                    'AA - APO/DPO/FPO',
                    'AP - APO/DPO/FPO',
                  ],
                },
              },
            };
          }
          let stateSchema = {
            type: 'string',
            title: 'State/County/Province',
          };
          if (country === 'USA') {
            stateSchema = {
              ...stateSchema,
              enum: constants.states.USA.map(state => state.value),
              enumNames: constants.states.USA.map(state => state.label),
            };
          }
          return {
            ...addressSchema,
            required,
            properties: {
              ...addressSchema.properties,
              state: stateSchema,
            },
          };
        },
      },
      country: {
        'ui:title': 'Country',
        // If you live on a military base, it's not required; otherwise it is
        'ui:required': formData =>
          !formData['view:mailingAddress'].livesOnMilitaryBase,
        // If you live on a military base, the country field is disabled
        'ui:disabled': formData =>
          formData['view:mailingAddress'].livesOnMilitaryBase,
        'ui:options': {
          updateSchema: (formData, schema, uiSchema) => {
            const countryUI = uiSchema;
            const addressFormData = get(
              ['view:mailingAddress', 'address'],
              formData,
            );
            const livesOnMilitaryBase = get(
              ['view:mailingAddress', 'livesOnMilitaryBase'],
              formData,
            );

            if (livesOnMilitaryBase) {
              countryUI['ui:disabled'] = true;
              const USA = {
                value: 'USA',
                label: 'United States',
              };
              addressFormData.country = USA.value;
              return {
                enum: [USA.value],
                enumNames: [USA.label],
                default: USA.value,
              };
            }

            countryUI['ui:disabled'] = false;
            return {
              type: 'string',
              enum: constants.countries.map(country => country.value),
              enumNames: constants.countries.map(country => country.label),
            };
          },
        },
      },
      street: {
        'ui:title': 'Street address',
        'ui:errorMessages': {
          required: 'Please enter your full street address',
        },
        'ui:validations': [
          (errors, field) => {
            if (isOnlyWhitespace(field)) {
              errors.addError('Please enter your full street address');
            } else if (field?.length < 3) {
              errors.addError('minimum of 3 characters');
            } else if (field?.length > 40) {
              errors.addError('maximum of 40 characters');
            }
          },
        ],
      },
      street2: {
        'ui:title': 'Street address line 2',
        'ui:validations': [
          (errors, field) => {
            // If field is provided and contains only whitespace
            if (field && isOnlyWhitespace(field)) {
              errors.addError('Please enter a valid street address line 2');
            } else if (field?.length > 40) {
              errors.addError('maximum of 40 characters');
            }
          },
        ],
        'ui:options': {
          updateSchema: (formData, schema) => {
            const addressData = get(
              ['view:mailingAddress', 'address'],
              formData,
            );

            // Make sure street2 is treated as a string (even if it's null or undefined)
            if (addressData.street2 == null) {
              addressData.street2 = ''; // Set to empty string to avoid validation errors
            }

            // If no value is provided, skip validation
            if (!addressData.street2) {
              return {
                ...schema,
                minLength: 0,
              };
            }

            return schema;
          },
        },
      },
      city: {
        'ui:errorMessages': {
          required: 'Please enter a valid city',
        },
        'ui:validations': [
          (errors, field) => {
            if (isOnlyWhitespace(field)) {
              errors.addError('Please enter a valid city');
            } else if (field?.length < 2) {
              errors.addError('minimum of 2 characters');
            } else if (field?.length > 20) {
              errors.addError('maximum of 20 characters');
            }
          },
        ], // mebAddressValidationApi
        'ui:options': {
          replaceSchema: formData => {
            const livesOnMilitaryBase =
              formData['view:mailingAddress']?.livesOnMilitaryBase;

            if (livesOnMilitaryBase) {
              // Always have APO/FPO
              const baseEnum = ['APO', 'FPO'];
              // Conditionally add DPO if feature toggle is enabled
              if (formData?.mebDpoAddressOptionEnabled) {
                baseEnum.push('DPO');
              }

              return {
                type: 'string',
                title: formData?.mebDpoAddressOptionEnabled
                  ? 'APO/FPO/DPO'
                  : 'APO/FPO',
                enum: baseEnum,
              };
            }

            // If not on a military base, show a normal City field
            return {
              type: 'string',
              title: 'City',
            };
          },
        },
      },
      state: {
        'ui:validations': [
          (errors, field) => {
            if (field?.length === 1) {
              errors.addError('Must be more than 1 character');
            } else if (field?.length > 31) {
              errors.addError('Must be less than 31 characters');
            }
          },
        ],
      },
      postalCode: {
        'ui:options': {
          updateSchema: formData => {
            if (formData['view:mailingAddress']?.address?.country !== 'USA') {
              return {
                title: 'Postal Code',
                type: 'string',
                minLength: 3,
                maxLength: 10,
              };
            }

            return {
              title: 'Zip code',
              type: 'string',
            };
          },
        },
      },
    },
    'ui:options': {
      hideLabelText: true,
      showFieldLabel: false,
      viewComponent: NewMailingAddressWithValidation,
    },
  },
  'ui:validations': [],
};

const newMailingAddress33 = {
  uiSchema: uiSchemaWithValidation,
  schema: {
    type: 'object',
    properties: {
      'view:subHeadings': {
        type: 'object',
        properties: {},
      },
      [formFields.viewMailingAddress]: {
        type: 'object',
        properties: {
          [formFields.livesOnMilitaryBase]: {
            type: 'boolean',
          },
          livesOnMilitaryBaseInfo: {
            type: 'object',
            properties: {},
          },
          [formFields.address]: {
            ...address.schema(fullSchema, true),
          },
        },
      },
    },
  },
};

export { NewMailingAddressWithValidation };
export default newMailingAddress33;
