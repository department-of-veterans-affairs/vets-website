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
          title="Submit an intent to file"
          subTitle="Intent to File a Claim for Compensation and/or Pension, or Survivors Pension and/or DIC (VA Form 21-0966)"
        />
        <p>
          Use this form if you plan to file a disability or pension claim. If
          you notify us of your intent to file and we approve your claim, you
          may be able to get retroactive payments. Retroactive payments are
          payments for the time between when we processed your intent to file
          and when we approved your claim. An intent to file sets a potential
          start date (or effective date) for your benefits.
        </p>
        <h2>What to know before you fill out this form</h2>
        <ul>
          <li>
            After you submit your intent to file, you have{' '}
            <strong>1 year</strong> to complete and file your claim. After 1
            year, the potential effective date for your benefits will expire.
          </li>
          <li>
            In some cases, it may take us a few days to process your intent to
            file after you submit it. We'll let you know what your potential
            effective date is after we process your intent to file.
          </li>
        </ul>
        <h2>What to know if you're signing on behalf of someone else</h2>
        <p>
          We'll need to have one of these forms showing that you're authorized
          to sign for the person filing the claim:
        </p>

        <ul>
          <li>
            <a href="https://www.va.gov/supporting-forms-for-claims/alternate-signer-form-21-0972/introduction">
              VA Form 21-0972 (Alternate Signer Certification)
            </a>
          </li>
          <li>
            <a href="https://www.va.gov/find-forms/about-form-21-22/">
              VA Form 21-22 (Appointment of Veterans Service Organization as
              Claimant's Representative)
            </a>
          </li>
          <li>
            <a href="https://www.va.gov/find-forms/about-form-21-22a/">
              VA Form 21-22a (Appointment of Individual As Claimant's
              Representative)
            </a>
          </li>
        </ul>
        <p>
          <strong>Note:</strong> If you've already submitted one of these forms,
          you don't need to do anything else. If you haven't, submit one of
          these forms before you submit an intent to file.
        </p>
        <va-alert
          class="vads-u-margin-bottom--1"
          close-btn-aria-label="Close notification"
          disable-analytics="false"
          full-width="false"
          status="info"
          visible
          uswds
        >
          <p className="vads-u-margin-y--0">
            This form only tells us that you plan to file a claim. To get
            benefits, you'll need to complete and file the claim application.
            And then we'll need to approve it.
          </p>
        </va-alert>
        <h2>Claims you can file after filling out this form</h2>
        <p>
          After you complete this form, we'll direct you to one or more of these
          benefit applications for you to complete:
        </p>
        <ul>
          <li>
            <a href="https://www.va.gov/disability/file-disability-claim-form-21-526ez/introduction">
              Disability compensation claim (VA Form 21-526EZ)
            </a>
            . <strong>Note:</strong> If you start your disability claim online
            now, you don't need to fill out this intent to file form. When you
            start your disability application or Supplemental Claim online, it
            notifies us automatically of your intent to file.
          </li>
          <li>
            <a href="https://www.va.gov/find-forms/about-form-21p-527ez/">
              Pension claim (VA Form 21P-527EZ)
            </a>
          </li>
          <li>
            <a href="https://www.va.gov/find-forms/about-form-21p-534ez/">
              Pension claim for survivors (21P-534EZ)
            </a>
          </li>
        </ul>
        <h2 id="start-your-request">Start your intent to file</h2>
        <p>
          <strong>Note</strong>: You'll need to sign in with a verified{' '}
          <strong>Login.gov</strong> or <strong>ID.me</strong> account or a
          Premium <strong>DS Logon</strong> or <strong>My HealtheVet</strong>{' '}
          account. If you don't have any of those accounts, you can create a
          free <strong>Login.gov</strong> or <strong>ID.me</strong> account now.
        </p>
        {userLoggedIn &&
        !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
            <div className="id-not-verified-content vads-u-margin-top--4">
              <va-alert status="continue" uswds>
                <h2 slot="headline">
                  You’ll need to verify your identity to submit an intent to
                  file
                </h2>
                <p>
                  We need to make sure you're you — and not someone pretending
                  to be you — before we can give you access to your personal
                  information. This helps to keep your information safe, and to
                  prevent fraud and identity theft.
                </p>
                <p>
                  <strong>
                    This one-time process takes about 5-10 minutes.
                  </strong>
                </p>
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
                If you don't want to verify your identity right now, you can
                still download and complete the PDF version of this request.
              </p>
              <p className="vads-u-margin-y--3">
                <va-link
                  download
                  href="https://www.vba.va.gov/pubs/forms/VBA-21-0966-ARE.pdf"
                  text="Get VA Form 21-0966 to download"
                />
              </p>
            </div>
          )}
        {(!userLoggedIn || userIdVerified) && (
          <SaveInProgressIntro
            headingLevel={3}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            startText="Start your intent to file"
            unauthStartText="Sign in to start your intent to file"
            hideUnauthedStartLink
            pathname="/introduction"
            displayNonVeteranMessaging
            verifiedPrefillAlert={
              <div>
                <div className="usa-alert usa-alert-info schemaform-sip-alert">
                  <div className="usa-alert-body">
                    <strong>Note:</strong> Since you're signed into your
                    account, you can save your application in progress and come
                    back later to finish filling it out.
                  </div>
                </div>
                <br />
              </div>
            }
          >
            Please complete the 21-0966 form to apply for benefits claims.
          </SaveInProgressIntro>
        )}

        <va-omb-info
          res-burden="5"
          omb-number="2900-0858"
          exp-date="07/31/2024"
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
