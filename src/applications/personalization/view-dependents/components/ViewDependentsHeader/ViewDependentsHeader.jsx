import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import { errorFragment } from '../../layouts/helpers';

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
        headline: 'Thank you for verifying your dependents',
        content:
          'We’ll make a note that our records are correct and an updated VA Form 21-0538 will go into your e-folder. If we need you to give us more information or documents, we’ll contact you be mail.',
        level: 2,
      };
      break;
    case CALLSTATUS.failed:
      alertProps = {
        status: 'error',
        headline: 'We’re sorry. Something went wrong on our end',
        content: errorFragment,
        level: 2,
      };
      break;
    case CALLSTATUS.skip:
      alertProps = {
        status: 'info',
        headline: 'Please make changes to your dependents',
        content:
          'We need to make sure our records are right so your benefits pay is correct. You can add or remove dependents from this page. You can do this later, but if you skip this for now, we’ll ask you again.',
        level: 2,
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
        <h1>Your VA Dependents</h1>
        {alertProps && <AlertBox {...alertProps} />}
        <p className="vads-u-font-size--md vads-u-font-family--serif">
          Below is a list of dependents we have on file for you. You can file a
          claim for additional disability compensation whenever you add a new
          dependent.
        </p>
        {props.dependentsToggle && (
          <a
            href="/view-change-dependents/add-remove-form-686c/"
            className="usa-button-primary va-button-primary"
            onClick={handleClick}
          >
            Add or remove a dependent
          </a>
        )}
      </div>
    </div>
  );
}

export default ViewDependentsHeader;
