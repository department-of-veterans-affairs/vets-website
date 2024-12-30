import React from 'react';

function LicenseCertificationAlert({
  changeStateAlert,
  changeDropdownsAlert,
  changeStateToAllAlert,
  state,
  name,
  visible,
}) {
  return (
    <va-alert
      className="license-alert"
      // slim={true}
      // disable-analytics={true}
      visible={visible}
      // close-btn-aria-label={closeBtnAriaLabel}
      closeable={false}
      fullWidth={false}
      style={{ maxWidth: '30rem' }}
    >
      {changeStateAlert &&
        `The state field has been updated to ${state} becuase
        the ${name} license is specific to that state.`}
      {changeDropdownsAlert &&
        `State options have been changed to reflect only those states where ${name} is available`}
      {changeStateToAllAlert &&
        `Certifications are nationwide. State does not apply`}
    </va-alert>
  );
}

export default LicenseCertificationAlert;
