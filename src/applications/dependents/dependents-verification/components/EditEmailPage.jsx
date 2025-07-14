import React, { useState } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { isValidEmail } from 'platform/forms/validations';
import { Title } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import EditPageButtons from './EditPageButtons';

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
      setError(validateEmail(value));
    },
    onUpdate: e => {
      e.preventDefault();
      const validationError = validateEmail(fieldData);
      setError(validationError);
      if (validationError) return;

      setFormData({
        ...formData,
        email: fieldData,
      });

      returnToPath();
    },
    onCancel: () => {
      returnToPath();
    },
  };

  return (
    <form onSubmit={handlers.onUpdate} noValidate>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <Title title="Edit email address" />
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
        <EditPageButtons handlers={handlers} pageName="Email address" />
      </fieldset>
    </form>
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

export { EditEmailPage };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(EditEmailPage));
