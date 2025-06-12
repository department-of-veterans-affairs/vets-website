import React, { useState, useEffect } from 'react';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import recordEvent from 'platform/monitoring/record-event';
import { title4142 } from '../../content/title';
import { AUTHORIZATION_LABEL } from '../../constants';
import AuthorizationAlert from './AuthorizationAlert';
import { customPageProps995 } from '../../../shared/props';

const Authorization = ({
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
        {hasError && (
          <AuthorizationAlert
            hasError={hasError}
            onAnchorClick={handlers.onAnchorClick}
          />
        )}
        <h3>{title4142}</h3>
        <VaCheckbox
          id="privacy-agreement"
          name="privacy-agreement"
          label={AUTHORIZATION_LABEL}
          checked={data.privacyAgreementAccepted}
          onVaChange={handlers.onChange}
          aria-describedby="authorize-text"
          required
          enable-analytics
          uswds
        >
          <div slot="description">
            <>
              <p id="authorize-text">
                I voluntarily authorize and request disclosure (including paper,
                oral, and electronic interchange) of: All my medical records;
                including information related to my ability to perform tasks of
                daily living. This includes specific permission to release:
              </p>

              <ol className="vads-u-margin-left--0 vads-u-padding-left--2">
                <li>
                  All records and other information regarding my treatment,
                  hospitalization, and outpatient care for my impairment(s)
                  including, but not limited to:
                  <ul>
                    <li>
                      Psychological, psychiatric, or other mental impairment(s)
                      excluding "psychotherapy notes" as defined in 45 C.F.R.
                      §164.501,
                    </li>
                    <li>Drug abuse, alcoholism, or other substance abuse,</li>
                    <li>Sickle cell anemia,</li>
                    <li>
                      Records which may indicate the presence of a communicable
                      or non- communicable disease; and tests for or records of
                      HIV/AIDS,
                    </li>
                    <li>
                      Gene-related impairments (including genetic test results)
                    </li>
                  </ul>
                </li>
                <li>
                  Information about how my impairment(s) affects my ability to
                  complete tasks and activities of daily living, and affects my
                  ability to work.
                </li>
                <li>
                  Information created within 12 months after the date this
                  authorization is signed in Item 11, as well as past
                  information.
                </li>
              </ol>

              <p>
                You should not complete this form unless you want the VA to
                obtain private treatment records on your behalf. If you have
                already provided these records or intend to obtain them
                yourself, there is no need to fill out this form. Doing so will
                lengthen your claim processing time.
              </p>
              <p>
                In accordance with 38 C.F.R. §3.159(c), "VA will not pay any
                fees charged by a custodian to provide records requested."
              </p>
              <p>
                I hereby authorize the sources listed in Section IV, to release
                any information that may have been obtained in connection with a
                physical, psychological or psychiatric examination or treatment,
                with the understanding that VA will use this information in
                determining my eligibility to veterans benefits I have claimed.
              </p>
              <p>
                I understand that the source being asked to provide the Veterans
                Benefits Administration with records under this authorization
                may not require me to execute this authorization before it
                provides me with treatment, payment for health care, enrollment
                in a health plan, or eligibility for benefits provided by it.
              </p>
              <p>
                I understand that once my source sends this information to VA
                under this authorization, the information will no longer be
                protected by the HIPAA Privacy Rule, but will be protected by
                the Federal Privacy Act, 5 USC 552a, and VA may disclose this
                information as authorized by law.
              </p>
              <p>
                I also understand that I may revoke this authorization in
                writing, at any time except to the extent a source of
                information has already relied on it to take an action. To
                revoke, I must send a written statement to the VA Regional
                Office handling my claim or the Board of Veterans' Appeals (if
                my claim is related to an appeal) and also send a copy directly
                to any of my sources that I no longer wish to disclose
                information about me.
              </p>
              <p>
                I understand that VA may use information disclosed prior to
                revocation to decide my claim.
              </p>
            </>
          </div>
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

Authorization.propTypes = customPageProps995;

export default Authorization;
