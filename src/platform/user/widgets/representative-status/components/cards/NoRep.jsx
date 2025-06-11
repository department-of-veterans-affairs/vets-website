import React from 'react';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export function NoRep({ DynamicHeader, isWidget = false }) {
  const { BASE_URL } = environment;

  // This view should be used when the widget is displayed
  // When a user goes to the URLs: '/get-help-from-accredited-representative/appoint-rep/introduction/',
  // '/get-help-from-accredited-representative/find-rep/', '/get-help-from-accredited-representative/'

  if (isWidget) {
    return (
      <va-card data-testid="no-rep" show-shadow>
        <div className="auth-card">
          <div className="auth-header-icon">
            <va-icon
              icon="account_circle"
              size={4}
              srtext="Your representative"
            />{' '}
          </div>
          <div>
            <DynamicHeader
              className="vads-u-font-size--h3 vads-u-margin-top--0"
              slot="headline"
            >
              You don’t have an accredited representative
            </DynamicHeader>
            <div className="auth-no-rep-body">
              <va-link
                href="https://www.va.gov/resources/va-accredited-representative-faqs/"
                text="Learn about accredited representatives"
              />
            </div>
          </div>
        </div>
      </va-card>
    );
  }

  // This view should be used by the profile when a user goes to the URL: '/profile/accredited-representative'
  return (
    <div className="no-rep" data-testid="no-rep">
      <p>You don’t have an accredited representative.</p>
      <p>
        An accredited attorney, claims agent, or Veterans Service Organization
        (VSO) representative can help you file a claim or request a decision
        review.
      </p>
      <va-link
        class="home__link"
        href={`${BASE_URL}/get-help-from-accredited-representative`}
        text="Get help from an accredited representative or VSO"
      />
    </div>
  );
}

NoRep.propTypes = {
  DynamicHeader: PropTypes.string,
  isWidget: PropTypes.bool,
};
