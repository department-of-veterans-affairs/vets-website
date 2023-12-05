import React from 'react';

const NewsletterSignup = () => {
  const mhvNewsletterURL =
    'https://public.govdelivery.com/accounts/USVHA/subscribers/qualify';

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <h2 className="vads-u-margin-bottom--0">
        Subscribe to get My HealtheVet updates
      </h2>
      <div className="vads-l-row">
        <div className="vads-l-col medium-screen:vads-l-col--4">
          <form method="POST" action={mhvNewsletterURL}>
            <input type="hidden" value="¿" name="utf8" />
            <input
              type="hidden"
              value="zrD8Ri9HkK5xMUmPd/64OtM13GRi0R9lmtOiprc1K4N/I6+cXT+0y+g1HmXpYPAt0ZT4lSgWuQk99qqiAsy/ZQ=="
              name="authenticity_token"
            />
            <input type="hidden" value="USVHA_60" name="topic_id" />
            <label htmlFor="email">Email address</label>
            <input
              className="vads-u-margin-top--1"
              id="email"
              type="email"
              name="email"
              required
            />
            <input
              className="usa-button"
              type="submit"
              value="Subscribe"
              name="commit"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
