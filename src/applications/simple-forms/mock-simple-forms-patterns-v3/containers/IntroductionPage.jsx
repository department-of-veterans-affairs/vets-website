import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: '[Plain Language title of form that starts with a verb]',
  formSubTitle: 'Equal to VA Form MOCK-FORM-PATTERNS (Mock Form Patterns)',
  authStartFormText: 'Start the Application',
  saveInProgressText:
    'Please complete the MOCK-FORM-PATTERNS form to apply for web component examples.',
};

const ombInfo = {
  resBurden: '10',
  ombNumber: 'MOCK_FORM_PATTERNS',
  expDate: '12/31/2024',
};

const childContent = (
  <>
    <h2>Here’s how to apply online</h2>
    <p>
      Complete this form. After you submit the form, you’ll get a confirmation
      message. You can print this page for your records.
    </p>
    <h3>Pages</h3>
    <ul>
      <li>
        <a href="/mock-form-patterns/personal-information-1">
          Personal information
        </a>
      </li>
      <li>
        <a href="/mock-form-patterns/personal-information-2">
          Identification information
        </a>
      </li>
      <li>
        <a href="/mock-form-patterns/mailing-address">Mailing address</a>
      </li>
      <li>
        <a href="/mock-form-patterns/contact-information">
          Contact information
        </a>
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
