import React from 'react';
import * as address from 'platform/forms-system/src/js/definitions/address';
import constants from 'vets-json-schema/dist/constants.json';
import { isValidUSZipCode, isValidCanPostalCode } from 'platform/forms/address';
import { setData } from 'platform/forms-system/src/js/actions';

import fullSchema from '../../../../22-1990-schema.json';

import LearnMoreAboutMilitaryBaseTooltip from '../../../../components/LearnMoreAboutMilitaryBaseTooltip';
import YesNoReviewField from '../../../../components/YesNoReviewField';
import AddressValidationModal from '../../../../components/AddressValidationModal';

import { formFields } from '../../../../constants';
import { validateAddress } from '../../../../actions';

// Proper form system validation function to integrate with address validation
// This works with the VA forms system
const validateAddressWithAPI = async (
  errors,
  addressData,
  formData,
  formContext,
) => {
  // Get the mailing address from the form data
  const mailingAddress =
    formData[formFields.viewMailingAddress]?.[formFields.address];

  if (!mailingAddress) {
    return errors;
  }

  // Skip validation for military addresses, APO/FPO/DPO, and non-US addresses
  if (
    formData[formFields.viewMailingAddress]?.[formFields.livesOnMilitaryBase] ||
    mailingAddress.country !== 'USA'
  ) {
    return errors;
  }

  // Check validation state in form data
  if (formData[formFields.viewMailingAddress]?.addressValidated) {
    return errors;
  }

  try {
    // Make API call using Redux action
    const validateAddressAction = validateAddress(mailingAddress);
    const response = await validateAddressAction(formContext.store.dispatch);

    // If we got addresses back
    if (response?.addresses?.length > 0) {
      const { confidenceScore } = response.addresses[0].addressMetaData;

      if (confidenceScore < 100) {
        // Show the modal for low confidence matches
        errors.addError(
          'We need to verify your address before continuing. Please review the suggested addresses.',
        );
      } else {
        // Auto-validate for high confidence matches
        // Update form data using setData
        const updatedFormData = {
          ...formData,
          [formFields.viewMailingAddress]: {
            ...formData[formFields.viewMailingAddress],
            addressValidated: true,
          },
        };
        formContext.store.dispatch(setData(updatedFormData));
      }
    }
  } catch (error) {
    // For API failures, we should still block submission
    // This prevents bypassing validation when the API is down
    errors.addError(
      'We were unable to validate your address. Please try again later.',
    );

    const logger = window.console;
    if (logger && logger.error) {
      logger.error('Address validation error:', error);
    }
  }

  return errors;
};

const stateRequiredCountries = new Set(['USA']);
function customValidateAddress(errors, addressData, formData, currentSchema) {
  // Check if address needs validation (US non-military address)
  const needsValidation =
    addressData.country === 'USA' &&
    !formData[formFields.viewMailingAddress]?.[formFields.livesOnMilitaryBase];

  // If we need validation, check if it's validated in form data
  if (
    needsValidation &&
    !formData[formFields.viewMailingAddress]?.addressValidated
  ) {
    errors.addError('Please validate your address before continuing.');
  }

  // Continue with regular validation
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

  return errors;
}

const newMailingAddress33 = {
  uiSchema: {
    'view:subHeadings': {
      'ui:description': (
        <>
          <h3>Review your mailing address</h3>
          <p>
            We’ll send any important information about your application to this
            address.
          </p>
          <p>
            This is the mailing address we have on file for you. If you notice
            any errors, please correct them now. Any updates you make will
            change the information for your education benefits only.
          </p>
          <p>
            <strong>Note:</strong> If you want to update your personal
            information for other VA benefits, you can do that from your
            profile.
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
          <AddressValidationModal />
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
            const required = (addressSchema.required || []).filter(
              field => field !== 'state',
            );

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
      },
    },
    'ui:validations': [validateAddressWithAPI],
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      'view:subHeadings': {
        type: 'object',
        properties: {},
      },
      [formFields.viewMailingAddress]: {
        type: 'object',
        required: [formFields.address],
        properties: {
          [formFields.livesOnMilitaryBase]: {
            type: 'boolean',
          },
          addressValidated: {
            type: 'boolean',
            default: false,
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

export default newMailingAddress33;
