import React from 'react';

import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Request personal records',
  formSubTitle:
    'Freedom of Information Act (FOIA) and Privacy Act (PA) Request (VA Form 20-10206)',
  authStartFormText: 'Start filling out your request',
  unauthStartText: 'Sign in to start filling out your request',
};

const ombInfo = {
  resBurden: '5',
  ombNumber: '2900-8777',
  expDate: '08/31/2026',
};

const childContent = (
  <>
    <p>
      Use this form to access personal military, compensation, pension, or
      benefit records.
    </p>
    <h2>What to know before submitting your request</h2>
    <p>
      This form is for requesting access to personal VA records{' '}
      <strong>only</strong>. If you’re seeking general information about VA
      policies or programs, or if you’re a third-party or power of attorney
      request on behalf of someone else,{' '}
      <a
        href="https://www.va.gov/FOIA/index.asp"
        target="_blank"
        rel="noopener noreferrer"
      >
        submit a FOIA request (opens in new tab)
      </a>
      .
    </p>
    <va-additional-info trigger="What is a Privacy Act (PA) request?">
      <div>
        <p>
          The Privacy Act provides a citizen of the United States or an alien
          lawfully admitted for permanent residence the right to request access
          or amend records on themself from a System of Records (SORs). Examples
          of PA records are personal Claims Files (C-File), educational loan,
          and beneficiary records.
        </p>
        <p>
          <a
            href="https://department.va.gov/privacy/privacy-act-requests/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about filing PA requests (opens in new tab)
          </a>
        </p>
      </div>
    </va-additional-info>
    <h2>Who can submit this request?</h2>
    <p>
      If you’re looking for your own records, you have the option to sign in to
      your account to complete and submit the request online. Your
      identification will need to be verified, so we encourage you to use a{' '}
      <strong>Login.gov</strong> or <strong>ID.me</strong> account.
    </p>
    <p>
      <a href="https://www.va.gov/resources/verifying-your-identity-on-vagov/">
        Learn more about verified accounts
      </a>
    </p>
    <div className="vads-u-margin-y--2">
      <va-alert status="warning" visible>
        <div className="vads-u-margin-y--0">
          Only use the online form if you’re requesting your own records
        </div>
      </va-alert>
    </div>
    <div className="vads-u-margin-y--2">
      <va-additional-info trigger="How do I request personal records for someone else?">
        <div>
          <p>
            If you’re asking for someone else’s records, submit a FOIA request
            (opens in new tab). You’ll need to have proper authorization on
            record for your request to be processed:
          </p>
          <p>A third-party representative</p>
          <ul>
            <li>
              A third-party may be a family member or other assigned person who
              is not a power of attorney, agent, or fiduciary.{' '}
              <a href="https://www.va.gov/FOIA/index.asp">
                VA Form 21-0845 Authorization to Disclose Personal Information
                to a Third-Party (link opens in new tab)
              </a>{' '}
              must be on record to fill out this form on behalf of a Veteran or
              non-Veteran claimant.
            </li>
          </ul>
          <p>A power of attorney</p>
          <ul>
            <li>
              A power of attorney must have{' '}
              <a
                href="https://www.va.gov/find-forms/about-form-21-22/"
                target="_blank"
                rel="noopener noreferrer"
              >
                VA Form 21-22 Appointment of Veterans Service Organization as
                Claimant’s Representative (opens in new tab)
              </a>
              , or{' '}
              <a
                href="https://www.va.gov/find-forms/about-form-21-22a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                VA Form 21-22a Appointment of Individual as Claimant’s
                Representative (link opens in new tab)
              </a>{' '}
              on record to fill out this form on behalf of a Veteran or
              non-Veteran claimant.
            </li>
          </ul>
        </div>
      </va-additional-info>
    </div>
  </>
);

export const IntroductionPage = ({ route }) => {
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
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage;
