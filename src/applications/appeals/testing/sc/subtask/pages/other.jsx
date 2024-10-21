import React, { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';
import DownloadLink from '../../content/DownloadLink';
import { BENEFIT_OFFICES_URL } from '../../constants';
import { title995 } from '../../content/title';

const DecisionReviewPage = () => {
  useEffect(() => {
    setTimeout(() => {
      focusElement('#main h2');
    });
  }, []);

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
    <div id={pageNames.other} className="vads-u-padding-bottom--2">
      <h1 className="vads-u-margin-bottom--0">{title995}</h1>
      <div className="schemaform-subtitle vads-u-font-size--lg">
        VA Form 20-0995
      </div>
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        Filing if your Supplemental Claim isn’t for a disability
      </h2>
      <p>
        We can accept online Supplemental Claims only for disability claims at
        this time. For other types of claims, you’ll need to fill out and submit
        VA Form 20-0995 by mail or in person.
      </p>
      <p>
        Send the completed form to the benefit office that matches the benefit
        type you select on the form.
      </p>
      <a href={BENEFIT_OFFICES_URL} onClick={handlers.officeLinkClick}>
        Find the address for mailing your form
      </a>{' '}
      <p className="vads-u-margin-bottom--0">
        <DownloadLink subTaskEvent />
      </p>
      <p>
        If you don’t think this is the right form for you, find out about other
        decision review options.
      </p>
      <a href="/resources/choosing-a-decision-review-option/">
        Learn about choosing a decision review option
      </a>
    </div>
  );
};

export default {
  name: pageNames.other,
  component: DecisionReviewPage,
  next: null,
  back: pageNames.start,
};
