import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';
import manifest from '../manifest.json';
import {
  ADDITIONAL_INFO_THIRD_PARTY,
  SUBTITLE,
  TITLE,
} from '../config/constants';

const ombInfo = {
  resBurden: '5',
  ombNumber: '2900-8777',
  expDate: '08/31/2026',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle: TITLE,
    formSubTitle: SUBTITLE,
    authStartFormText: 'Start your request',
    unauthStartText: 'Sign in to start your request',
    hideSipIntro: userLoggedIn && !userIdVerified,
    displayNonVeteranMessaging: true,
  };

  const childContent = (
    <>
      <p>
        Use this form to access personal military, compensation, pension, or
        benefit records.
      </p>
      <h2>What to know before filling out this form</h2>
      <p>
        If you want to request your records through this online form, you’ll
        need to sign in to your account. You’ll need to verify your identity, so
        we encourage you to use a <strong>Login.gov</strong> or{' '}
        <strong>ID.me</strong> account.
      </p>
      <p>
        <a
          href="https://www.va.gov/resources/verifying-your-identity-on-vagov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about verified accounts (opens in new tab)
        </a>
        .
      </p>
      <p>
        <strong>Note:</strong> You need to be a U.S. citizen or a legal
        permanent resident to access your records under the Privacy Act (PA).
      </p>
      <p>
        If you’re a third-party representative or power of attorney requesting
        records for someone else, you can’t submit this online form. You’ll need
        to submit a FOIA request online using the Public Access Link (PAL).
      </p>
      <p>
        <a
          href="https://www.va.gov/FOIA/index.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Submit a FOIA request online (opens in new tab)
        </a>
        .
      </p>
      <p>Or you can submit a PDF version of this form.</p>
      <h2>What types of information can I request?</h2>
      <p>You can request any of these kinds of personal records:</p>
      <h3 className="vads-u-font-size--h6">Compensation and pension records</h3>
      <ul>
        <li>
          Certificate of Release or Discharge from Active Duty (DD Form 214)
        </li>
        <li>Claims file (C-file)</li>
        <li>Disability examinations (C&P exams)</li>
        <li>Official military personnel file (OMPF)</li>
        <li>Pension benefit documents</li>
        <li>Service or military treatment</li>
        <li>Other compensation and pension records</li>
      </ul>
      <h3 className="vads-u-font-size--h6">Benefit records</h3>
      <ul>
        <li>Education benefit</li>
        <li>Fiduciary services</li>
        <li>Financial records</li>
        <li>Home loan benefit</li>
        <li>Life insurance benefit</li>
        <li>Vocational rehabilitation and employment</li>
        <li>Other benefit record</li>
      </ul>
      <div className="vads-u-margin-top--4">
        <va-alert status="warning" uswds visible>
          <div className="vads-u-margin-y--0">
            Only use the online form if you’re requesting your own records
          </div>
        </va-alert>
      </div>
      <div className="vads-u-margin-y--4">{ADDITIONAL_INFO_THIRD_PARTY}</div>
      <h2 id="start-your-request">Start your request</h2>
      <p>
        <strong>Note</strong>: You’ll need to sign in with a verified{' '}
        <strong>Login.gov</strong> or <strong>ID.me</strong> account or a
        Premium <strong>DS Logon</strong> or <strong>My HealtheVet</strong>{' '}
        account. If you don’t have any of those accounts, you can create a free{' '}
        <strong>Login.gov</strong> or <strong>ID.me</strong> account now.
      </p>
      {userLoggedIn &&
      !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
          <div className="id-not-verified-content vads-u-margin-top--4">
            <va-alert status="continue" uswds visible>
              <h3 slot="headline">
                You’ll need to verify your identity to request your records
              </h3>
              <p>
                We need to make sure you’re you — and not someone pretending to
                be you — before we can give you access to your personal
                information. This helps to keep your information safe, and to
                prevent fraud and identity theft.
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
              download and complete the PDF version of this request.
            </p>
            <p className="vads-u-margin-y--3">
              <va-link
                download
                href="https://www.vba.va.gov/pubs/forms/VBA-20-10206-ARE.pdf"
                text="Get VA Form 20-10206 to download"
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
      userIdVerified={userIdVerified}
      userLoggedIn={userLoggedIn}
    />
  );
};

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
