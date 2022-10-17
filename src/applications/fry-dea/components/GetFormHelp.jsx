import React from 'react';

function GetFormHelp() {
  return (
    <>
      <p className="help-talk">
        If you need help with your application or have questions about
        enrollment or eligibility, call our Education Call Center at{' '}
        <va-telephone contact="8884424551" /> (<va-telephone contact="711" />
        ). We're here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET. If
        you're outside the U.S., call us at{' '}
        <va-telephone contact="0019187815678" international />.
      </p>
      <p>
        If you have technical difficulties using this online application, call
        our MyVA411 main information line at{' '}
        <va-telephone contact="8006982411" /> (<va-telephone contact="711" />
        ). We're here 24/7.
      </p>
    </>
  );
}

export default GetFormHelp;
