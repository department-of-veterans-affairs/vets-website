import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Apply for an adapted housing grant',
  formSubTitle:
    'Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant (VA Form 26-4555)',
  authStartFormText: 'Start the housing grant application',
  saveInProgressText:
    'Please complete the 26-4555 form to apply for adapted housing.',
};

const ombInfo = {
  resBurden: '10',
  ombNumber: '2900-0132',
  expDate: '6/20/2024',
};

const childContent = (
  <>
    <h2>Here’s how to apply online</h2>
    <p>
      Complete this form. After you submit the form, you’ll get a confirmation
      message. You can print this page for your records.
    </p>
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
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
