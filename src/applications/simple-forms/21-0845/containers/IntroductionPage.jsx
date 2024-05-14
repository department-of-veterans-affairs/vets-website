/* eslint-disable @department-of-veterans-affairs/prefer-telephone-component */
// <va-telephone /> doesn't display 1-800 numbers correctly
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import manifest from '../manifest.json';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route, userIdVerified, userLoggedIn } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Authorize VA to release your information to a third-party source"
          subTitle="Authorization To Disclose Personal Information To a Third Party (VA Form 21-0845)"
        />
        <p>
          Use this form if you want us to release information from your VA
          records with a non-VA (third-party) individual or organization. This
          may include information about your VA claims or benefits.
        </p>
        <h2>What to know before you fill out this form</h2>
        <ul>
          <li>
            If you want to keep some information from your records private, you
            can use this form to authorize us to release only specific
            information.
          </li>
          <li>
            If we’ve determined that you can’t make decisions about VA benefits
            for yourself, then we can’t accept this online form from you. You’ll
            need to have your court-ordered or VA-appointed fiduciary complete
            and sign the PDF version of this form.
          </li>
          <li>
            This form doesn’t give the third-party individual or organization
            permission to manage or change the information in your VA record.
            They can only access the information.
          </li>
          <li>
            You can change your mind and tell us to stop releasing your
            information at any time. We can’t take back any information we may
            have already released based on your authorization.
          </li>
        </ul>
        <h2>How to cancel your authorization</h2>
        <p>
          If you change your mind and don’t want us to release your information,
          you can tell us online through Ask VA.
        </p>
        <p>
          <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
        </p>
        <p>
          Or call us at <va-telephone contact="8008271000" /> (
          <va-telephone tty="true" contact="711">
            TTY:711
          </va-telephone>
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
        <h2 id="start-your-request">Start your authorization</h2>
        <p>
          <strong>Note</strong>: You’ll need to sign in with a verified{' '}
          <strong>Login.gov</strong> or <strong>ID.me</strong> account or a
          Premium <strong>DS Logon</strong> or <strong>My HealtheVet</strong>{' '}
          account. If you don’t have any of those accounts, you can create a
          free <strong>Login.gov</strong> or <strong>ID.me</strong> account when
          you sign in to start filling out your form.
        </p>
        {userLoggedIn &&
        !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
            <div className="id-not-verified-content vads-u-margin-top--4">
              <va-alert status="continue" uswds>
                <h3 slot="headline">
                  You’ll need to verify your identity to authorize the release
                  of your information
                </h3>
                <p>
                  We need to make sure you’re you — and not someone pretending
                  to be you — before we can give you access to your personal and
                  health-related information. This helps to keep your
                  information safe, and to prevent fraud and identity theft.
                </p>
                <strong>This one-time process takes about 5-10 minutes.</strong>
                <p>
                  <a
                    href={`/verify?next=${manifest.rootUrl}/introduction`}
                    className="verify-link vads-c-action-link--green"
                  >
                    Verify your identity
                  </a>
                </p>
              </va-alert>
              <p className="vads-u-margin-top--3">
                If you don’t want to verify your identity right now, you can
                still download and complete the PDF version of this
                authorization.
              </p>
              <p className="vads-u-margin-y--3">
                <va-link
                  download
                  href="https://www.vba.va.gov/pubs/forms/VBA-21-0845-ARE.pdf"
                  text="Get VA Form 21-0845 to download"
                />
              </p>
            </div>
          )}
        {(!userLoggedIn || userIdVerified) && (
          <SaveInProgressIntro
            formConfig={formConfig}
            headingLevel={2}
            alertTitle="Sign in now to save your work in progress"
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            startText="Start your authorization"
            unauthStartText="Sign in to start your authorization"
            verifiedPrefillAlert={
              <div>
                <div className="usa-alert usa-alert-info schemaform-sip-alert">
                  <div className="usa-alert-body">
                    <strong>Note:</strong> Since you’re signed in to your
                    account, you can save your release authorization in progress
                    and come back later to finish filling it out.
                  </div>
                </div>
                <br />
              </div>
            }
            hideUnauthedStartLink
            displayNonVeteranMessaging
          >
            Please complete the 21-0845 form to apply for disclosure
            authorization.
          </SaveInProgressIntro>
        )}
        <va-omb-info
          res-burden={5}
          omb-number="2900-0736"
          exp-date="02/28/2026"
        />
      </article>
    );
  }
}

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  userIdVerified: PropTypes.bool,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IntroductionPage);
/* eslint-enable @department-of-veterans-affairs/prefer-telephone-component */
