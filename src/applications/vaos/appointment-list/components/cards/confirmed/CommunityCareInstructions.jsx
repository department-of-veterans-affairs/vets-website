import React from 'react';

export default function AppointmentInstructions({ instructions }) {
  if (!instructions) {
    return null;
  } else if (instructions === 'vistaCCAppt') {
    return (
      <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
        <dl className="vads-u-margin--0">
          <dt className="vads-u-font-weight--bold">Special instructions</dt>
          <dd>
            This appointment is scheduled with a community care provider. Please
            do not report to your local VA facility. If you have questions,
            please contact your facility community care staff at{' '}
            <a href="/find-locations" target="_blank" rel="noopener noreferrer">
              your local VA.
            </a>
            <br />
          </dd>
        </dl>
      </div>
    );
  }

  return (
    <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
      <dl className="vads-u-margin--0">
        <dt className="vads-u-font-weight--bold">Special instructions</dt>
        <dd>{instructions}</dd>
      </dl>
    </div>
  );
}
