import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { isValidPhone } from 'platform/forms/validations';
import { Title } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/**
 * This component allows the user to edit their phone number.
 * Based on the value of the input (`phone`), the component updates the `phone`
 * field in the form data. Validation ensures the entered value is a valid U.S. phone number,
 * but the user may leave the field blank if they prefer. The user can choose to update the phone
 * number or cancel and return to the contact information page.
 */

const EditPhonePage = ({ data, goToPath, setFormData }) => {
  const { phone = '' } = data || {};
  const [fieldData, setFieldData] = useState(phone);
  const [error, setError] = useState(null);

  const validatePhone = value => {
    if (!value) return null;
    if (!isValidPhone(value)) {
      return 'Enter a valid 10-digit U.S. phone number';
    }
    return null;
  };

  const returnPath = '/veteran-contact-information';
  const returnToPath = () => {
    goToPath(
      sessionStorage.getItem('onReviewPage')
        ? '/review-and-submit'
        : returnPath,
    );
  };

  const handlers = {
    onInput: event => {
      const { value } = event.target;
      setFieldData(value);
      setError(validatePhone(value));
    },
    onUpdate: e => {
      e.preventDefault();
      const validationError = validatePhone(fieldData);
      setError(validationError);
      if (validationError) return;

      setFormData({
        ...data,
        phone: fieldData || '',
      });
      returnToPath();
    },
    onCancel: () => {
      returnToPath();
    },
  };

  return (
    <>
      <form onSubmit={handlers.onUpdate} noValidate>
        <fieldset className="vads-u-margin-y--2">
          <legend className="schemaform-block-title">
            <Title title="Edit phone number" />
          </legend>
          <va-text-input
            label="Phone number"
            type="tel"
            inputmode="tel"
            id="root_phone"
            name="root_phone"
            hint="Enter a 10-digit phone number"
            value={fieldData}
            onInput={handlers.onInput}
            error={error}
          />

          <VaButtonPair
            class="vads-u-margin-top--2"
            primaryLabel="Update phone number"
            secondaryLabel="Cancel editing phone number"
            onPrimaryClick={handlers.onUpdate}
            onSecondaryClick={handlers.onCancel}
            update
          />
        </fieldset>
      </form>
    </>
  );
};

EditPhonePage.propTypes = {
  data: PropTypes.shape({
    phone: PropTypes.string,
  }),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default EditPhonePage;
