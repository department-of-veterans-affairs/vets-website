import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

const statusUrl = getAppUrl('coe-status');

const COEDenied = ({ applicationCreateDate }) => {
  const requestDate = moment(applicationCreateDate).format('MMMM DD, YYYY');

  return (
    <>
      <va-alert status="info">
        <h2 slot="headline">We denied your request for a COE</h2>
        <div>
          <p>You requested a COE on: {requestDate}</p>
          <p>
            We reviewed your request. You don’t qualify for a COE.
            <br />
            <a href={statusUrl}>
              Go to your VA home loan COE page to see status details
            </a>
          </p>
        </div>
      </va-alert>
      <div>
        <h2>Can I appeal VA’s decision?</h2>
        <p className="vads-u-margin-bottom--0">
          If you disagree with our decision, and it’s dated on or after February
          19, 2019, you can choose from 3 decision review options. These are
          your options: Supplemental Claim, Higher-Level Review, or Board
          Appeal.
        </p>
        <a href="/decision-reviews/">
          Learn about VA decison reviews and appeals
        </a>
      </div>
      <div>
        <h2>What if I appealed VA’s decision?</h2>
        <p className="vads-u-margin-bottom--0">
          If you have an appeal in progress, you can check it online. You’ll see
          where your claim or appeal is in our review process, and when we think
          we’ll complete our review.
        </p>
        <a href="/track-claims">Check your VA claim or appeal status</a>
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>What if I have more questions?</h2>
        <p className="vads-u-margin-bottom--0">
          Get answers to frequently asked questions about decision reviews.
        </p>
        <a href="/decision-reviews/faq/">
          See frequently asked questions about decision reviews
        </a>
      </div>
    </>
  );
};

COEDenied.propTypes = {
  applicationCreateDate: PropTypes.number,
};

export default COEDenied;
