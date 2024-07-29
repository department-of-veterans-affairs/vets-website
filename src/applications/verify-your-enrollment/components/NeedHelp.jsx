import React from 'react';

const NeedHelp = () => {
  return (
    <div className="vads-u-margin-top--6">
      <va-need-help>
        <div slot="content">
          <p>
            Call us at <va-telephone contact="8884424551" /> (
            <span className="vads-u-margin-left--0p5">
              <va-telephone contact="711" tty="true" />.
            </span>
            ). We’re here Monday through Friday, 8:00 a.m to 7:00 p.m. ET.
            <span className="vads-u-margin-left--0p5">
              <va-telephone contact="711" tty="true" />.
            </span>
          </p>
        </div>
      </va-need-help>
    </div>
  );
};

export default NeedHelp;
