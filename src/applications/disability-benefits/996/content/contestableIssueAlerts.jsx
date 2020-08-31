import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import { disabilitiesExplanationAlert } from './contestedIssues';

const noIssuesMessage = (
  <>
    We don’t have any issues on file for you that are eligible for Higher-Level
    Review. These are called contestable issues. If you think this is an error,
    please call us at <Telephone contact={CONTACTS.VA_BENEFITS} />.
    {disabilitiesExplanationAlert}
  </>
);

const networkError = (
  <p>
    We’re having some connection issues on our end. Please refresh this page to
    try again.
  </p>
);

export const noContestableIssuesFound = (
  <AlertBox
    status="warning"
    headline="You have no issues eligible for a Higher-Level Review"
    content={noIssuesMessage}
  />
);

export const showContestableIssueError = (
  <AlertBox
    status="error"
    headline="We can’t load your issues"
    content={networkError}
  />
);

export const showWorkInProgress = (
  <AlertBox
    status="info"
    headline="We’re still working on this feature"
    content={`We’re rolling out the Higher-Level Review form in stages. It’s
      not quite ready yet, so please check back again soon.`}
  />
);
