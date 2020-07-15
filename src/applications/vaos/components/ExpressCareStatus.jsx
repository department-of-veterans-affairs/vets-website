import React from 'react';
import {
  APPOINTMENT_STATUS,
  UNABLE_TO_REACH_VETERAN_DETCODE,
} from '../utils/constants';

export default function ExpressCareStatus({ appointment, index }) {
  let iconClass = null;
  let content = null;
  const status = appointment.status;
  const unableToReachVeteran =
    appointment.cancelationReason?.text === UNABLE_TO_REACH_VETERAN_DETCODE;

  switch (status) {
    case APPOINTMENT_STATUS.proposed: {
      iconClass = 'fa-exclamation-triangle';
      content = (
        <>
          <strong id={`card-${index}-status`}>Next step</strong>{' '}
          <div className="vads-u-font-weight--normal">
            A VA health care provider will contact you today about your request.
          </div>
        </>
      );
      break;
    }
    case APPOINTMENT_STATUS.pending: {
      iconClass = 'fa-exclamation-triangle';
      content = (
        <>
          <strong id={`card-${index}-status`}>Next step</strong>{' '}
          <div className="vads-u-font-weight--normal">
            A VA health care provider will follow up with you today.
          </div>
        </>
      );
      break;
    }
    case APPOINTMENT_STATUS.fulfilled: {
      iconClass = 'fa-check-circle';
      content = (
        <>
          <strong id={`card-${index}-status`}>Complete</strong>{' '}
          <div className="vads-u-font-weight--normal">
            We’ve completed your screening. Thank you for using Express Care.
          </div>
        </>
      );
      break;
    }
    case APPOINTMENT_STATUS.cancelled: {
      iconClass = 'fa-exclamation-circle';
      content = (
        <>
          <strong id={`card-${index}-status`}>
            Canceled
            {unableToReachVeteran && <> – Could not reach Veteran</>}
          </strong>{' '}
          <div className="vads-u-font-weight--normal">
            {!unableToReachVeteran && (
              <>
                This screening has been canceled. If you still want to use
                Express Care, please submit another request tomorrow.
              </>
            )}
            {unableToReachVeteran && (
              <>
                We tried to call you, but couldn’t reach you by phone. If you
                still want to use Express Care, please submit another request
                tomorrow.
              </>
            )}
            <p>
              <strong>Note:</strong> If your symptoms get worse, contact a VA
              urgent care clinic near you. If you need medical care right away,
              call 911 or go to the nearest emergency room. Please contact us
              first before going to any{' '}
              <a href="/find-locations" target="_blank" rel="noopener nofollow">
                VA location
              </a>
              . Contacting us first helps keep you safe.
            </p>
          </div>
        </>
      );
      break;
    }
    default: {
      iconClass = '';
      content = null;
      break;
    }
  }

  return (
    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-y--2">
      <div className="vads-u-margin-right--1">
        <i
          aria-hidden="true"
          className={`fas ${iconClass} vads-u-line-height--4`}
        />
      </div>
      <span className="vads-u-font-weight--bold vads-u-flex--1">
        <div className="vaos-appts__status-text vads-u-font-size--base vads-u-font-family--sans">
          {content}
        </div>
      </span>
    </div>
  );
}
