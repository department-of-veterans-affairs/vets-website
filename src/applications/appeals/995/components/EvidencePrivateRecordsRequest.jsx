import React, { useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

import { EVIDENCE_VA_PATH, EVIDENCE_VA, EVIDENCE_PRIVATE } from '../constants';

import {
  privateRecordsRequestTitle,
  privateRecordsRequestInfo,
  privateRecordsRadioDescription,
} from '../content/evidencePrivateRecordsRequest';

import { customPageProps995 } from '../../shared/props';
import errorMessages from '../../shared/content/errorMessages';

/**
 * This page is needed to make the back button on this page to to the last
 */
const EvidencePrivateRequest = ({
  data = {},
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { locations = [] } = data;
  const [error, setError] = useState(null);

  const handlers = {
    onSelected: event => {
      const val = event.detail.value === 'y';
      setFormData({
        ...data,
        [EVIDENCE_PRIVATE]: val,
      });
      setError(null);
      recordEvent({
        event: 'int-radio-button-option-click',
        'radio-button-label': privateRecordsRequestTitle,
        'radio-button-optionLabel': val ? 'Yes' : 'No',
        'radio-button-required': true,
      });
    },
    onGoBack: () => {
      if (data[EVIDENCE_VA]) {
        // go to last VA location entry, but only if they requested it
        goToPath(`/${EVIDENCE_VA_PATH}?index=${locations.length - 1}`);
      } else {
        // go to request VA evidence page
        goBack();
      }
    },
    onGoForward: () => {
      if (typeof data[EVIDENCE_PRIVATE] === 'undefined') {
        setError(errorMessages.requiredYesNo);
        focusElement('va-radio');
      } else {
        setError(null);
        goForward(data);
      }
    },
  };

  return (
    <form onSubmit={handlers.onGoForward}>
      <VaRadio
        label={privateRecordsRequestTitle}
        label-header-level="3"
        onVaValueChange={handlers.onSelected}
        required
        error={error}
        hint={privateRecordsRequestInfo}
      >
        <va-radio-option
          label="Yes"
          name="private"
          value="y"
          checked={data[EVIDENCE_PRIVATE]}
          description={privateRecordsRadioDescription.yes}
        />
        <va-radio-option
          label="No"
          name="private"
          value="n"
          checked={data[EVIDENCE_PRIVATE] === false}
          description={privateRecordsRadioDescription.no}
        />
      </VaRadio>
      <div className="vads-u-margin-top--4">
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handlers.onGoBack}
          goForward={handlers.onGoForward}
        />
        {contentAfterButtons}
      </div>
    </form>
  );
};

EvidencePrivateRequest.propTypes = customPageProps995;

export default EvidencePrivateRequest;
