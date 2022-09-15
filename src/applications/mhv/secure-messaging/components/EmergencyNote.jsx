import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { FOOTER_EVENTS } from 'platform/site-wide/va-footer/helpers';

const EmergencyNote = () => (
  <section className="emergency-note">
    <p className="medium-screen:vads-u-margin-top--0">
      <strong>Note:</strong> Call <va-telephone contact="911" /> if you have a
      medical emergency. If you’re in crisis and need to talk with someone now,
      call the{' '}
      <button
        onClick={() => recordEvent({ event: FOOTER_EVENTS.CRISIS_LINE })}
        className="va-button-link va-overlay-trigger"
        data-show="#modal-crisisline"
        type="button"
      >
        Veterans Crisis Line
      </button>
      . To speak with a VA health care team member right away, contact your
      local VA call center.
    </p>
  </section>
);

export default EmergencyNote;
