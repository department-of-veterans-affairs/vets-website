import React from 'react';
import LiVaLink from '../shared/liVaLink';

const AdditionalContacts = () => {
  return (
    <section>
      <h4>Additional Contacts</h4>
      <ul className="va-nav-linkslist-list social">
        <LiVaLink
          href="https://www.benefits.va.gov/gibill/regional_processing.asp"
          text="Regional Processing Offices (RPOs)"
        />
        <LiVaLink
          href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp"
          text="Education Liaison Representatives (ELRs)"
        />
        <LiVaLink
          href="https://nasaa-vetseducation.com/nasaa-contacts/"
          text="State Approving Agency (SAA)"
        />
      </ul>
    </section>
  );
};

export default AdditionalContacts;
