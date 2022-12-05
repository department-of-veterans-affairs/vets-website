import React from 'react';

export const addIssueTitle = 'Add an issue and our decision date on this issue';

export const issueNameLabel = 'Name of issue';
export const issueNameHintText = (
  <p className="vads-u-font-weight--normal label-description">
    You can only add an issue that you’ve already received a VA decision notice
    for.
  </p>
);

export const dateOfDecisionLabel = 'Date of decision';
export const dateOfDecisionHintText = (
  <p className="vads-u-font-weight--normal label-description">
    You can find the decision date on your decision notice (the letter you got
    in the mail from us).
  </p>
);
