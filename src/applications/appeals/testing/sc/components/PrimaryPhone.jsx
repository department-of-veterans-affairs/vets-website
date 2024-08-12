import React, { useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import recordEvent from 'platform/monitoring/record-event';

import { getFormattedPhone } from '../utils/contactInfo';
import { missingPrimaryPhone } from '../validations';
import {
  PRIMARY_PHONE,
  PRIMARY_PHONE_TYPES,
  errorMessages,
} from '../constants';
import { content } from '../content/primaryPhone';
import { checkValidations } from '../../../shared/validations';
import { customPageProps995 } from '../../../shared/props';

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
  const [primary, setPrimary] = useState(data?.[PRIMARY_PHONE] || '');
  const [hasError, setHasError] = useState(null);

  const { veteran } = data || {};

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
          label={content.label}
          label-header-level="3"
          hint="We may need to contact you if we have questions about your Supplemental Claim."
          error={hasError && errorMessages.missingPrimaryPhone}
          onVaValueChange={handlers.onSelection}
          required
          uswds
        >
          {PRIMARY_PHONE_TYPES.map(type => (
            <va-radio-option
              key={type}
              id={`${type}-phone`}
              label={content[`${type}Label`]}
              value={type}
              name="primary"
              checked={primary === type}
              description={getFormattedPhone(veteran?.[`${type}Phone`])}
              uswds
            />
          ))}
        </VaRadio>
        {navButtons}
      </form>
    </div>
  );
};

PrimaryPhone.propTypes = customPageProps995;

export default PrimaryPhone;
