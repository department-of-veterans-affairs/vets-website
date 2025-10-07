import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import { VaAlert } from '@department-of-veterans-affairs/web-components/react-bindings';

import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { errorFragment } from '../../layouts/helpers';
import { PAGE_TITLE } from '../../util';
import {
  getIsDependentsWarningHidden,
  hideDependentsWarning,
} from '../../../shared/utils';

const dependentsVerificationUrl = getAppUrl('0538-dependents-verification');

const CALLSTATUS = {
  pending: 'pending',
  success: 'success',
  failed: 'failed',
  skip: 'skipped',
};

function ViewDependentsHeader(props) {
  const { updateDiariesStatus, showAlert } = props;

  const [warningHidden, setWarningHidden] = useState(
    getIsDependentsWarningHidden(),
  );

  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

  function handleWarningClose() {
    setWarningHidden(true);
    hideDependentsWarning();
    scrollToTop();
    focusElement('.view-deps-header');
  }

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
          These are the dependents we have on file for you. Use this page to
          update or verify your dependents every year.
        </p>

        {showAlert &&
          !warningHidden && (
            <VaAlert
              id="update-warning-alert"
              status="warning"
              closeable
              visible
              onCloseEvent={handleWarningClose}
              close-btn-aria-label="Close notification"
            >
              <>
                <h2 className="vads-u-font-size--h3" slot="headline">
                  Avoid disability benefits overpayments by keeping your
                  dependents up to date
                </h2>
                <p className="vads-u-font-size--base">
                  Report any changes to your dependents to make sure you receive
                  the correct VA disability benefit amount. We recommend
                  verifying your dependent information{' '}
                  <strong>once a year</strong>.
                </p>
                <p>
                  If you receive an overpayment, you'll have to repay that
                  money.
                </p>
                <p>
                  <va-link-action
                    text="Verify your VA disability benefits dependents"
                    href={dependentsVerificationUrl}
                  />
                </p>
              </>
            </VaAlert>
          )}
      </div>
    </div>
  );
}

ViewDependentsHeader.propTypes = {
  showAlert: PropTypes.bool,
  updateDiariesStatus: PropTypes.string,
};

export default ViewDependentsHeader;
