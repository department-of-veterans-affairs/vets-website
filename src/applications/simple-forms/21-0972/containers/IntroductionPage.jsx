import React from 'react';
import PropTypes from 'prop-types';

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
    <h2>What to know before you fill out this form</h2>
    <p>An alternate signer can only be one of the following:</p>
    <ul>
      <li>A court-appointed representative</li>
      <li>
        An attorney in fact or agent authorized to act on behalf of the claimant
        under durable power of attorney
      </li>
      <li>
        A person who is responsible for the care of the claimant, to include but
        not limited to a spouse or other relative
      </li>
      <li>
        A manager or principal officer acting on behalf of an institution which
        is responsible for the care of the claimant
      </li>
    </ul>
    <p>
      The Veteran or claimant you are certifying to be an alternate signer for
      must be one of the following:
    </p>
    <ul>
      <li>Under 18 years of age</li>
      <li>
        Mentally incompetent to provide substantially accurate information
        needed to complete the claims form, or to certify that statements made
        on the form are true and complete, or
      </li>
      <li>Physically unable to sign the claims form</li>
    </ul>
    <br />
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
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
