import React from 'react';
import { getCernerURL } from 'platform/utilities/cerner';

const OracleHealthMessagingIssuesAlert = () => {
  return (
    <va-alert class="vads-u-margin-bottom--1" status="warning" visible>
      <h2 slot="headline">We’re working on messages right now</h2>
      <p>
        We’re sorry. Some of your messages might not be here. We’re working to
        fix this.
      </p>
      <p>To review all your messages, go to My VA Health</p>
      <p>
        <va-link
          href={getCernerURL('/pages/messaging/inbox', true)}
          rel="noopener noreferrer"
          text="Go to My VA Health"
        />
      </p>
    </va-alert>
  );
};

export default OracleHealthMessagingIssuesAlert;
