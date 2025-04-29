import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

export const heading = 'We’re missing some of your personal information';

const NeedsMissingInfoAlert = ({ missing }) => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        focusElement(alertRef.current);
      }
    },
    [alertRef],
  );

  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'warning',
    'alert-box-heading': heading,
    'error-key': 'missing_ssn_or_dob',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': `Missing ${missing}`,
  });

  return (
    <va-alert status="error" ref={alertRef}>
      <h2 slot="headline">{heading}</h2>
      <p>
        You’ll need to provide us with the missing information before you can
        fill out a Supplemental Claim request. Call the Defense Manpower Data
        Center (DMDC) support office at <va-telephone contact="8005389552" /> to
        make sure we have your {missing}. They’re open Monday through Friday,
        8:00 a.m. to 8:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        . If you have hearing loss, call{' '}
        <va-telephone contact="8663632883" tty />.
      </p>
    </va-alert>
  );
};

NeedsMissingInfoAlert.propTypes = {
  missing: PropTypes.string,
};

export default NeedsMissingInfoAlert;
