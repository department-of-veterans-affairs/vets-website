import React from 'react';
import { pageNames } from '../constants';

const Copays = () => {
  const linkText = 'Learn about the decision review process';

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        If you disagree with a VA decision on your claim, you’ll need to request
        a decision review.
      </p>
      <a href="/decision-reviews/" onClick={() => {}}>
        {linkText}
      </a>
    </div>
  );
};

export default {
  name: pageNames.copays,
  component: Copays,
};
