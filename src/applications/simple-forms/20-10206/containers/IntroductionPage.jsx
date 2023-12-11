import React from 'react';

import PropTypes from 'prop-types';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { connect } from 'react-redux';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const ombInfo = {
  resBurden: '5',
  ombNumber: '2900-8777',
  expDate: '08/31/2026',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle: 'Request personal records',
    formSubTitle:
      'Freedom of Information Act (FOIA) and Privacy Act (PA) Request (VA Form 20-10206)',
    authStartFormText: 'Start your request',
    unauthStartText: 'Sign in to start your request',
    hideSipIntro: userLoggedIn && !userIdVerified,
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
        need to sign in to your account. To manage certain tasks and information
        on VA.gov, like requesting personal records or changing your direct
        deposit information, you’ll need to log in with an account where you’ve
        provided some personal information to verify your identity. We recommend
        using <strong>ID.me</strong> or <strong>Login.gov</strong> accounts for
        identity verification.
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
      <h2>Type of information you can request</h2>
      <p>You can request any of these kinds of personal records:</p>
      <p>
        <strong>Compensation and pension records</strong>
      </p>
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
      <p>
        <strong>Benefit records</strong>
      </p>
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
      <div className="vads-u-margin-y--4">
        <va-additional-info trigger="How do I request personal records for someone else?">
          <div>
            <p>
              If you’re asking for someone else’s records,{' '}
              <a
                href="https://www.va.gov/FOIA/index.asp"
                target="_blank"
                rel="noopener noreferrer"
              >
                submit a FOIA request (opens in new tab)
              </a>
              . You’ll need to have proper authorization on record for your
              request to be processed.
            </p>
            <ul>
              <li>
                <strong>If you’re a third-party representative</strong> (a
                family member or other assigned person who is not a power of
                attorney, agent, or fiduciary) requesting VA records for someone
                else, we must have an authorization form on record (VA Form
                21-0845) for us to release their information.
                <a
                  href="https://www.va.gov/find-forms/about-form-21-0845/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vads-u-display--block vads-u-margin-top--2"
                >
                  Go to VA Form 21-0845 Authorization to Disclose Personal
                  Information to a Third-Party (opens in new tab)
                </a>
              </li>
              <li className="vads-u-margin-top--2">
                <strong>If you’re a power of attorney</strong> requesting VA
                records for someone else, we must have an official record that
                you were appointed as their representative (VA Form 21-22 or VA
                Form 21-22a).
                <a
                  href="https://www.va.gov/find-forms/about-form-21-22/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vads-u-display--block vads-u-margin-top--2"
                >
                  Go to VA Form 21-22 Appointment of Veterans Service
                  Organization as Claimant’s Representative (opens in new tab)
                </a>
                <a
                  href="https://www.va.gov/find-forms/about-form-21-22a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vads-u-display--block vads-u-margin-top--2"
                >
                  Go to VA Form 21-22a Appointment of Individual as Claimant’s
                  Representative (opens in new tab)
                </a>
              </li>
            </ul>
          </div>
        </va-additional-info>
      </div>
      <h2>Start your request</h2>
      {userLoggedIn &&
      !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
          <div className="id-not-verified-content vads-u-margin-top--4">
            <va-alert
              class="vads-u-margin-bottom--1"
              close-btn-aria-label="Close notification"
              disable-analytics="false"
              full-width="false"
              slim
              status="error"
              uswds
              visible="true"
            >
              <h3 slot="headline">We need to verify your identity</h3>
              <p className="vads-u-font-size--base">
                We’re sorry, but you’ll need to verify your identity before you
                can continue with this request online.
              </p>
              <p>
                To manage certain tasks and information on VA.gov, like
                requesting personal records or changing your direct deposit
                information, you’ll need to create a <strong>Login.gov</strong>{' '}
                or <strong>ID.me</strong> account and verify your identity.
              </p>
              <p>
                <a
                  href="https://www.va.gov/resources/verifying-your-identity-on-vagov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vads-c-action-link--green"
                >
                  Verify your identity (opens in new tab)
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
