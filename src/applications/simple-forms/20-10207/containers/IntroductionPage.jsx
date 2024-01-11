import React from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

import { TITLE, SUBTITLE } from '../config/constants';
import manifest from '../manifest.json';

const IntroductionPage = props => {
  const { route } = props;
  // WIP: need to keep unit-tests passing with these new selector-hooks
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));

  const childContent = (
    <>
      <p>
        Use this form to request that we process your claim faster due to
        certain situations.
      </p>
      <h2>What to know before you fill out this form</h2>
      <p>
        If any of these descriptions are true for you, you may qualify for
        priority processing. That means we’ll make a faster decision on your
        claim.
      </p>
      <p>One of these descriptions must be true:</p>
      <ul>
        <li>
          You’re homeless or at risk of becoming homeless, <b>or</b>
        </li>
        <li>
          You’re experiencing extreme financial hardship (such as loss of your
          job or a sudden decrease in income), <b>or</b>
        </li>
        <li>
          You have ALS (amyotrophic lateral sclerosis), also known as Lou
          Gehrig’s disease, <b>or</b>
        </li>
        <li>
          You have a terminal illness (a condition that can’t be treated),{' '}
          <b>or</b>
        </li>
        <li>
          You have a Very Seriously Injured or Ill (VSI) or Seriously Injured or
          Ill (SI) status from the Defense Department (DOD) (this status means
          you have a disability from a military operation that will likely
          result in your discharge from the military), <b>or</b>
        </li>
        <li>
          You’re age 85 or older, <b>or</b>
        </li>
        <li>
          You’re a former prisoner of war, <b>or</b>
        </li>
        <li>You received the Medal of Honor or the Purple Heart award</li>
      </ul>
      <p>
        We may need supporting documents based on the situation. If you don’t
        have supporting documents, you can still submit your request. But we’ll
        process your request faster if you submit all of the documents that you
        have available.
      </p>
      <h2>Types of evidence to submit</h2>
      <p>You can submit any of these types of evidence.</p>
      <p>
        <b>Note:</b> Please don’t send original documents. Send copies instead.
      </p>
      <h3>For extreme financial hardship</h3>
      <ul>
        <li>Eviction or foreclosure notice</li>
        <li>Notices of past-due utility bills</li>
        <li>Collection notices from creditors</li>
      </ul>
      <h3>For ALS or other terminal illnesses</h3>
      <ul>
        <li>Medical evidence and diagnosis</li>
      </ul>
      <p>
        <b>Note:</b> If you want us to get your private treatment records,
        you’ll need to submit an authorization to release non-VA medical
        information to us (VA Forms 21-4142 and 21-4142a).
      </p>
      <p>
        <a
          href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Submit an authorization online to release non-VA medical information
          to us (opens in new tab)
        </a>
      </p>
      <h3>
        For Very Seriously Injured or Ill (VSI) or Seriously Injured or Ill (SI)
      </h3>
      <ul>
        <li>
          Military personnel records, such as a determination from the DOD
        </li>
        <li>Medical evidence showing severe disability or injury</li>
      </ul>
      <h3>For former prisoners or war</h3>
      <ul>
        <li>Military personnel records, such as DD214</li>
        <li>Service number and branch and dates of service</li>
        <li>Dates and location of internment</li>
        <li>Detaining power or other relevant information</li>
      </ul>
      <h3>For Medal of Honor or Purple Heart award recipients</h3>
      <ul>
        <li>Military personnel records, such as DD214</li>
        <li>
          Information showing receipt of Medal of Honor or Purple Heart award
        </li>
      </ul>
      <h2>How to submit supporting evidence</h2>
      <ul>
        <li>
          You can upload your documents online as you complete this form. This
          will help us process your request faster.
        </li>
        <li>You can also send copies of your documents by mail.</li>
      </ul>
      <va-additional-info trigger="Where can I send documents by mail?" uswds>
        <p>
          Find the benefit type you’re requesting priority processing for. Then
          use the corresponding mailing address.
        </p>
        <p />
        <p className="vads-u-padding-top--2 vads-u-font-weight--bold">
          Compensation claims
        </p>
        <p>
          Department of Veterans Affairs Compensation Intake Center
          <br />
          PO Box 4444
          <br />
          Janesville, WI 53547-4444
        </p>
        <p className="vads-u-padding-top--2 vads-u-font-weight--bold">
          Pension and survivors benefit claims
        </p>
        <p>
          Department of Veterans Affairs Pension Intake Center
          <br />
          PO Box 5365
          <br />
          Janesville, WI 53547-5365
        </p>
        <p className="vads-u-padding-top--2 vads-u-font-weight--bold">
          Board of Veterans’ Appeals
        </p>
        <p>
          Department of Veterans Affairs Board of Veterans' Appeals
          <br />
          PO Box 27063
          <br />
          Washington, DC 20038
        </p>
        <p className="vads-u-padding-top--2 vads-u-font-weight--bold">
          Fiduciary
        </p>
        <p>
          Department of Veterans Affairs Fiduciary Intake Center
          <br />
          PO Box 5211
          <br />
          Janesville, WI 53547-5211
        </p>
      </va-additional-info>
      <h2 id="start-your-request">Start your request</h2>
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
          <div
            className="id-not-verified-content vads-u-margin-top--4"
            data-testid="verifyIdAlert"
          >
            <va-alert status="continue">
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

  const content = {
    formTitle: TITLE,
    formSubTitle: SUBTITLE,
    authStartFormText: 'Start your request for priority processing',
    unauthStartText: 'Sign in to start filling out your form',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };

  const ombInfo = {
    resBurden: '7',
    ombNumber: '2900-0877',
    expDate: '8/31/2026',
  };

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
};

export default IntroductionPage;
