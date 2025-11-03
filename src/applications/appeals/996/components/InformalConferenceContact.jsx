import React, { useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import recordEvent from 'platform/monitoring/record-event';
import { scrollToFirstError } from 'platform/utilities/scroll';

import { validateConferenceContactChoice } from '../validations';
import { errorMessages } from '../constants';

import { checkValidations } from '../../shared/validations';

import { updateButtonText } from '../content/InformalConference';
import {
  informalConferenceContactTitle,
  informalConferenceContactInfo,
  informalConferenceContactLabel,
  informalConferenceContactOptions,
  informalConferenceContactOptionDescriptions,
} from '../content/InformalConferenceContact';
import { customPageProps996 } from '../../shared/props';

/**
 * InformalConferenceContact was added for the newer HLR content changes. The
 * original informalConference allowed choosing me, rep or no; but the newer
 * page only allows choosing yes or no (to request a conference). This page was
 * split out to accept me or rep - choosing who to call for the informal
 * conference
 */
export const InformalConferenceContact = ({
  data,
  goBack,
  goForward,
  onReviewPage,
  updatePage,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [conference, setConference] = useState(data?.informalConference || '');
  const [hasError, setHasError] = useState(null);

  const checkErrors = (formData = data) => {
    const error = checkValidations(
      [validateConferenceContactChoice],
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

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (!checkErrors() && conference !== '') {
        goForward(data);
      }
    },
    onUpdatePage: event => {
      if (!checkErrors() && conference !== '') {
        updatePage(event);
      }
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        setConference(value);
        const formData = { ...data, informalConference: event.detail?.value };
        setFormData(formData);
        // setFormData lags a little, so check updated data
        checkErrors(formData);
        recordEvent({
          event: 'int-radio-button-option-click',
          'radio-button-label': informalConferenceContactTitle,
          'radio-button-optionLabel': informalConferenceContactOptions[value],
          'radio-button-required': false,
        });
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
        <h3>{informalConferenceContactTitle}</h3>
        {informalConferenceContactInfo}
        <VaRadio
          class="vads-u-margin-y--2"
          label={informalConferenceContactLabel}
          error={hasError && errorMessages.informalConferenceContactChoice}
          onVaValueChange={handlers.onSelection}
          required
        >
          <va-radio-option
            id="yes-conference"
            label={informalConferenceContactOptions.me}
            value="me"
            name="informalConference"
            checked={conference === 'me'}
            description={informalConferenceContactOptionDescriptions.me}
          />
          <va-radio-option
            id="no-conference"
            label={informalConferenceContactOptions.rep}
            value="rep"
            name="informalConference"
            checked={conference === 'rep'}
            description={informalConferenceContactOptionDescriptions.rep}
          />
        </VaRadio>
        {navButtons}
      </form>
    </div>
  );
};

InformalConferenceContact.propTypes = customPageProps996;

export default InformalConferenceContact;
