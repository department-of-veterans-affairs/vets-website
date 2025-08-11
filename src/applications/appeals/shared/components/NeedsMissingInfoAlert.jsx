import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

export const heading = 'We’re missing some of your personal information';

// Helper function to get form name based on formId
const getFormName = formId => {
  const formNames = {
    '10182': 'Board Appeal',
    '20-0995': 'Supplemental Claim',
    '20-0996': 'Higher-Level Review',
  };

  return formNames[formId] ? `a ${formNames[formId]}` : `an appeal`;
};

const NeedsMissingInfoAlert = ({ missing, formId }) => {
  const alertRef = useRef(null);
  const formName = getFormName(formId);

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
        fill out {formName} request. Call the Defense Manpower Data Center
        (DMDC) support office at <va-telephone contact="8005389552" /> to make
        sure we have your {missing}. They’re open Monday through Friday, 8:00
        a.m. to 8:00 p.m.{' '}
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
  formId: PropTypes.string,
  missing: PropTypes.string,
};

export default NeedsMissingInfoAlert;
