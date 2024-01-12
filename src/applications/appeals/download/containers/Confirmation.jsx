import React, { useEffect } from 'react';
import { format } from 'date-fns';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

import extraData from '../tests/fixtures/data/extra-data.json';
import testData from '../tests/fixtures/data/test-data.json';

const Confirmation = () => {
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  });
  const { data } = testData;
  const { fullName } = extraData;

  const submitted = new Date();
  const issues = data.contestedIssues.map(issue => ({
    name: issue.attributes.ratingIssueSubjectText,
    date: issue.attributes.approxDecisionDate,
  }));
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns vads-u-margin-bottom--4">
        <va-breadcrumbs>
          <a href="/">Home</a>
          <a href="/decision-reviews">Decision reviews and appeals</a>
          <a href="/decision-reviews/board-appeal">Board Appeals</a>
          <a href="/decision-reviews/submitted-appeal">
            Request a Board Appeal
          </a>
        </va-breadcrumbs>

        <va-alert status="success">
          <h2 slot="headline">You submitted your Board Appeal request</h2>
          <p>
            After we’ve completed our review, we’ll mail you a decision packet
            with the details of our decision.
          </p>
        </va-alert>
        <div className="inset">
          <h3 className="vads-u-margin-top--0">
            Your information for this request
          </h3>
          <h4>Your name</h4>
          <span>
            {fullName.first} {fullName.middle} {fullName.last}
            {fullName.suffix ? `, ${fullName.suffix}` : null}
          </span>

          <h4>Date you filed your request</h4>
          <span>{format(submitted, 'MMMM d, yyyy')}</span>

          <h4>Issue(s) for review</h4>
          <ul>
            {issues.map(issue => (
              <li key={issue.name}>{issue.name}</li>
            ))}
          </ul>
          <p>
            <a
              href="/decision-reviews/submitted-appeal/view-appeal"
              className="vads-c-action-link--green"
            >
              View and save your completed request
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
