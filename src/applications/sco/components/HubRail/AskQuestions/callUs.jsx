import React from 'react';
import LiVaLinkAndVaTelephone from '../shared/liVaLinkAndVaTelephone';

const CallUs = () => {
  return (
    <section>
      <h4>Call us</h4>
      <ul className="va-nav-linkslist-list social">
        <LiVaLinkAndVaTelephone
          phoneNumber="888-442-4551"
          text="VA Education Call Center:"
        />
        <LiVaLinkAndVaTelephone
          phoneNumber="918-781-5678"
          text="Outside the U.S.:"
          isInternational
        />
        <LiVaLinkAndVaTelephone
          phoneNumber="800-698-2411"
          text="MyVA411 for main information line:"
        />
        <li className="vads-u-margin-bottom--2 vads-u-margin-top--0">
          <va-link href="tel:711" text="Telecommunications Relay Services" />

          <br />
          <va-telephone contact="+1TTY: 711"> TTY: 711 </va-telephone>
        </li>
      </ul>
    </section>
  );
};

export default CallUs;
