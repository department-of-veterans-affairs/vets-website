import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import LiVaLinkAndVaTelephone from '../shared/liVaLinkAndVaTelephone';

const CallUs = () => {
  return (
    <section>
      <h4>Call us</h4>
      <ul className="va-nav-linkslist-list social">
        <LiVaLinkAndVaTelephone
          phoneNumber={CONTACTS.GI_BILL}
          text="VA Education Call Center:"
        />
        <LiVaLinkAndVaTelephone
          phoneNumber="9187815678"
          text="Outside the U.S.:"
          isInternational
        />
        <LiVaLinkAndVaTelephone
          phoneNumber={CONTACTS.VA_411}
          text="MyVA411 for main information line:"
        />
        <LiVaLinkAndVaTelephone
          phoneNumber={CONTACTS['711']}
          text="Telecommunications Relay Services"
          isTty
        />
      </ul>
    </section>
  );
};

export default CallUs;
