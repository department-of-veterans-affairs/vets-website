import React from 'react';
import LiVaLink from '../shared/liVaLink';

const GetGovDeliveryUpdates = () => {
  return (
    <section>
      <h4>Get GovDelivery updates</h4>
      <ul className="va-nav-linkslist-list social">
        <LiVaLink
          href="https://public.govdelivery.com/accounts/USVAVBA/subscriber/new"
          text="Subscribe to GovDelivery"
        />
      </ul>
    </section>
  );
};

export default GetGovDeliveryUpdates;
