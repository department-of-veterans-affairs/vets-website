import React from 'react';

const NewsletterSignup = () => {
  const mhvNewsletterURL =
    'https://public.govdelivery.com/accounts/USVHA/subscribers/qualify';

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <h2 className="vads-u-margin-bottom--0">
        Subscribe to the My HealtheVet newsletter
      </h2>
      <div className="vads-l-row">
        <p>
          To stay up to date on My HealtheVet tools and features, subscribe to
          our biweekly newsletter.
        </p>
      </div>
      <div className="vads-l-row">
        <a href={mhvNewsletterURL} rel="noopener noreferrer" target="_blank">
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-chevron-circle-right fa-lg vads-u-color--link-default vads-u-margin-right--1"
          />
          Subscribe to the My HealtheVet newsletter on GovDelivery.com (opens in
          new tab)
        </a>
      </div>
    </div>
  );
};

export default NewsletterSignup;
