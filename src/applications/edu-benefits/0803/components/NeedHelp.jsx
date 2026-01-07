import React from 'react';

export default function NeedHelp() {
  return (
    <div className="usa-width-two-thirds medium-8 columns print-full-width">
      <va-need-help>
        <div slot="content">
          <p>
            If you need help in completing this form, call VA TOLL-FREE at
            1-888-GI-BILL-1 (<va-telephone contact="8884424551" international />
            ). If you have hearing loss, call <va-telephone contact="711" tty />
            .
          </p>
        </div>
      </va-need-help>
    </div>
  );
}
