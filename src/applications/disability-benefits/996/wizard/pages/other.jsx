import React from 'react';

import pageNames from './pageNames';
import DownloadLink from '../../content/DownloadLink';
import { BENEFIT_OFFICES_URL } from '../../constants';

const DecisionReviewPage = () => (
  <p className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
    You’ll need to fill out and submit VA form 20-0996 by mail or in person.
    Send the completed form to the{' '}
    <a href={BENEFIT_OFFICES_URL}>benefit office</a> that matches the benefit
    type you select on the form.
    <p className="vads-u-margin-bottom--0">
      <DownloadLink content={'Download VA Form 20-0996'} />
    </p>
  </p>
);

export default {
  name: pageNames.other,
  component: DecisionReviewPage,
};
