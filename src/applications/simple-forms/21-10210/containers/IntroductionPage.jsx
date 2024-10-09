import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Submit a lay or witness statement to support a VA claim',
  formSubTitle: 'Lay/Witness Statement (VA Form 21-10210)',
  authStartFormText: 'Start your statement',
  unauthStartText: 'Sign in to start your statement',
  saveInProgressText: 'Please complete the 21-10210 form to apply for claims.',
  displayNonVeteranMessaging: true,
  verifiedPrefillAlert: (
    <div>
      <div className="usa-alert usa-alert-info schemaform-sip-alert">
        <div className="usa-alert-body">
          <strong>Note:</strong> Since you’re signed in to your account, you can
          save your statement in progress and come back later to finish filling
          it out.
        </div>
      </div>
      <br />
    </div>
  ),
};

const ombInfo = {
  resBurden: '10',
  ombNumber: '2900-0881',
  expDate: '07/31/2027',
};

const childContent = (
  <>
    <p>
      Use this form to submit a formal statement to support your VA claim—or the
      claim of another Veteran or eligible family member. People also sometimes
      call this statement a “buddy statement.”
    </p>
    <h2>What to know before you complete this form</h2>
    <ul>
      <li>
        You can submit a statement to support your own VA claim or someone
        else’s VA claim.
      </li>
      <li>
        To submit a statement to support someone else’s claim, you’ll need to
        give us information like their date of birth, Social Security number, VA
        file number (if available), and contact information.
      </li>
      <li>
        Each statement needs its own form. If you want to submit more than one
        statement about your claim, use a new form for each statement. If you
        want more than one person to submit a statement to support your claim,
        ask each person to use a separate form.
      </li>
    </ul>
  </>
);

export const IntroductionPage = ({ route }) => {
  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
      devOnly={{
        forceShowFormControls: true,
      }}
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
