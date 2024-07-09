import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ConfirmationPage = () => {
  const { user, form } = useSelector(state => state);
  const { submission, data } = form;
  const {
    login: { currentlyLoggedIn },
    profile: { loading },
  } = user;

  useEffect(
    () => {
      focusElement('h2');
      scrollToTop('topScrollElement');
    },
    [loading],
  );

  const contactOption = data?.contactPreference || 'email';
  const referenceID = submission?.id || 'A-123456-7890';

  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  const actionLink = currentlyLoggedIn ? (
    <va-link-action
      href="/contact-us/ask-va-too/introduction"
      text="Return to dashboard"
      type="primary"
    />
  ) : (
    <va-link-action
      href="/contact-us/ask-va-too"
      text="Return to Ask VA"
      type="secondary"
    />
  );

  return (
    <div>
      <va-alert
        className="vads-u-margin-bottom--2"
        status="success"
        visible
        uswds
      >
        <p className="vads-u-margin-y--0">
          Your question was submitted successfully.
        </p>
      </va-alert>
      <p className="vads-u-margin-bottom--3 vads-u-margin-top--3">
        Your confirmation number is{' '}
        <span className="vads-u-font-weight--bold">{referenceID}.</span> We’ll
        also send you an email confirmation.
      </p>
      <p className="vads-u-margin-bottom--3">
        You should receive a reply by {contactOption} within 7 business days. If
        we need more information to answer your question, we’ll contact you.
      </p>
      <div className="vads-u-margin-bottom--3 vads-u-margin-top--3">
        {actionLink}
      </div>
    </div>
  );
};

export default ConfirmationPage;
