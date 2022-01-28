import React from 'react';

import StatusBox from '../../../shared/components/StatusBox';

const Denied = ({ applicationCreateDate }) => (
  <>
    <StatusBox.Denied
      applicationCreateDate={applicationCreateDate}
      origin={'form'}
    />
    <div>
      <h2>Can I appeal VA’s decision?</h2>
      <p>
        If you disagree with our decision, and it’s dated on or after February
        19, 2019, you can choose from 3 decision review options. These are your
        options: Supplemental Claim, Higher-Level Review, or Board Appeal.
        <br />
        <a href="/decision-reviews/">
          Learn about VA decison reviews and appeals
        </a>
      </p>
    </div>
    <div>
      <h2>What if I appealed VA’s decision?</h2>
      <p>
        If you have an appeal in progress, you can check it online. You’ll see
        where your claim or appeal is in our review process, and when we think
        we’ll complete our review.
        <br />
        <a href="/track-claims">Check your VA claim or appeal status</a>
      </p>
    </div>
    <div>
      <h2>What if I have more questions?</h2>
      <p>
        Get answers to frequently asked questions about decision reviews.
        <br />
        <a href="/decision-reviews/faq/">
          See frequently asked questions about decision reviews
        </a>
      </p>
    </div>
  </>
);

export default Denied;
