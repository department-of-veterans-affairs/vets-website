import React from 'react';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import PropTypes from 'prop-types';

const NotLoggedInContent = ({ route }) => (
  <div>
    <h2 className="vads-u-margin-top--0">
      Sign in to request a COE, get your COE, or check your status
    </h2>
    <p>Sign into VA.gov if you want to:</p>
    <ul>
      <li>Request a COE</li>
      <li>Find out if you already have a COE and download it</li>
      <li>Check the status of your request</li>
    </ul>
    <h2>You may be able to get an automatic COE online</h2>
    <p>
      If we have all the information we need when you sign in, you may get a COE
      automatically. If we don’t have enough information to create your COE
      automatically, we’ll ask you to request a COE by completing a Request for
      a Certificate of Eligibility.
    </p>
    <h2>Have you requested a COE before?</h2>
    <p className="vads-u-padding-bottom--4">
      If you think you received a VA home loan COE in the past, or if you
      requested a COE and you haven’t heard back, we’ll check when you sign in
      and show your current status.
    </p>
    <SaveInProgressIntro
      prefillEnabled={route.formConfig?.prefillEnabled}
      messages={route.formConfig?.savedFormMessages || {}}
      pageList={route.pageList || []}
      startText="Request a Certificate of Eligibility"
      unauthStartText="Sign in to start your request"
      formConfig={route.formConfig || {}}
      headingLevel={2}
      hideUnauthedStartLink
    />
  </div>
);

NotLoggedInContent.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({}),
    pageList: PropTypes.shape([]),
  }),
};

export default NotLoggedInContent;
