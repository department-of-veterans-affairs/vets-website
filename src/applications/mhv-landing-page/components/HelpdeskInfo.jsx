import React from 'react';

const HelpdeskInfo = () => {
  return (
    <div data-testid="mhv-helpdesk-info">
      <h2 className="vads-u-border-bottom--3px vads-u-border-color--primary vads-u-margin-top--0">
        Need help?
      </h2>
      <p className="vads-u-font-size--md">
        Call the My HealtheVet help desk at{' '}
        <va-telephone contact="8773270022" />. We’re here Monday through Friday,
        8:00 a.m to 8:00 p.m ET. If you have hearing loss, call{' '}
        <va-telephone contact="711" tty="true" />.
      </p>
    </div>
  );
};

export default HelpdeskInfo;
