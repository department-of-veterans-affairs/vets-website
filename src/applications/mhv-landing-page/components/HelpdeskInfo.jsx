import React from 'react';

const HelpdeskInfo = () => {
  return (
    <va-need-help data-testid="mhv-helpdesk-info">
      <div slot="content">
        <p>
          Call the My HealtheVet help desk at{' '}
          <va-telephone contact="8773270022" />. We’re here Monday through
          Friday, 8:00 a.m to 8:00 p.m ET. If you have hearing loss, call{' '}
          <va-telephone contact="711" tty="true" />.
        </p>
      </div>
    </va-need-help>
  );
};

export default HelpdeskInfo;
