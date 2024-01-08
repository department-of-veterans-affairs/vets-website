import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';

import manifest from '../manifest.json';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const ombInfo = {
  resBurden: '10',
  ombNumber: '2900-0858',
  expDate: '07/31/2024',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle: 'Authorize the release of non-VA medical information to VA',
    formSubTitle:
      'Authorization to disclose information to the Department of Veterans Affairs (VA) (VA Forms 21-4142 and 21-4142a)',
    authStartFormText: 'Start the medical release authorization',
    saveInProgressText:
      'Please complete the 21-4142 form to authorize the release of non-VA medical records to VA.',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };
  const childContent = (
    <>
      <p>
        Complete this form if you want to give us permission to request your
        records from a non-VA source to support your benefit claim. You can also
        use this form to authorize the release of records on behalf of a Veteran
        you support.
      </p>
      <h2 className="vads-u-font-size--h3">
        What to know before you submit this form
      </h2>
      <ul className="vads-u-margin-bottom--4">
        <li>
          If you already provided your private, non-VA medical records to us, or
          if you intended to get them yourself, you don’t need to submit this
          form. Submitting the form in this case will add time to your claim
          process.
        </li>
        <li>
          You don’t need to submit this form to request VA medical records.
        </li>
        <li>
          By law, we can’t pay any fees that may come from requesting your
          medical records.
        </li>
      </ul>
      <h2 id="start-your-request">Start your authorization</h2>
      <p>
        <strong>Note</strong>: You’ll need to sign in with a verified{' '}
        <strong>Login.gov</strong> or <strong>ID.me</strong> account or a
        Premium <strong>DS Logon</strong> or <strong>My HealtheVet</strong>{' '}
        account. If you don’t have any of those accounts, you can create a free{' '}
        <strong>Login.gov</strong> or <strong>ID.me</strong> account when you
        sign in to start filling out your form.
      </p>
      {userLoggedIn &&
      !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
          <div className="id-not-verified-content vads-u-margin-top--4">
            <va-alert status="continue" uswds>
              <h3 slot="headline">
                You’ll need to verify your identity to authorize the release of
                non-VA medical records to VA
              </h3>
              <p>
                We need to make sure you’re you — and not someone pretending to
                be you — before we can give you access to your personal and
                health-related information. This helps to keep your information
                safe, and to prevent fraud and identity theft.
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
              If you don’t want to verify your identity right now, you can still
              download and complete the PDF version of this authorization.
            </p>
            <p className="vads-u-margin-y--3">
              <va-link
                download
                href="https://www.vba.va.gov/pubs/forms/VBA-21-4142-ARE.pdf"
                text="Get VA Form 21-4142 to download"
              />
            </p>
          </div>
        )}
    </>
  );

  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
    />
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

const mapStateToProps = state => ({
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IntroductionPage);
