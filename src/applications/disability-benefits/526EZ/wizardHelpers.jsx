import React from 'react';

export const GetStartedMessage = ({ checkDisabilityStatus, isVerified }) => {
  const {
    isFirst,
    isAppeal,
    isAddOnly,
    isAddAndIncrease,
  } = checkDisabilityStatus();
  const signInMessage = isVerified
    ? ''
    : ' To apply for a disability increase, you’ll need to sign in and verify your account.';
  let getStartedMessage = `Since you have a condition that’s gotten worse to add to your claim, you’ll need to file a claim for increased disability.${signInMessage}`;
  if (isFirst) {
    getStartedMessage =
      'To file your first disability claim, please go to our eBenefits website.';
  }
  if (isAppeal) {
    getStartedMessage = (
      <span>
        If you disagree with our decision on your disability claim, you can
        appeal it. <br />
        <a href="/disability/file-an-appeal/">Learn how to file an appeal</a>
      </span>
    );
  }
  if (isAddOnly) {
    getStartedMessage =
      'Since you have a new condition to add to your rated disability claim, you’ll need to file your disability claim on eBenefits.';
  }
  if (isAddAndIncrease) {
    getStartedMessage =
      'Since you have a new condition and a condition that has gotten worse, you’ll need to file your disability claim on eBenefits.';
  }
  return <p>{getStartedMessage}</p>;
};

export const disabilityStatusOptions = [
  {
    value: 'first',
    label: 'I’ve never filed a disability claim before.',
  },
  {
    value: 'update',
    label:
      'I have a new condition, or a condition that’s gotten worse, to add to my rated disability claim.',
  },
  {
    value: 'appeal',
    label: 'I want to appeal the VA decision on my disability claim.',
  },
];

export const disabilityUpdateOptions = [
  {
    value: 'add',
    label: 'I have a new condition to add to my rated disability claim.',
  },
  {
    value: 'increase',
    label: 'One or more of my rated disabilities has gotten worse.',
  },
];

export const layouts = {
  chooseStatus: 'choose_status',
  chooseUpdate: 'choose_update',
  applyGuidance: 'apply_guidance',
};

export const disabilityStatuses = {
  ADD: 'add',
  ADDANDINCREASE: 'addAndIncrease',
  APPEAL: 'appeal',
  FIRST: 'first',
  INCREASE: 'increase',
  UPDATE: 'update',
};
