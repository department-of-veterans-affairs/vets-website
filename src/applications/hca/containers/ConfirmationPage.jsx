import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

const ConfirmationPage = ({ form, profile, isLoggedIn }) => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop('topScrollElement');
  }, []);

  const { submission, data } = form;
  const { response } = submission;

  // if authenticated, get veteran's name from profile, else, from form data
  const name = isLoggedIn ? profile.userFullName : data.veteranFullName;
  const { first = '', middle = '', last = '', suffix = '' } = name;

  return (
    <div className="hca-confirmation-page">
      <p>
        <strong>Please print this page for your records.</strong>
      </p>
      <div className="inset">
        <h2 className="schemaform-confirmation-claim-header">
          Thank you for submitting your application
        </h2>
        <h3 className="vads-u-font-size--h5">
          Health Care Benefit Claim{' '}
          <span className="additional">(Form 10-10EZ)</span>
        </h3>
        <span className="hca-veteran-fullname">
          for {first} {middle} {last} {suffix}
        </span>

        {response && (
          <dl className="hca-claim-list">
            <dt className="vads-u-font-weight--bold">Date submitted</dt>
            <dd className="vads-u-margin-top--0">
              {moment(response.timestamp).format('MMM D, YYYY')}
            </dd>
          </dl>
        )}
      </div>
      <div className="confirmation-guidance-container">
        <h2 className="confirmation-guidance-heading vads-u-font-size--h3">
          How long will it take VA to make a decision on my application?
        </h2>
        <p>
          We usually decide on applications within <strong>1 week</strong>.
        </p>
        <p>We’ll contact you if we:</p>
        <ul>
          <li>
            Successfully receive and process your application,{' '}
            <strong>or</strong>
          </li>
          <li>If we need you to provide more information or documents</li>
        </ul>
        <p className="vads-u-font-weight--bold">
          If we haven’t contacted you within a week after you submitted your
          application
        </p>
        <p>
          Please don’t apply again. Instead, please call our toll-free hotline
          at <va-telephone contact={CONTACTS['222_VETS']} />. We’re here Monday
          through Friday, 8:00 a.m. to 8:00 p.m.{' '}
          <abbr title="Eastern Time">ET</abbr>.
        </p>
        <h2 className="confirmation-guidance-heading vads-u-font-size--h3">
          How can I check the status of my application?
        </h2>
        <p>Sign in with one of these verified accounts:</p>
        <ul>
          <li>Login.gov</li>
          <li>ID.me</li>
          <li>Premium My HealtheVet</li>
          <li>Premium DS Logon</li>
        </ul>
        <p>
          Then go back to the health care application introduction page. You’ll
          find your application status at the top of the page.
        </p>
        <p className="confirmation-guidance-message">
          <a
            href="/health-care/apply/application"
            className="vads-c-action-link--green"
          >
            Go to health care application page
          </a>
        </p>
        <h2 className="confirmation-guidance-heading vads-u-font-size--h3">
          How will I know if I’m enrolled in VA health care?
        </h2>
        <p>
          If enrolled, you’ll receive a Veterans Health Benefits Handbook in the
          mail within about 10 days.
        </p>
        <p>
          We’ll also call to welcome you to the VA health care program, help you
          with scheduling your first appointment, and answer any questions you
          may have about your health care benefits.
        </p>
        <p className="confirmation-guidance-message">
          <a href="/health-care/after-you-apply/">
            Find out what happens after you apply
          </a>
        </p>
        <h2 className="confirmation-guidance-heading vads-u-font-size--h3">
          What if I have more questions?
        </h2>
        <p className="confirmation-guidance-message">
          Please call <va-telephone contact={CONTACTS['222_VETS']} /> and select
          2. We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
          <abbr title="Eastern Time">ET</abbr>.
        </p>
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  profile: PropTypes.object,
};

const mapStateToProps = state => ({
  form: state.form,
  isLoggedIn: state.user?.login?.currentlyLoggedIn,
  profile: state.user?.profile,
});

export default connect(mapStateToProps)(ConfirmationPage);
