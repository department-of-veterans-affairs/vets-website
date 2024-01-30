import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { scrollTo, waitForRenderThenFocus } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

import {
  authorizationLabel,
  authorizationAlertContent,
  authorizationHeader,
  authorizationInfo,
} from '../content/evidencePrivateRecordsAuthorization';

const EvidencePrivateRecordsAuthorization = ({
  data = {},
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [hasError, setHasError] = useState(false);
  useEffect(
    () => {
      if (hasError) {
        recordEvent({
          event: 'visible-alert-box',
          'alert-box-type': 'warning',
          'alert-box-heading':
            'Authorize your doctor to release your records or upload them yourself',
          'error-key': 'not_authorizing_records_release',
          'alert-box-full-width': false,
          'alert-box-background-only': false,
          'alert-box-closeable': false,
          'reason-for-alert': 'Not authorizing records release',
        });
      }
    },
    [hasError],
  );

  const focusOnAlert = () => {
    scrollTo('topScrollElement');
    waitForRenderThenFocus('va-alert h3');
  };

  const handlers = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();
    },
    onAnchorClick: () => {
      const checkbox = $('va-checkbox');
      scrollTo(checkbox);
      waitForRenderThenFocus('input', checkbox.shadowRoot);
    },
    onChange: event => {
      const { checked } = event.target;
      setFormData({ ...data, privacyAgreementAccepted: checked });
      setHasError(!checked);
      if (!checked) {
        focusOnAlert();
      }
    },
    onGoForward: () => {
      // Required checkbox
      if (data.privacyAgreementAccepted) {
        setHasError(false);
        goForward(data);
      } else {
        setHasError(true);
        focusOnAlert();
      }
    },
  };

  return (
    <>
      <form onSubmit={handlers.onSubmit}>
        <va-alert status="error" visible={hasError} uswds>
          {hasError && authorizationAlertContent(handlers.onAnchorClick)}
        </va-alert>
        {authorizationHeader}
        <VaCheckbox
          id="privacy-agreement"
          label={authorizationLabel}
          checked={data.privacyAgreementAccepted}
          onVaChange={handlers.onChange}
          aria-describedby="authorize-text"
          required
          enable-analytics
          uswds
        >
          <div slot="description">{authorizationInfo}</div>
        </VaCheckbox>
        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          <FormNavButtons goBack={goBack} goForward={handlers.onGoForward} />
          {contentAfterButtons}
        </div>
      </form>
    </>
  );
};

EvidencePrivateRecordsAuthorization.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    privacyAgreementAccepted: PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
};

export default EvidencePrivateRecordsAuthorization;
