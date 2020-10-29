import React from 'react';

import pageNames from './pageNames';
import DownloadLink from '../../content/DownloadLink';

const DecisionReviewPage = () => (
  <p className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
    You’ll need to fill out and submit VA form 20-0996 by mail, fax, or in
    person. Send the completed form to the benefit office that matches the type
    you select on the form.
    <p className="vads-u-margin-bottom--0">
      <DownloadLink content={'Download VA Form 20-0996'} />
    </p>
  </p>
);

export default {
  name: pageNames.other,
  component: DecisionReviewPage,
};
