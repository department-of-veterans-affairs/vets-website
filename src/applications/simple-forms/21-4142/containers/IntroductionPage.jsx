import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Authorize the release of non-VA medical information to VA',
  formSubTitle:
    'Authorization to disclose information to the Department of Veterans Affairs (VA Forms 21-4142 and 21-4142a)',
  authStartFormText: 'Start the medical records authorization',
  saveInProgressText:
    'Please complete the 21-4142 form to authorize the release of non-VA medical records to VA.',
  displayNonVeteranMessaging: true,
};

const ombInfo = {
  resBurden: '10',
  ombNumber: '2900-0858',
  expDate: '07/31/2024',
};

const childContent = (
  <>
    <p>
      Complete this form if you want to give us permission to request your
      medical records and information from non-VA sources to support your
      benefit claim. You can use this form to authorize the release of
      information on behalf of a Veteran you support.
    </p>
    <h2 className="vads-u-font-size--h3">
      Non-VA sources we may request your medical records and information from
    </h2>
    <ul className="vads-u-margin-bottom--4">
      <li>
        All sources of medical information (like hospitals, clinics, labs,
        physicians, and psychologists)
      </li>
      <li>Social workers and rehabilitation counselors</li>
      <li>Health care providers who conduct claim exams for us</li>
      <li>Employers, insurance companies, or workers’ compensation programs</li>
      <li>
        People who may know about your condition (like family, neighbors,
        friends, and public officials)
      </li>
    </ul>

    <h2 className="vads-u-font-size--h3">
      What to know before you fill out this form
    </h2>
    <ul className="vads-u-margin-bottom--4">
      <li>
        If you already provided your private, non-VA medical records to us, or
        if you intended to get them yourself, you don’t need to submit this
        form. Submitting the form in this case will add time to your claim
        process.
      </li>
      <li>You don’t need to submit this form to request VA medical records.</li>
      <li>
        By law, we can’t pay any fees that a source may charge to release your
        medical records. If a source charges a fee, we’ll contact you to tell
        you how to get the records.
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
