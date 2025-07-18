import React, { useState, useEffect } from 'react';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import { errorFragment } from '../../layouts/helpers';
import { PAGE_TITLE } from '../../util';

const dependentsVerificationUrl = getAppUrl('0538-dependents-verification');

const CALLSTATUS = {
  pending: 'pending',
  success: 'success',
  failed: 'failed',
  skip: 'skipped',
};

function ViewDependentsHeader(props) {
  const { updateDiariesStatus, showAlert } = props;

  const [warningVisible, setWarningVisible] = useState(showAlert);

  useEffect(() => {
    const handleWarningClose = () => setWarningVisible(false);

    const warningAlert = document.getElementById('update-warning-alert');
    if (warningAlert) {
      warningAlert.addEventListener('closeEvent', handleWarningClose);
    }

    return () => {
      if (warningAlert) {
        warningAlert.removeEventListener('closeEvent', handleWarningClose);
      }
    };
  }, []);

  let alertProps = null;

  switch (updateDiariesStatus) {
    case CALLSTATUS.success:
      alertProps = {
        status: 'success',
        content: (
          <>
            <h2 className="vads-u-font-size--h3" slot="headline">
              Thank you for verifying your dependents
            </h2>
            <p className="vads-u-font-size--base">
              We’ll make a note that our records are correct and an updated VA
              Form 21-0538 will go into your e-folder. If we need you to give us
              more information or documents, we’ll contact you by mail.
            </p>
          </>
        ),
      };
      break;
    case CALLSTATUS.failed:
      alertProps = {
        status: 'error',
        content: errorFragment,
      };
      break;
    case CALLSTATUS.skip:
      alertProps = {
        status: 'info',
        content: (
          <>
            <h2 className="vads-u-font-size--h3" slot="headline">
              Please make changes to your dependents
            </h2>
            <p className="vads-u-font-size--base">
              We need to make sure our records are right so your benefits pay is
              correct. You can add or remove dependents from this page. You can
              do this later, but if you skip this for now, we’ll ask you again.
            </p>
          </>
        ),
      };
      break;
    default:
      alertProps = null;
  }

  return (
    <div className="vads-l-row">
      <div className="vads-l-col--12">
        <h1>{PAGE_TITLE}</h1>

        {alertProps && (
          <va-alert status={alertProps.status}>{alertProps.content}</va-alert>
        )}

        <p className="vads-u-line-height--6 vads-u-font-size--h3 vads-u-font-family--serif">
          These are the dependents we have in your VA.gov profile. Use this page
          to update or verify your dependents every year.
        </p>

        {warningVisible && (
          <va-alert
            id="update-warning-alert"
            status="warning"
            closeable
            visible
            close-btn-aria-label="Close notification"
          >
            <>
              <h2 className="vads-u-font-size--h3" slot="headline">
                Avoid disability overpayments by keeping your dependents up to
                date
              </h2>
              <p className="vads-u-font-size--base">
                Report any changes to your dependents to make sure you receive
                the correct VA disability benefit amount. We recommend verifying
                your dependent information <strong>once a year</strong>.
              </p>
              <p>If you're overpaid, you'll have to pay money back.</p>
              <p>
                <a
                  href={dependentsVerificationUrl}
                  className="vads-c-action-link--green"
                >
                  Verify your VA disability benefits dependents
                </a>
              </p>
            </>
          </va-alert>
        )}
      </div>
    </div>
  );
}

export default ViewDependentsHeader;
