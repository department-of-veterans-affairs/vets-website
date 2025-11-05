import React, { useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import recordEvent from 'platform/monitoring/record-event';
import { scrollToFirstError } from 'platform/utilities/scroll';

import { validateConferenceChoice } from '../validations';

import { checkValidations } from '../../shared/validations';
import sharedErrorMessages from '../../shared/content/errorMessages';

import {
  informalConferenceTitle,
  InformalConferenceDescription,
  informalConferenceLabel,
  informalConferenceLabels,
  informalConferenceDescriptions,
  updateButtonText,
} from '../content/InformalConference';
import { customPageProps996 } from '../../shared/props';

/**
 * This component renders 2 different pages:
 * - Original informalConference page: me, rep & no choices
 * - New informalConference page: me or rep; yes & no moved to
 *   informalConferenceChoice page
 */
export const InformalConference = ({
  data,
  goBack,
  goForward,
  onReviewPage,
  updatePage,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  let { informalConference } = data;
  // Original informalConference ('no', 'me' or 'rep') is split into two pages;
  // informalConferenceChoice ('yes' or 'no') + informalConference ('me' or 'rep')
  // So if we have a SiP that doesn't have an informalConferenceChoice, we need
  // to determine it here
  if (
    data.informalConferenceChoice === 'yes' ||
    ['me', 'rep'].includes(data.informalConference)
  ) {
    informalConference = 'yes';
  } else if (
    data.informalConferenceChoice === 'no' ||
    data.informalConference === 'no'
  ) {
    informalConference = 'no';
  }
  const [conference, setConference] = useState(informalConference || '');
  const [hasError, setHasError] = useState(null);

  const checkErrors = (formData = data) => {
    const error = checkValidations(
      [validateConferenceChoice],
      conference,
      formData,
    );
    const errorMsg = error?.[0] || null;
    setHasError(errorMsg);
    if (errorMsg) {
      scrollToFirstError({ focusOnAlertRole: true });
    }
    return errorMsg;
  };

  // Update form data after radio selection
  const update = (formData, value, label) => {
    setConference(value);
    setFormData(formData);
    // setFormData lags a little, so check updated data
    checkErrors(formData);
    recordEvent({
      event: 'int-radio-button-option-click',
      'radio-button-label': informalConferenceTitle,
      'radio-button-optionLabel': label,
      'radio-button-required': false,
    });
  };

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (!checkErrors(data) && conference !== '') {
        goForward(data);
      }
    },
    onUpdatePage: event => {
      if (!checkErrors(data) && conference !== '') {
        updatePage(event);
      }
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        const conf = data.informalConference;
        const formData = {
          ...data,
          informalConferenceChoice: value,
          informalConference: value !== 'no' && conf === 'no' ? '' : conf,
        };
        update(formData, value, informalConferenceLabels[value]);
      }
    },
  };

  const navButtons = onReviewPage ? (
    <va-button
      text={updateButtonText}
      onClick={handlers.onUpdatePage}
      class="vads-u-margin-bottom--4"
    />
  ) : (
    <>
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} submitToContinue useWebComponents />
      {contentAfterButtons}
    </>
  );

  return (
    <div className="vads-u-margin-y--2">
      <form onSubmit={handlers.onSubmit}>
        <div name="topScrollElement" />
        {InformalConferenceDescription}

        <VaRadio
          class="vads-u-margin-y--2"
          label={informalConferenceLabel}
          error={hasError && sharedErrorMessages.requiredYesNo}
          onVaValueChange={handlers.onSelection}
          required
        >
          <va-radio-option
            id="yes-conference"
            label={informalConferenceLabels.yes}
            value="yes"
            name="informalConferenceChoice"
            checked={data.informalConferenceChoice === 'yes'}
            description={informalConferenceDescriptions.yes}
          />
          <va-radio-option
            id="no-conference"
            label={informalConferenceLabels.no}
            value="no"
            name="informalConferenceChoice"
            checked={data.informalConferenceChoice === 'no'}
            description={informalConferenceDescriptions.no}
          />
        </VaRadio>

        {navButtons}
      </form>
    </div>
  );
};

InformalConference.propTypes = customPageProps996;

export default InformalConference;
