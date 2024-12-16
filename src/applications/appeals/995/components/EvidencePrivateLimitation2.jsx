import React, { useState } from 'react';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/ui';

import { content } from '../content/evidencePrivateLimitation';

import { customPageProps995 } from '../../shared/props';

const EvidencePrivateLimitation2 = ({
  data = {},
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [hasError, setHasError] = useState(null);

  const handlers = {
    onInput: event => {
      setFormData({ ...data, limitedConsent: event.target.value });
      if (event.target.value) {
        setHasError(null);
      }
    },
    onSubmit: event => {
      event.preventDefault();
      if (!data.limitedConsent) {
        setHasError(true);
        scrollToFirstError({ focusOnAlertRole: true });
      } else {
        setHasError(null);
        goForward(data);
      }
    },
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <va-textarea
        class="resize-y"
        label-header-level="3"
        label={content.textAreaTitle}
        hint={content.textAreaHint}
        name="limitation"
        onInput={handlers.onInput}
        value={data.limitedConsent}
        error={hasError && content.errorMessage}
        required
      />
      <p />
      <div className="vads-u-margin-top--4">
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={handlers.onSubmit}
          submitToContinue
        />
        {contentAfterButtons}
      </div>
    </form>
  );
};

EvidencePrivateLimitation2.propTypes = customPageProps995;

export default EvidencePrivateLimitation2;
