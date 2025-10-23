import React from 'react';

const NeedHelpFooterEducation = () => {
  return (
    <va-need-help>
      <div slot="content">
        <p>
          Call us at <va-telephone contact="8884424551" /> (
          <va-telephone contact="711" tty="true" />
          ). We’re here Monday through Friday, 8:00 a.m to 7:00 p.m ET.
        </p>
        <p>
          For students outside the U.S., call us at{' '}
          <va-telephone contact="9187815678" international />.
        </p>
      </div>
    </va-need-help>
  );
};

export default NeedHelpFooterEducation;
