import React from 'react';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

export const notLoggedInContent = props => (
  <div>
    <h2>Sign in to apply, get your COE, or check your status</h2>
    <p>Sign into VA.gov if you want to:</p>
    <ul className="vads-u-padding-bottom--4">
      <li>Apply for a COE</li>
      <li>Find out if you already have a COE and download it</li>
      <li>Find out the status of your application</li>
    </ul>
    <h2>You may be able to get an automatic COE online</h2>
    <p>
      If we have all the information we need when you sign in, you may get a COE
      automatically. If we don’t have enough information to create your COE
      automatically, we’ll ask you to apply for a COE by completing a Request
      for a Certificate of Eligibility.
    </p>
    <h2>Have you applied for a COE before?</h2>
    <p>
      If you think you received a VA home loan COE in the past, or if you
      applied for a COE and you haven’t heard back, we’ll check when you sign in
      and show your current status.
    </p>
    <SaveInProgressIntro
      prefillEnabled={props?.route?.formConfig?.prefillEnabled}
      messages={props?.route?.formConfig?.savedFormMessages}
      pageList={props?.route?.pageList}
      startText="Start the Application"
      headingLevel={2}
      hideUnauthedStartLink
    />
  </div>
);
