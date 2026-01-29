import React, { useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import recordEvent from 'platform/monitoring/record-event';
import {
  EVIDENCE_VA_DETAILS_URL,
  HAS_VA_EVIDENCE,
  HAS_PRIVATE_EVIDENCE,
} from '../../constants';
import { customPageProps995 } from '../../../shared/props';
import { focusFirstError } from '../../../shared/utils/focus';

export const privateRecordsPromptTitle =
  'Do you want us to get your private (non-VA) provider or VA Vet Center medical records?';

export const privateRecordsPromptError =
  'Select if we should get your private (non-VA) medical records';

/**
 * This page is needed to make the back button on this page to to the last
 */
const PrivatePrompt = ({
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
        [HAS_PRIVATE_EVIDENCE]: val,
      });
      setError(null);
      recordEvent({
        event: 'int-radio-button-option-click',
        'radio-button-label': privateRecordsPromptTitle,
        'radio-button-optionLabel': val ? 'Yes' : 'No',
        'radio-button-required': true,
      });
    },
    onGoBack: () => {
      if (data[HAS_VA_EVIDENCE]) {
        // go to last VA location entry, but only if they requested it
        goToPath(`/${EVIDENCE_VA_DETAILS_URL}?index=${locations.length - 1}`);
      } else {
        // go to request VA evidence page
        goBack();
      }
    },
    onGoForward: () => {
      if (typeof data[HAS_PRIVATE_EVIDENCE] === 'undefined') {
        setError(privateRecordsPromptError);
        setTimeout(focusFirstError);
      } else {
        setError(null);
        goForward(data);
      }
    },
  };

  return (
    <form onSubmit={handlers.onGoForward}>
      <VaRadio
        error={error}
        form-heading={privateRecordsPromptTitle}
        form-heading-level="3"
        onVaValueChange={handlers.onSelected}
        required
        use-forms-pattern="single"
      >
        <va-radio-option
          label="Yes"
          name="private"
          value="y"
          checked={data[HAS_PRIVATE_EVIDENCE]}
          description="We'll ask you to provide details for your private providers to authorize the release of your medical records to VA."
        />
        <va-radio-option
          label="No"
          name="private"
          value="n"
          checked={data[HAS_PRIVATE_EVIDENCE] === false}
          description="You can upload your private provider records later in this form, or you can authorize us to get them after you submit this application."
        />
        <div slot="form-description" className={error ? 'error-bolding' : ''}>
          <p>
            You have private provider or VA Vet Center medical records if you
            were treated by a:
          </p>
          <ul>
            <li>Private provider</li>
            <li>Veterans Choice Program provider</li>
            <li>
              VA Vet Center (this is different from VA-paid community care)
            </li>
          </ul>
          <p className="vads-u-margin-bottom--0">
            <strong>Note:</strong> A Disability Benefits Questionnaire (DBQ) is
            an example of a private medical record.
          </p>
        </div>
      </VaRadio>
      <div className="vads-u-margin-top--3">
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handlers.onGoBack}
          goForward={handlers.onGoForward}
          useWebComponents
        />
        {contentAfterButtons}
      </div>
    </form>
  );
};

PrivatePrompt.propTypes = customPageProps995;

export default PrivatePrompt;
