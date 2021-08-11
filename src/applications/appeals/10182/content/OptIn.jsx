import React from 'react';

// import { getSelected } from '../utils/helpers';
// import { ShowIssuesList } from '../components/ShowIssuesList';

export const OptInDescription = () => {
  // Change this once we figure out which issues are legacy, switch to getLegacyAppeals
  // const issues = getSelected(formData); // getLegacyAppeals(formData);
  return (
    <div id="opt-in-description">
      {/* Legacy issues hidden until future implementation */}
      {/* The issue(s) listed here may be in our old appeals process:
      {ShowIssuesList({ issues })} */}
      <p>
        You can submit this online form (VA Form 10182) to appeal a VA decision
        dated on or after February 19, 2019. The Board must receive your
        completed form within 1 year (365 days) from the date listed on your
        decision notice.
      </p>
      <p>
        <strong>If our decision involves a contested claim,</strong> the Board
        must receive your completed form within 60 days from the date listed on
        your decision notice. A contested claim is when a favorable claim
        decision for one person results in denial or reduced benefits for
        another person.
      </p>
      <p>
        <strong>If you have a Statement of the Case (SOC)</strong> or a
        <strong>
          Supplemental Statement of the Case (SSOC) from the old appeals system
          dated on or after February 19, 2019,
        </strong>{' '}
        the Board must receive your completed form in one of these time frames,
        whichever is later:
      </p>
      <ul>
        <li>
          Within 60 days from the date on the SSOC letter, <strong>or</strong>
        </li>
        <li>
          Within 1 year of the decision date by the agency of original
          jurisdiction
        </li>
      </ul>
      <p>
        If you opt in, we’ll process your claim under the review option you
        choose. We won’t continue to process your appeal in the old system.
      </p>
    </div>
  );
};

export const OptInLabel = (
  <strong className="opt-in-title">
    I understand that if I want any issues reviewed that are currently in the
    old appeals process, I’m opting them in to the new decision review process.
  </strong>
);

// children should always be "True"
export const OptInReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{OptInLabel}</dt>
    <dd>{children}</dd>
  </div>
);

export const optInErrorMessage =
  'Please opt in to the new decision review process to proceed';
