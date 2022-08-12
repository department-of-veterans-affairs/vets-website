import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';
import DownloadLink from '../../content/DownloadLink';
import { BENEFIT_OFFICES_URL } from '../../constants';

const DecisionReviewPage = () => {
  recordEvent({
    event: 'howToWizard-alert-displayed',
    'reason-for-alert': 'veteran wants to submit an unsupported claim type',
  });

  const handlers = {
    officeLinkClick: () => {
      recordEvent({
        event: 'howToWizard-alert-link-click',
        'howToWizard-alert-link-click-label': 'benefit office',
      });
    },
  };

  return (
    <div id={pageNames.other}>
      <h1 className="vads-u-margin-bottom--0">
        Filing non-disability Supplemental Claims
      </h1>
      <p>
        We don’t support claims other than disability online at this time.
        You’ll need to fill out and submit VA Form 20-0995 by mail or in person.
      </p>
      <a href={BENEFIT_OFFICES_URL} onClick={handlers.officeLinkClick}>
        Send the completed form to the benefit office
      </a>{' '}
      that matches the benefit type you select on the form.
      <p className="vads-u-margin-bottom--0">
        <DownloadLink content="Download VA Form 20-0995" />
      </p>
    </div>
  );
};

export default {
  name: pageNames.other,
  component: DecisionReviewPage,
  next: null,
  back: pageNames.start,
};
