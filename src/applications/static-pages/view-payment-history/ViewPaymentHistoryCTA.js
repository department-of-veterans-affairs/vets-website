import React from 'react';

import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

const ViewPaymentHistoryCTA = props => {
  let alertType;
  let headline;
  let alertContent;
  let content;
  const { includedInFlipper, isLoggedIn, isProfileLoading } = props;
  if (includedInFlipper === undefined || isProfileLoading) {
    return <LoadingIndicator message="Loading..." />;
  } else if (includedInFlipper === false) {
    alertContent = (
      <>
        <p>
          To use this feature, you'll need a Premium <strong>DS Logon</strong>{' '}
          account. Your My HealtheVet or ID.me credentials won't work on the
          eBenefits website. Go to eBenefits to sign in, register, or upgrade
          your <strong>DS Logon</strong> account to Premium.
        </p>
        <EbenefitsLink
          path="ebenefits/about/feature?feature=payment-history"
          className="usa-button-primary va-button-default"
        >
          Go to eBenefits to view payments
        </EbenefitsLink>
      </>
    );

    headline =
      "You'll need to sign in to eBenefits to view your payment history.";

    alertType = ALERT_TYPE.INFO;
    content = (
      <AlertBox
        headline={headline}
        content={alertContent}
        status={alertType}
        isVisible
      />
    );
  } else if (includedInFlipper === true && isLoggedIn === false) {
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
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.viewPaymentHistory],
  isLoggedIn: store?.user?.login?.currentlyLoggedIn,
  isProfileLoading: store?.user?.profile?.loading,
});

export default connect(mapStateToProps)(ViewPaymentHistoryCTA);
