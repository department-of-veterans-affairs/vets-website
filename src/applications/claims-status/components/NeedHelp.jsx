import React from 'react';

export function NeedHelp() {
  return (
    <va-need-help>
      <div slot="content">
        <p>
          Call us at <va-telephone contact="8008271000" />. We're here Monday
          through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss,{' '}
          <va-telephone contact="711" tty="true" />.
        </p>
      </div>
    </va-need-help>
  );
}

export default NeedHelp;
