import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { CoeDocumentList } from './CoeDocumentList';

export const CoeDenied = ({ applicationCreateDate }) => {
  const requestDate = moment(applicationCreateDate).format('MMMM DD, YYYY');

  return (
    <div className="row vads-u-margin-bottom--7">
      <div className="medium-8 columns">
        <va-alert status="info">
          <h2 slot="headline" className="vads-u-font-size--h3">
            We denied your request for a COE
          </h2>
          <p>You requested a COE on: {requestDate}</p>
          <p>We reviewed your request. You don’t qualify for a COE.</p>
        </va-alert>
        <h2>Can I appeal VA’s decision?</h2>
        <p>
          If you disagree with our decision, and it’s dated on or after February
          19, 2019, you can choose from 3 decision review options. These are
          your options: Supplemental Claim, Higher-Level Review, or Board
          Appeal.
          <br />
          <a href="/decision-reviews/">
            Learn about VA decision reviews and appeals
          </a>
        </p>
        <h2>What if I appealed VA’s decision?</h2>
        <p>
          If you have an appeal in progress, you can check it online. You’ll see
          where your claim or appeal is in our review process, and when we think
          we’ll complete our review.
          <br />
          <a href="/track-claims">Check your VA claim or appeal status</a>
        </p>
        <CoeDocumentList />
        <h2>What if I have more questions?</h2>
        <p>
          Get answers to frequently asked questions about decision reviews.
          <br />
          <a href="/decision-reviews/faq/">
            See frequently asked questions about decision reviews
          </a>
        </p>
      </div>
    </div>
  );
};

CoeDenied.propTypes = {
  applicationCreateDate: PropTypes.number,
};
