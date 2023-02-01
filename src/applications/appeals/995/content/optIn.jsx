import React from 'react';

const label =
  'I understand that I’m opting in to the new decision review process. This means any isues I want reviewed from the old appeals process will move into the new decision review process.';

export const content = {
  description: (
    <>
      <h3>Opt-in to the new decision review process</h3>
      <p>
        If you’re filing a Supplemental Claim for an issue in an initial claim
        that we decided before February 19, 2019, you’ll need to opt in to the
        new decision review process. When you do this, we’ll move your issue
        from the old appeals process to the new decision review process. You’re
        likely to get a faster decision on your claim when you switch to the new
        process.
      </p>
    </>
  ),
  label,
  update: 'Update page',
};

export const reviewField = ({ children }) => {
  const result = children.props.formData
    ? 'Yes, I choose to opt in to the new process'
    : 'No, I want to stay in the old review process';
  return (
    <div className="review-row">
      <dt>{label}</dt>
      <dd>{result}</dd>
    </div>
  );
};
