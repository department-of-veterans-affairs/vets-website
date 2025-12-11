import React from 'react';

export default function NeedHelp() {
  return (
    <div className="usa-width-two-thirds medium-8 columns print-full-width">
      <va-need-help>
        <div slot="content">
          <p>
            Call us at <va-telephone contact="8008271000" />. We're here Monday
            through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have hearing loss,
            call <va-telephone contact="711" tty />.
          </p>
        </div>
      </va-need-help>
    </div>
  );
}
