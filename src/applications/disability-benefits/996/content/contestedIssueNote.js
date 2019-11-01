import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const contestedIssueOfficeTitle = (
  <>
    Would you like the same office that issued your prior decision to conduct
    the review?
  </>
);

export const contestedIssueOfficeChoiceAlert = () => (
  <AlertBox
    status="information"
    className="contested-issues-information"
    headline="We will try to fulfill your request"
    content={
      <>
        Please note that decisions on certain types of issues are processed at
        only a single VA office or facility. Accordingly, some issues cannot be
        reviewed at an office other than the office that decided your issue(s).
        For a list of these issue types visit
        <a href="/decision-reviews">VA.gov/decision-reviews</a>.
        <p>
          If we cannot fulfill your request, we will notify you at the time the
          Higher-Level Review decision is made.
        </p>
      </>
    }
  />
);

export const contestedIssueNoteDescription = (
  <>
    Please add anything you want the reviewer to consider when going over your
    request. For example, why do you think the decision should be changed, or
    was there an error in the prior decision? (400 characters maximum)
  </>
);

export const contestedIssueNoteEvidenceInfo = (
  <AdditionalInfo triggerText="What if I have new and relevant evidence?">
    <p>
      You can't submit new evidence with a Higher-Level Review. If you want to
      submit new evidence, you'll need to file a Supplemental Claim or request a
      Board Appeal.
    </p>
    <p>
      <a href="/decision-reviews">Learn more about other review options</a>
    </p>
  </AdditionalInfo>
);
