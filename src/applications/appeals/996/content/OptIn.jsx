import React from 'react';

export const OptInDescription = () => (
  <>
    <h3>Opt in to the new decision review process</h3>
    <div id="opt-in-description">
      <p>
        If you’re requesting a Board Appeal on an issue in an initial claim we
        decided before February 19, 2019, you’ll need to opt in to the new
        decision review process. To do this, check the box here. We’ll move your
        issue from the old appeals process to the new decision review process.
      </p>
      <p>
        Our decision review process is part of the Appeals Modernization Act.
        When you opt in, you’re likely to get a faster decision.
      </p>
    </div>
  </>
);

export const OptInLabel =
  'I understand that if I want any issues reviewed that are currently in the old appeals process, I’m opting them in to the new decision review process.';

export const OptInSelections = {
  true: 'Yes, I choose to opt in to the new process',
  false: 'You didn’t select this option',
};
