import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { getAppUrl } from 'platform/utilities/registry-helpers';

import { errorFragment } from '../../layouts/helpers';
import { PAGE_TITLE } from '../../util';

const form686Url = getAppUrl('686C-674');

const CALLSTATUS = {
  pending: 'pending',
  success: 'success',
  failed: 'failed',
  skip: 'skipped',
};

function ViewDependentsHeader(props) {
  const { updateDiariesStatus } = props;
  let alertProps;
  // handle status from api
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
    case CALLSTATUS.pending:
    default:
      alertProps = null;
  }

  const handleClick = () => {
    recordEvent({
      event: 'cta-primary-button-click',
    });
  };

  return (
    <div className="vads-l-row">
      <div className="vads-l-col--12">
        <h1>{PAGE_TITLE}</h1>
        {alertProps && (
          <va-alert status={alertProps.status}>{alertProps.content}</va-alert>
        )}
        <p className="vads-u-line-height--6 vads-u-font-size--h3 vads-u-font-family--serif">
          Below is a list of dependents we have on file for you. You can file a
          claim for additional disability compensation whenever you add a new
          dependent.
        </p>
        {props.dependentsToggle && (
          <p>
            <a
              href={form686Url}
              className="vads-c-action-link--green"
              onClick={handleClick}
            >
              Add or remove a dependent
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default ViewDependentsHeader;
