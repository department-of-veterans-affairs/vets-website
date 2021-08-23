import React from 'react';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

export const notLoggedInContent = props => (
  <div>
    <va-alert status="info">
      <h2 slot="headline">You may be able to get an automatic COE online</h2>
      <div>
        <p>
          If we have all the information we need, you won’t need to fill out the
          application. We’ll create an automatic COE for you right away
        </p>
        <p>
          If we need moire information, we’ll ask you to fill out an
          application. Sign in to find out if you can get an automatic COE.
        </p>
      </div>
    </va-alert>
    <h2>Apply, get your COE, or check your status</h2>
    <p>Sign into VA.gov if you want to:</p>
    <ul className="vads-u-padding-bottom--4">
      <li>Apply for a COE</li>
      <li>Find out if you already have a COE and download it</li>
      <li>Find out the status of your application</li>
    </ul>
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
