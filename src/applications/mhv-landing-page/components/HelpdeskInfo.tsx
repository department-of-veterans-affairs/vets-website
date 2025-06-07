import * as React from 'react';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const HelpdeskInfo = (): JSX.Element => {
  return (
    <div data-testid="mhv-helpdesk-info">
      <h2 className="vads-u-border-bottom--3px vads-u-border-color--primary vads-u-margin-top--0">
        Need help?
      </h2>
      <p className="vads-u-font-size--md">
        Call the My HealtheVet help desk at{' '}
        <VaTelephone contact="8773270022" />. We’re here Monday through Friday,
        8:00 a.m to 8:00 p.m ET. If you have hearing loss, call{' '}
        <VaTelephone contact="711" tty />.
      </p>
    </div>
  );
};

export default HelpdeskInfo;
