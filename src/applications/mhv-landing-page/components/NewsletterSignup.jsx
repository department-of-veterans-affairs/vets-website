import React from 'react';

const NewsletterSignup = () => {
  const mhvNewsletterURL =
    'https://public.govdelivery.com/accounts/USVHA/subscribers/qualify';

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <h2 className="vads-u-margin-bottom--0">
          Subscribe to the My HealtheVet newsletter
        </h2>
        <div className="vads-l-row">
          <p className="vads-u-font-size--md">
            To stay up to date on My HealtheVet tools and features,{' '}
            <a
              href={mhvNewsletterURL}
              rel="noopener noreferrer"
              target="_blank"
            >
              subscribe to the My HealtheVet newsletter on GovDelivery.com
              (opens in new tab)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
