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

const benefitError = type => (
  <p>We don’t currently support the "{type}" benefit type</p>
);

export const noContestableIssuesFound = (
  <AlertBox
    status="warning"
    headline="You have no issues eligible for a Higher-Level Review"
    content={noIssuesMessage}
  />
);

export const showContestableIssueError = ({ error, type } = {}) => {
  const headline =
    error === 'invalidBenefitType'
      ? `We don’t support this benefit type`
      : 'We can’t load your issues';
  const content =
    error === 'invalidBenefitType' ? benefitError(type) : networkError;
  return <AlertBox status="error" headline={headline} content={content} />;
};

export const showWorkInProgress = (
  <AlertBox
    status="info"
    headline="We’re still working on this feature"
    content={
      <>
        <p>
          We’re rolling out the Higher-Level Review form in stages. It’s not
          quite ready yet. Please check back again soon.
        </p>
        <p>
          <a
            href="/decision-reviews/higher-level-review/"
            className="u-vads-display--block u-vads-margin-top--2"
          >
            Return to Higher-Level Review information page
          </a>
        </p>
      </>
    }
  />
);
