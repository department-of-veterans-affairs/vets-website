import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Sign VA claim forms as an alternate signer',
  formSubTitle: 'Alternate Signer Certification (VA Form 21-0972)',
  authStartFormText: 'Start the alternate signer application',
  unauthStartText: 'Sign in to start filling out your form',
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
    <p>
      Use this form if you’re signing a VA benefits application or related form
      on behalf of someone else. This form certifies you as an alternate signer
      for the Veteran or non-Veteran with a VA claim (also called the claimant).
      Answer this form accurately and completely to help us complete the
      claimant’s claim or request.
    </p>
    <h2>What to know before you fill out this form</h2>
    <b>You may qualify as an alternate signer if one of these describes you:</b>
    <ul>
      <li>You’re responsible for caring for the person with the claim.</li>
      <li>
        You’re appointed by the court to represent the person with the claim.
      </li>
      <li>
        You’re authorized to make decisions for the person with the claim under
        durable power of attorney.
      </li>
      <li>
        You’re a manager or principal officer representing an institution that’s
        caring for the person with the claim.
      </li>
    </ul>
    <b>
      And you must be able to verify that one of these descriptions is true for
      the person you’re signing for:
    </b>
    <ul>
      <li>They’re under 18 years old.</li>
      <li>
        They have an illness, injury, or other health condition that prevents
        their ability to make decisions for themselves or provide the
        information needed to complete forms.
      </li>
      <li>They physically can’t sign the forms.</li>
    </ul>
    <p>
      After you submit this form, we may ask you for documents or other
      information to verify that you qualify as an alternate signer. We may ask
      for any of these examples:
    </p>
    <ul>
      <li>
        Social Security number (SSN) or taxpayer identification number (TIN).
      </li>
      <li>
        A certificate or order from a court showing your authority to act for
        the person with the claim. The court must have competent jurisdiction,
        and the certificate or order must be signed and dated or time-stamped.
      </li>
      <li>
        A copy of documentation showing that you’re appointed as a fiduciary.
      </li>
      <li>
        Durable power of attorney showing the name and signature of the person
        with the claim, and your authority as attorney-in-fact or agent.
      </li>
      <li>
        Health care power of attorney, affidavit, or notarized statement from an
        institution or person responsible for the care of the claimant. The
        statement must explain the extent of provided care.
      </li>
      <li>Any other documentation showing relevant authorization.</li>
    </ul>
    <p>
      After you submit this form, you can sign any evidence on behalf of the
      claimant in support of their open claim. You can continue to sign forms
      related to the claim until it’s completed or closed—as long as you still
      qualify based on these descriptions. For example, if the person you’re
      signing for turns 18 years old and can complete the forms on their own,
      then you can’t continue to sign for them.
    </p>
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
