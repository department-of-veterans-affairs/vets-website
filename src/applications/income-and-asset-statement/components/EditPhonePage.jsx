import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { isValidPhone } from 'platform/forms/validations';
import { Title } from '~/platform/forms-system/src/js/web-component-patterns/titlePattern';
import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';

/**
 * This component allows the user to edit their phone number.
 * Based on the value of the input (`phone`), the component updates the `phone`
 * field in the form data. Validation ensures the entered value is a valid U.S. phone number,
 * but the user may leave the field blank if they prefer. The user can choose to update the phone
 * number or cancel and return to the contact information page.
 */

const EditPhonePage = props => {
  const { formData = {}, goToPath, setFormData } = props;
  const { phone = '' } = formData;
  const [fieldData, setFieldData] = useState(phone);
  const [error, setError] = useState(null);

  const validatePhone = value => {
    if (!value) return null;
    if (!isValidPhone(value)) {
      return 'Enter a valid 10-digit U.S. phone number';
    }
    return null;
  };

  const returnPath = '/contact/information';

  const handlers = {
    onInput: event => {
      const { value } = event.target;
      setFieldData(value);
      setError(validatePhone(value));
    },
    onUpdate: e => {
      e.preventDefault();
      const validationError = validatePhone(fieldData);
      setError(validationError); // A11y To do: Move focus back to field when error is true

      if (validationError) return;

      setFormData({ ...formData, phone: fieldData || '' });
      goToPath(returnPath);
    },
    onCancel: () => {
      goToPath(returnPath);
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
          <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
            <div className="small-6 medium-5 columns">
              <ProgressButton
                onButtonClick={handlers.onCancel}
                buttonText="Cancel"
                buttonClass="usa-button-secondary"
              />
            </div>
            <div className="small-6 medium-5 end columns">
              <ProgressButton
                buttonText="Update"
                onButtonClick={handlers.onUpdate}
                buttonClass="usa-button-primary"
                ariaLabel="Update phone number"
              />
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
};

EditPhonePage.propTypes = {
  formData: PropTypes.shape({
    phone: PropTypes.string,
  }),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPhonePage);
