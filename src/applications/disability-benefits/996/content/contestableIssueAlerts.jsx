import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const noIssuesMessage = `We’re sorry. We were unable to locate any contestable
  issues that are eligible to request a Higher-Level Review`;

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
        <strong>{errors[0].title}</strong>
      </p>
    );
  return (
    <>
      We’re sorry. We’re having some problems on our end when we try to get
      information about your contestable issues:
      <p />
      {messages}
      <p>Please try again later.</p>
    </>
  );
};

export const noContestableIssuesFound = (
  <AlertBox
    status="warning"
    headline="No Contestable Issues"
    content={noIssuesMessage}
  />
);

export const showContestableIssueError = errors => (
  <AlertBox
    status="error"
    headline="We’re having some connection problems"
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
