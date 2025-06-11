import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format, fromUnixTime } from 'date-fns';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import recordEvent from 'platform/monitoring/record-event';

import {
  authorizationLabel,
  authorizationAlertContent,
  authorizationHeader,
  authorizationInfo,
} from '../content/evidencePrivateRecordsAuthorization';

import { customPageProps995 } from '../../shared/props';

const EvidencePrivateRecordsAuthorization = ({
  data = {},
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const appLastUpdated = useSelector(
    state => state?.form?.loadedData?.metadata?.lastUpdated,
  );

  console.log('appLastUpdated', appLastUpdated);

  if (appLastUpdated) {
    console.log(format(fromUnixTime(appLastUpdated), 'yyyy-MM-dd HH:mm:ss'));
  }

  const CUTOFF_DATE_4142 = '2025-06-30 19:00:00';

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

  const shouldShowLegaleseBanner = () => {
    return true;
  };

  return (
    <>
      <form onSubmit={handlers.onSubmit}>
        <va-alert status="error" visible={hasError} uswds role="alert">
          {hasError && authorizationAlertContent(handlers.onAnchorClick)}
        </va-alert>
        {authorizationHeader}
        <Toggler toggleName={Toggler.TOGGLE_NAMES.decisionReviews4142Banner}>
          <Toggler.Enabled>
            <va-banner
              class="vads-u-display--block vads-u-margin-y--3"
              headline="Action needed: Review authorization"
              role="alert"
              type="warning"
              visible={shouldShowLegaleseBanner}
            >
              <p className="vads-u-margin-bottom--0">
                We’ve updated the legal statement on this page. You previously
                gave us permission to request your non-VA medical records.
                Review this page and, if you still want us to contact your
                provider for your records, check the box at the bottom to
                authorize.
              </p>
            </va-banner>
          </Toggler.Enabled>
        </Toggler>
        <VaCheckbox
          id="privacy-agreement"
          name="privacy-agreement"
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

EvidencePrivateRecordsAuthorization.propTypes = customPageProps995;

export default EvidencePrivateRecordsAuthorization;
