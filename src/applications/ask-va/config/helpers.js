import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';

export const ServerErrorAlert = (
  <>
    <h2
      slot="headline"
      className="vads-u-font-size--h3 vads-u-margin-y--0 vads-u-font-size--lg"
    >
      We’re sorry. Something went wrong on our end
    </h2>
    <p className="vads-u-font-size--base">
      Please refresh this page or check back later. You can also sign out of
      VA.gov and try signing back into this page.
    </p>
    <p className="vads-u-font-size--base">
      If you get this error again, please call the VA.gov help desk at{' '}
      <va-telephone contact={CONTACTS.VA_311} /> (TTY:{' '}
      <va-telephone contact={CONTACTS['711']} />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </>
);

// const [facilities, setFacilities] = useState([]);

//   // grab the facility name based upon the selected value
// const getFacilityName = useCallback(
//   val => {
//     const facility = facilities.find(f => f.id.split('_').pop() === val);
//     return facility?.name || '\u2014';
//   },
//   [facilities],
// );
