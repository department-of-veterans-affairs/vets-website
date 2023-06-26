import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Sign for benefits on behalf of another person',
  formSubTitle: 'Alternate signer certification (VA Form 21-0972)',
  authStartFormText: 'Start the alternate signer application',
  unauthStartText: 'Sign in to start your request',
  saveInProgressText:
    'Please complete the 21-0972 form to apply to be an alternate signer.',
  displayNonVeteranMessaging: true,
};

const ombInfo = {
  resBurden: '15',
  ombNumber: '2900-0849',
  expDate: '02/28/2026',
};

// TODO: update page
const childContent = (
  <>
    <h2>When to use this form</h2>
    <p>
      This application certifies you as an alternate signer and allows the VA to
      accept benefit applications signed by you on behalf of a Veteran or
      claimant. For purposes of this form, the individual signing the form on
      behalf of the veteran/claimant is referred to as the "alternate signer."
      Your accurate and complete answers to the questions on this form are
      important to help VA complete the veteran or claimant’s claim.
    </p>
  </>
);

export const IntroductionPage = ({ route }) => {
  const additionalChildContent = (
    <>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to complete the alternate signer application
      </h2>
      <va-process-list>
        <li>
          <h3>Prepare</h3>
          <h4>
            To fill out this application you’ll need the Veteran’s and/or
            Claimant’s:
          </h4>
          <ul>
            <li>Social Security number</li>
            <li>Va file number (if they have one)</li>
          </ul>
          <p>
            <strong>What if I need help filling out my application?</strong> If
            you have trouble using this online form, call us at 800-698-2411
            (TTY: 711). We’re here 24/7. If you need help gathering your
            information or filling out your form, contact a local Veterans
            Service Organization (VSO).
          </p>
          <p>
            <a href="/vso">Find a local Veterans Service Organization</a>
          </p>
        </li>
        <li>
          <h3>Start your application</h3>
          <p>Complete this form.</p>
          <p>
            After you submitting form, you’ll get a confirmation message. You
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
        startText={content.authStartFormText}
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
