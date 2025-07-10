import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { Title } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const EditInternationalPhonePage = props => {
  const { formData = {}, goToPath, setFormData } = props;
  const { internationalPhone = '' } = formData;

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
        internationalPhone: fieldData,
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

        <VaButtonPair
          class="vads-u-margin-top--2"
          primaryLabel="Update international phone number"
          secondaryLabel="Cancel editing international phone number"
          onPrimaryClick={handlers.onUpdate}
          onSecondaryClick={handlers.onCancel}
          update
        />
      </fieldset>
    </form>
  );
};

EditInternationalPhonePage.propTypes = {
  formData: PropTypes.shape({
    internationalPhone: PropTypes.string,
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

export { EditInternationalPhonePage };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(EditInternationalPhonePage));
