import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import pageNames from './pageNames';
import DownloadLink from '../../content/DownloadLink';
import { BENEFIT_OFFICES_URL } from '../../constants';

const headline =
  'You’ll need to submit a paper form to request a Higher-Level Review';

const alertContent = (
  <>
    <p>
      We’re sorry. You can only request a Higher-Level Review online for
      compensation claims right now.
    </p>
    <p>
      To request a Higher-Level Review for another benefit type, please fill out
      a Decision Review Request: Higher-Level Review (VA Form 20-0996).
    </p>
    <DownloadLink content={'Download VA Form 20-0996'} />
    <p>
      Send the completed form to the{' '}
      <a href={BENEFIT_OFFICES_URL}>benefit office</a> that matches the benefit
      type you selected on the form.
    </p>
  </>
);

const DecisionReviewPage = () => (
  <AlertBox
    headline={headline}
    content={alertContent}
    status="info"
    isVisible
  />
);

export default {
  name: pageNames.other,
  component: DecisionReviewPage,
};
