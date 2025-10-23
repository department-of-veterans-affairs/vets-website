import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Request to be a substitute claimant for a deceased claimant',
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
    <p>
      Use this form if someone you’re connected to dies before we finish
      processing their VA claim and you want to continue their claim.
    </p>
    <h2>What to know before you fill out the form</h2>
    <ul>
      <li>
        The person with the claim (called the “deceased claimant") must have
        died before we decided their claim, decision review, or appeal. You
        can’t file a new claim for a Veteran’s disability after their death.
      </li>
      <li>
        We follow a specific order (or line of succession) for who can be a
        substitute claimant based on their relationship to the deceased
        claimant. For example, if a Veteran with an open claim dies and they
        have a living spouse, only the spouse can be their substitute claimant.
      </li>
      <li>
        We must receive your request within 1 year of the deceased claimant’s
        death. If a substitute claimant dies, then the next person in the line
        of succession has 1 year to request to be the substitute claimant.
      </li>
      <li>
        If we approve your request to be a substitute claimant, you can help us
        gather the evidence we need to complete the claim. And if we approve the
        claim, we’ll pay you the accrued benefits (or backpay) that we would
        have owed the deceased claimant before their death.
      </li>
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
