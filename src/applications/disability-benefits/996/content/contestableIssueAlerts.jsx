import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import { disabilitiesExplanation } from './contestedIssues';

const noIssuesMessage = (
  <>
    Our records show that you don’t have any issues eligible for a Higher-Level
    Review. If you think this is an error, please call{' '}
    <Telephone contact={CONTACTS.VA_BENEFITS} />.
    {disabilitiesExplanation({ introPageAlert: true })}
  </>
);

const networkError = errors => {
  const messages =
    errors?.length > 1 ? (
      <ul>
        {errors.map(error => (
          <li key={error.title}>{error.title}</li>
        ))}
      </ul>
    ) : (
      <p>
        <strong>{errors?.[0].title}</strong>
      </p>
    );
  return (
    <>
      We’re having some connection issues on our end.
      <p />
      {messages}
      <p>Please refresh this page to try again.</p>
    </>
  );
};

export const noContestableIssuesFound = (
  <AlertBox
    status="warning"
    headline="We don’t have any contestable issues for you"
    content={noIssuesMessage}
  />
);

export const showContestableIssueError = errors => (
  <AlertBox
    status="error"
    headline="We can’t load your contestable issues"
    content={networkError(errors)}
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
