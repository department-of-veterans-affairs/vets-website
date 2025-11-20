import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'VA Form 21P-4171',
  formSubTitle: 'VA Form 21P-4171',
  authStartFormText: 'Start your form',
  unauthStartText: 'Sign in to start your form',
  saveInProgressText: 'Please complete the 21P-4171 form to submit your form.',
  displayNonVeteranMessaging: false,
};

const ombInfo = {
  resBurden: '15',
  ombNumber: '2900-0000',
  expDate: '12/31/2024',
};

const childContent = (
  <>
    <p>Use this form to submit your VA Form 21P-4171.</p>
    <h2>What to know before you fill out the form</h2>
    <ul>
      <li>Make sure you have all the required information before you start.</li>
      <li>
        You can save your progress and come back to complete the form later.
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
