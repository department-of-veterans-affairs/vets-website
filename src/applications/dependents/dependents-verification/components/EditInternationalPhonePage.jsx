import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { Title } from '~/platform/forms-system/src/js/web-component-patterns/titlePattern';
import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';

const EditInternationalPhonePage = props => {
  const { formData = {}, goToPath, setFormData } = props;
  const { veteranContactInformation = {} } = formData;
  const { internationalPhone = '' } = veteranContactInformation;

  const [fieldData, setFieldData] = useState(internationalPhone);
  const [error, setError] = useState(null);

  const validateIntlPhone = value => {
    if (!value?.trim()) {
      return 'Enter a valid international phone number';
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
      setError(validateIntlPhone(value));
    },
    onUpdate: e => {
      e.preventDefault();
      const validationError = validateIntlPhone(fieldData);
      setError(validationError);
      if (validationError) return;

      setFormData({
        ...formData,
        veteranContactInformation: {
          ...veteranContactInformation,
          internationalPhone: fieldData,
        },
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
          <Title title="Edit international phone number" />
        </legend>
        <va-text-input
          label="International phone number"
          id="root_internationalPhone"
          name="root_internationalPhone"
          value={fieldData}
          onInput={handlers.onInput}
          error={error}
          hint="Enter a phone number including the country code (e.g., +44 20 1234 5678)"
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
              ariaLabel="Update international phone number"
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};

EditInternationalPhonePage.propTypes = {
  formData: PropTypes.shape({
    veteranContactInformation: PropTypes.shape({
      internationalPhone: PropTypes.string,
    }),
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
)(withRouter(EditInternationalPhonePage));
