import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import manifest from '../manifest.json';

const contactPrefrencesMap = {
  Email: 'email',
  'Phone call': 'phone call',
  'U.S. mail': 'mail',
};

const ConfirmationPage = ({ location }) => {
  const inquiryNumber = location.state?.inquiryNumber;
  const contactPreference =
    contactPrefrencesMap[location.state?.contactPreference || 'email'];
  const alertRef = useRef(null);
  const { user } = useSelector(state => state);
  const {
    login: { currentlyLoggedIn },
    profile: { loading },
  } = user;

  useEffect(
    () => {
      if (alertRef?.current) {
        focusElement(alertRef.current);
      }
    },
    [alertRef],
  );

  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  const alert = (
    <va-alert
      className="vads-u-margin-bottom--2"
      status="success"
      visible
      uswds
      ref={alertRef}
      slim
    >
      <p className="vads-u-margin-y--0">
        Your question was submitted successfully.
      </p>
    </va-alert>
  );

  const actionLink = currentlyLoggedIn && (
    <div className="vads-u-margin-bottom--3 vads-u-margin-top--3">
      <va-link-action
        href={`${manifest.rootUrl}`}
        text="Return to Ask VA"
        type="secondary"
      />
    </div>
  );

  const confirmationNumber = (
    <p className="vads-u-margin-bottom--3 vads-u-margin-top--3">
      Your confirmation number is{' '}
      <span className="vads-u-font-weight--bold">{inquiryNumber}</span>. We’ll
      also send you an email confirmation.
    </p>
  );

  const contactMethod = () => {
    if (contactPreference === 'email' && currentlyLoggedIn) {
      return (
        <p className="vads-u-margin-bottom--3">
          You should receive an email within 7 business days when your reply is
          ready. To read the reply, you’ll need to sign in to VA.gov. If we need
          more information to answer your question, we’ll contact you.
        </p>
      );
    }
    if (contactPreference === 'phone call') {
      return (
        <p className="vads-u-margin-bottom--3">
          You should receive a phone call within 7 business days. If we need
          more information to answer your question, we’ll contact you.
        </p>
      );
    }
    if (contactPreference === 'mail') {
      return (
        <p className="vads-u-margin-bottom--3">
          You should receive a letter in the mail within 7 business days. If we
          need more information to answer your question, we’ll contact you.
        </p>
      );
    }
    return (
      <p className="vads-u-margin-bottom--3">
        You should receive a reply by email within 7 business days. If we need
        more information to answer your question, we’ll contact you.
      </p>
    );
  };

  return (
    <>
      {alert}
      {inquiryNumber && confirmationNumber}
      {contactMethod()}
      {actionLink}
    </>
  );
};

ConfirmationPage.propTypes = {
  location: PropTypes.object,
};
export default withRouter(ConfirmationPage);
