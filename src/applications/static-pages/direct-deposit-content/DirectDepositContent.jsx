import React from 'react';
import { connect } from 'react-redux';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import CallToAction from '~/platform/site-wide/cta-widget';
import { widgetTypes } from '~/platform/site-wide/cta-widget/helpers';
import { showDirectDepositV2 } from '~/applications/personalization/profile/selectors';

const NewContent = () => {
  return (
    <>
      <p>
        If you receive disability compensation, pension or education benefits
        from VA, you can update your direct deposit information in your VA.gov
        profile. You’ll need your bank’s routing number and account number to
        make the updates.{' '}
      </p>
      <p>
        <strong>Note:</strong> You’ll need to sign in to VA.gov to update your
        direct deposit information. Once signed in, you’ll have to verify your
        identity and set up 2-factor authentication only if you’ve haven’t done
        this already.
      </p>
      <CallToAction appId={widgetTypes.DIRECT_DEPOSIT} />
      <p>
        If you have questions, please call us at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday through
        Friday, 8:00 a.m. to 9:00 p.m. ET. Or go to your{' '}
        <a href="./find-locations">nearest VA regional office</a>.
      </p>
    </>
  );
};

const OldContent = () => {
  return (
    <>
      <h3 id="disability-compensation-and-pe">
        Disability compensation and pension benefit payments
      </h3>
      <p>
        If you receive disability compensation or pension payments from VA, you
        can update your direct deposit information in your VA.gov profile.
        You’ll need your bank’s routing number and account number to make the
        updates.{' '}
      </p>
      <p>
        <strong>Note:</strong> You’ll need to sign in to VA.gov to update your
        direct deposit information. Once signed in, you’ll have to verify your
        identity and set up 2-factor authentication only if you’ve haven’t done
        this already.
      </p>
      <CallToAction appId={widgetTypes.DIRECT_DEPOSIT} />
      <p>
        If you have questions, please call us at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday through
        Friday, 8:00 a.m. to 9:00 p.m. ET. Or go to your{' '}
        <a href="./find-locations">nearest VA regional office</a>.
      </p>
      <h3 id="education-benefit-payments">Education benefits</h3>
      <p>
        If you receive education benefit payments from VA, you’ll need to sign
        in to eBenefits to update your direct deposit information. You’ll need
        your bank’s routing number and account number to make the updates.
      </p>
      <AlertBox
        status={ALERT_TYPE.INFO}
        headline="Please sign in to eBenefits to change your direct deposit information for education benefits"
      >
        <p>
          To use this feature, you’ll need a Premium <strong>DS Logon</strong>{' '}
          account. Your My HealtheVet or ID.me credentials won’t work on the
          eBenefits website. Go to eBenefits to sign in, register, or upgrade
          your <strong>DS Logon</strong> account to Premium.
        </p>
        <a
          className="usa-button-primary"
          href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=direct-deposit-and-contact-information"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to eBenefits to change your information
        </a>
      </AlertBox>
    </>
  );
};

const DirectDepositContent = ({ isDD4EDUAvailable }) => {
  if (isDD4EDUAvailable) {
    return <NewContent />;
  }

  if (isDD4EDUAvailable === false) {
    return <OldContent />;
  }

  return <LoadingIndicator message="Loading..." />;
};

const mapStateToProps = state => ({
  isDD4EDUAvailable: showDirectDepositV2(state),
});

export default connect(mapStateToProps)(DirectDepositContent);
