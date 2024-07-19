import React, { useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { Toggler } from 'platform/utilities/feature-toggles';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import recordEvent from 'platform/monitoring/record-event';

import { showNewHlrContent } from '../utils/helpers';
import { validateConferenceChoice } from '../validations';
import { errorMessages } from '../constants';

import { checkValidations } from '../../shared/validations';
import sharedErrorMessages from '../../shared/content/errorMessages';

import {
  informalConferenceTitle,
  InformalConferenceDescription,
  informalConferenceLabels,
  newInformalConferenceLabels,
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
  if (showNewHlrContent(data)) {
    if (
      ['me', 'rep'].includes(data.informalConference) ||
      data.informalConferenceChoice === 'yes'
    ) {
      informalConference = 'yes';
    } else if (data.informalConference === 'no') {
      informalConference = 'no';
    }
  }
  const [conference, setConference] = useState(informalConference);
  const [hasError, setHasError] = useState(null);

  const checkErrors = (formData = data) => {
    const error = checkValidations(
      [validateConferenceChoice],
      conference,
      formData,
    );
    const errorMsg = error?.[0] || null;
    setHasError(errorMsg);
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
      if (conference && !checkErrors()) {
        goForward(data);
      }
    },
    onSelectionOriginal: event => {
      const { value } = event?.detail || {};
      if (value) {
        const formData = {
          ...data,
          informalConference: event.detail?.value,
        };
        update(formData, value, informalConferenceLabels[value]);
      }
    },
    onSelectionNew: event => {
      const { value } = event?.detail || {};
      if (value) {
        const formData = {
          ...data,
          informalConferenceChoice: event.detail?.value,
        };
        update(formData, value, newInformalConferenceLabels[value]);
      }
    },
  };

  const navButtons = onReviewPage ? (
    <va-button
      text={updateButtonText}
      onClick={updatePage}
      class="vads-u-margin-bottom--4"
    />
  ) : (
    <>
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} submitToContinue />
      {contentAfterButtons}
    </>
  );

  return (
    <div className="vads-u-margin-y--2">
      <form onSubmit={handlers.onSubmit}>
        <div name="topScrollElement" />
        <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
          <Toggler.Enabled>
            {InformalConferenceDescription}
            <VaRadio
              class="vads-u-margin-y--2"
              label={informalConferenceTitle}
              error={hasError && sharedErrorMessages.requiredYesNo}
              onVaValueChange={handlers.onSelectionNew}
              required
            >
              <va-radio-option
                id="yes-conference"
                label={newInformalConferenceLabels.yes}
                value="yes"
                name="informalConference"
                // v2 choices = 'me', 'rep', & 'no'; this maintains data
                checked={conference === 'yes'}
                description={informalConferenceDescriptions.yes}
              />
              <va-radio-option
                id="no-conference"
                label={newInformalConferenceLabels.no}
                value="no"
                name="informalConference"
                checked={conference === 'no'}
                description={informalConferenceDescriptions.no}
              />
            </VaRadio>
          </Toggler.Enabled>
          <Toggler.Disabled>
            <VaRadio
              class="vads-u-margin-y--2"
              label={informalConferenceTitle}
              labelHeaderLevel="3"
              error={hasError && errorMessages.informalConferenceContactChoice}
              onVaValueChange={handlers.onSelectionOriginal}
              required
            >
              <va-radio-option
                id="no-conference2"
                label={informalConferenceLabels.no}
                value="no"
                name="informalConference"
                checked={conference === 'no'}
              />
              <va-radio-option
                id="me-conference2"
                label={informalConferenceLabels.me}
                value="me"
                name="informalConference"
                checked={conference === 'me'}
              />
              <va-radio-option
                id="rep-conference2"
                label={informalConferenceLabels.rep}
                value="rep"
                name="informalConference"
                checked={conference === 'rep'}
              />
            </VaRadio>
          </Toggler.Disabled>
        </Toggler>

        {navButtons}
      </form>
    </div>
  );
};

InformalConference.propTypes = customPageProps996;

export default InformalConference;
