import React from 'react';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { capitalizeEachWord } from '../../all-claims/utils.jsx';
import { NULL_CONDITION_STRING } from '../constants';

export const contestedIssueFollowupDescription = (
  <>
    Please add anything you want the reviewer to consider when going over your
    request. For example, why do you think the decision should be changed, or
    was there an error in the prior decision? (400 characters maximum)
  </>
);

export const contestedIssueFollowupEvidenceInfo = (
  <AdditionalInfo triggerText="What if I have new and relevant evidence?">
    <p>
      You can’t submit new evidence with a Higher-Level Review. If you want to
      submit new evidence, you’ll need to file a Supplemental Claim or request a
      Board Appeal.
    </p>
    <p>
      <a href="/decision-reviews">Learn more about other review options</a>
    </p>
  </AdditionalInfo>
);

export const contestedIssueNameTitle = ({ formData }) => (
  <legend className="schemaform-block-title schemaform-title-underline">
    {typeof formData.name === 'string'
      ? capitalizeEachWord(formData.name)
      : NULL_CONDITION_STRING}
  </legend>
);
