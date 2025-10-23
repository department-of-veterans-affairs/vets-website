import React, { useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import recordEvent from 'platform/monitoring/record-event';

import { content } from '../../../995/content/primaryPhone';
import { customPageProps } from '../../../shared/props';

export const PrimaryPhone = ({
  data,
  goBack,
  goForward,
  onReviewPage,
  updatePage,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [primary, setPrimary] = useState(data?.['view:primaryPhone'] || '');
  // const [hasError, setHasError] = useState(null);

  // const checkErrors = (formData = data) => {
  //   const error = checkValidations([missingPrimaryPhone], primary, formData);
  //   setHasError(error?.[0] || null);
  // };

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      // checkErrors();
      // if (primary && !hasError) {
      //   goForward(data);
      // }
      goForward(data);
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        setPrimary(value);
        const formData = {
          ...data,
          'view:primaryPhone': event.detail?.value,
        };
        setFormData(formData);
        // setFormData lags a little, so check updated data
        // checkErrors(formData);
        recordEvent({
          event: 'int-radio-button-option-click',
          'radio-button-label': content.label,
          'radio-button-optionLabel': content[`${value}Label`],
          'radio-button-required': false,
        });
      }
    },
  };

  const navButtons = onReviewPage ? (
    <va-button text={content.update} onClick={updatePage} uswds />
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
        <div name="topScrollElement" />
        <VaRadio
          class="vads-u-margin-y--2"
          label="Which is your primary phone number?"
          label-header-level="1"
          // error={hasError && errorMessages.missingPrimaryPhone}
          onVaValueChange={handlers.onSelection}
          // required
          uswds
        >
          <va-radio-option
            id="mobile-phone"
            label="Mobile: 123-456-7890"
            value="mobile"
            name="primary"
            checked={primary === 'mobile'}
            uswds
          />
          <va-radio-option
            id="home-phone"
            label="Home: 098-765-4321"
            value="home"
            name="primary"
            checked={primary === 'home'}
            uswds
          />
        </VaRadio>
        {navButtons}
      </form>
    </div>
  );
};

PrimaryPhone.propTypes = customPageProps;

export default PrimaryPhone;
