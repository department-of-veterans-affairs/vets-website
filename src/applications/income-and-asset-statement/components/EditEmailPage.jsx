import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { isValidEmail } from 'platform/forms/validations';
import { Title } from '~/platform/forms-system/src/js/web-component-patterns/titlePattern';
import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';

/**
 * This component allows the user to edit their email address.
 * Based on the value of the input (`email`), the component updates the `email`
 * field in the form data. Validation ensures the entered value is a properly formatted email address.
 * The user can choose to update the email or cancel and return to the contact information page.
 */

const EditEmailPage = props => {
  const { formData = {}, goToPath, setFormData } = props;
  const { email = '' } = formData;
  const [fieldData, setFieldData] = useState(email);
  const [error, setError] = useState(null);

  const validateEmail = value => {
    if (!isValidEmail(value)) {
      return 'Enter a valid email address without spaces using this format: email@domain.com';
    }
    return null;
  };

  const returnPath = '/contact/information';

  const handlers = {
    onInput: event => {
      const { value } = event.target;
      setFieldData(value);
      setError(validateEmail(value));
    },
    onUpdate: e => {
      e.preventDefault();
      if (!isValidEmail(fieldData)) return; // A11y To Do: Move focus back to field when error is true
      setFormData({ ...formData, email: fieldData });
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
            <Title title="Edit email" />
          </legend>
          <va-text-input
            label="Email address"
            type="email"
            inputmode="email"
            id="root_email"
            name="root_email"
            hint="We may use your contact information so we can get in touch with you if we have questions about your application."
            value={fieldData}
            onInput={handlers.onInput}
            error={error}
            required
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
                ariaLabel="Update email address"
              />
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
};

EditEmailPage.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string,
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
)(EditEmailPage);
