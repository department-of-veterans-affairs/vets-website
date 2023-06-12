import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Request to be a substitute claimant',
  formSubTitle:
    'Request for substitution of claimant upon death of claimant (VA Form 21P-0847)',
  authStartFormText: 'Start your request to be a substitute claimant',
  unauthStartText: 'Sign in to start your request',
  saveInProgressText:
    'Please complete the 21P-0847 form to apply for substitute claimant.',
  displayNonVeteranMessaging: true,
};

const ombInfo = {
  resBurden: '5',
  ombNumber: '2900-0740',
  expDate: '12/31/2024',
};

const childContent = (
  <>
    <h2>When to use this form</h2>
    <p>
      This form allows claimants to request substitution for a claimant, who
      passed away, prior to VA processing a claim to completion. This is only
      allowed when a claimant dies while a claim, decision review request or
      appeal for any benefit under a law administered by VA is pending. The
      substitute claimant would be eligible to receive accrued benefits due a
      deceased claimant under Section 5121(a) of title 38, if a request to be
      substituted as the claimant for the purposes of processing the claim to
      completion is filed no later than one year after the date of the death of
      such claimant.
    </p>
  </>
);

export const IntroductionPage = ({ route }) => {
  const additionalChildContent = (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Follow the steps below to apply for substitute claimant.
      </h2>
      <va-process-list>
        <li>
          <h3>Prepare</h3>
          <h4>To fill out this request, you’ll need:</h4>
          <ul>
            <li>The Veteran’s and claimant’s Social Security numbers</li>
          </ul>
          <p>
            <strong>What if I need help filling out my request?</strong> If you
            have trouble using this online form, call us at 800-698-2411 (TTY:
            711). We’re here 24/7. If you need help gathering your information
            or filling out your form, contact a local Veterans Service
            Organization (VSO).
            <a href="/vso">Find a local Veterans Service Organization</a>
          </p>
        </li>
        <li>
          <h3>Start your request</h3>
          <p>Complete this form.</p>
          <p>
            After completing the request, you’ll get a confirmation message. You
            can print this for your records.
          </p>
        </li>
      </va-process-list>
      <SaveInProgressIntro
        buttonOnly
        headingLevel={2}
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        pageList={route.pageList}
        startText="Start your request to be a substitute claimant"
      />
    </>
  );

  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
      additionalChildContent={additionalChildContent}
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

export default IntroductionPage;
