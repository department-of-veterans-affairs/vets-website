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
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      You’ll need to fill out and submit VA Form 20-0996 by mail or in person.{' '}
      <a
        href={BENEFIT_OFFICES_URL}
        onClick={() => {
          recordEvent({
            event: 'howToWizard-alert-link-click',
            'howToWizard-alert-link-click-label': 'benefit office',
          });
        }}
      >
        Send the completed form to the benefit office
      </a>{' '}
      that matches the benefit type you select on the form.
      <p className="vads-u-margin-bottom--0">
        <DownloadLink content={'Download VA Form 20-0996'} wizardEvent />
      </p>
    </div>
  );
};

export default {
  name: pageNames.other,
  component: DecisionReviewPage,
};
