import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { getFormatedPhone } from '../utils/contactInfo';
import { missingPrimaryPhone } from '../validations';
import { checkValidations } from '../validations/issues';
import { PRIMARY_PHONE, errorMessages } from '../constants';

export const PrimaryPhone = ({
  data,
  goBack,
  goForward,
  onReviewPage,
  // updatePage,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [primary, setPrimary] = useState(data?.[PRIMARY_PHONE] || '');
  const [hasError, setHasError] = useState(null);

  const { homePhone = {}, mobilePhone = {} } = data?.veteran || {};

  const checkErrors = (formData = data) => {
    const error = checkValidations([missingPrimaryPhone], primary, formData);
    setHasError(error?.[0] || null);
  };

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      checkErrors();
      if (primary && !hasError) {
        goForward(data);
      }
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        setPrimary(value);
        const formData = { ...data, [PRIMARY_PHONE]: event.detail?.value };
        setFormData(formData);
        // setFormData lags a little, so check updated data
        checkErrors(formData);
      }
    },
  };

  const navButtons = onReviewPage ? (
    <button type="submit">Review update button</button>
  ) : (
    <>
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} submitToContinue />
      {contentAfterButtons}
    </>
  );

  // Using data-number + css to show option hint text, but only until the
  // va-radio-option gets hint text added
  return (
    <div className="vads-u-margin-y--2">
      <form onSubmit={handlers.onSubmit}>
        <VaRadio
          class="vads-u-margin-y--2"
          label="What is your primary phone number?"
          hint="We may need to contact you to clarify issues related to your Supplemental Claim."
          error={hasError && errorMessages.missingPrimaryPhone}
          onVaValueChange={handlers.onSelection}
          required
        >
          <va-radio-option
            id="home-phone"
            label="Home phone number"
            value="home"
            name="primary"
            checked={primary === 'home'}
            data-number={getFormatedPhone(homePhone)}
          />
          <va-radio-option
            id="mobile-phone"
            label="Mobile phone number"
            value="mobile"
            name="primary"
            checked={primary === 'mobile'}
            data-number={getFormatedPhone(mobilePhone)}
          />
        </VaRadio>
        {navButtons}
      </form>
    </div>
  );
};

PrimaryPhone.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    veteran: PropTypes.shape({
      homePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
      mobilePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
    }).isRequired,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  // updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default PrimaryPhone;
