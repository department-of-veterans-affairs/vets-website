import React from 'react';

import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

const ViewPaymentHistoryCTA = props => {
  let alertType;
  let headline;
  let alertContent;
  let content;
  const { isLoggedIn, isProfileLoading } = props;
  if (isProfileLoading) {
    return <LoadingIndicator message="Loading..." />;
  } else if (isLoggedIn === false) {
    alertContent = (
      <>
        <p>
          Try signing in with your <strong>DS Logon, My HealtheVet,</strong> or{' '}
          <strong>ID.me</strong> account. If you don’t have any of those
          accounts, you can create one now.
        </p>
        <a
          href="/va-payment-history/payments/"
          type="button"
          className="usa-button-primary va-button-primary"
        >
          Sign in or create an account
        </a>
      </>
    );
    headline = 'Please sign in to view your VA payment history';

    alertType = ALERT_TYPE.CONTINUE;
    content = (
      <AlertBox
        headline={headline}
        content={alertContent}
        status={alertType}
        isVisible
      />
    );
  } else {
    content = (
      <a
        href="/va-payment-history/payments/"
        type="button"
        className="usa-button-primary va-button-primary"
      >
        View your VA payment history
      </a>
    );
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  isLoggedIn: store?.user?.login?.currentlyLoggedIn,
  isProfileLoading: store?.user?.profile?.loading,
});

export default connect(mapStateToProps)(ViewPaymentHistoryCTA);
