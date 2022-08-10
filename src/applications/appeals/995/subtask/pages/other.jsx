import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';
import DownloadLink from '../../content/DownloadLink';
import { BENEFIT_OFFICES_URL } from '../../constants';

const DecisionReviewPage = () => {
  recordEvent({
    event: 'subtask-alert-displayed',
    'reason-for-alert': 'veteran wants to submit an unsupported claim type',
  });

  const handlers = {
    officeLinkClick: () => {
      // recordEvent({
      //   event: 'subtask-alert-link-click',
      //   'subtask-alert-link-click-label': 'benefit office',
      // });
    },
  };

  return (
    <div id={pageNames.other}>
      <h2>Filing Non-Disability Supplemental Claims</h2>
      <div className="vads-u-padding--2 vads-u-margin-top--2">
        <p>
          We don’t support claims other than disability online at this time.
          You’ll need to fill out and submit VA Form 20-0995 by mail or in
          person.
        </p>
        <a href={BENEFIT_OFFICES_URL} onClick={handlers.officeLinkClick}>
          Send the completed form to the benefit office
        </a>{' '}
        that matches the benefit type you select on the form.
        <p className="vads-u-margin-bottom--0">
          <DownloadLink content="Download VA Form 20-0995" />
        </p>
      </div>
    </div>
  );
};

export default {
  name: pageNames.other,
  component: DecisionReviewPage,
  next: null,
  back: pageNames.start,
};
