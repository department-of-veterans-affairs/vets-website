import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';
import DelayedLiveRegion from '../DelayedLiveRegion';

const Disagree = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert':
        'disagree with the VA decision that resulted in this debt',
    });
  }, []);

  return (
    <DelayedLiveRegion>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
        <h2
          className="vads-u-margin-top--0 vads-u-font-size--h6 vads-u-font-weight--normal vads-u-font-family--sans"
          id="wizard-results"
        >
          Based on the information you provided, this isn’t the form you need.
        </h2>
        <p className="vads-u-margin-bottom--0">
          <strong className="vads-u-margin-right--0p5">
            If you disagree with the VA decision that resulted in this debt,
          </strong>
          you can submit a Supplemental Claim or request a Higher Level Review
          or board appeal.
        </p>
        <p className="vads-u-margin-top--1">
          <a
            href="/decision-reviews/"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label':
                  'Learn more about decision reviews and appeals',
              });
            }}
          >
            Learn more about decision reviews and appeals
          </a>
        </p>
        <p className="vads-u-margin-bottom--0">
          <strong>If you need more help, </strong>
          call your VA benefit office.
        </p>
        <p className="vads-u-margin-top--1">
          <a
            href="/resources/helpful-va-phone-numbers/"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label':
                  'Find helpful VA phone numbers',
              });
            }}
          >
            Find helpful VA phone numbers
          </a>
        </p>
        <h3>What to know about debt waivers</h3>
        <p>
          You have <strong>1 year</strong> from the date you received your first
          debt letter to request a debt waiver. A waiver is a request to ask us
          to stop collection on your debt.
        </p>
        <p className="vads-u-margin-bottom--0">
          If you’re worried that we won’t complete your appeal before the
          180-day limit, you can request a waiver with our online Financial
          Status Report (VA Form 5655).
        </p>
        <p className="vads-u-margin-top--1">
          <a
            href="https://www.va.gov/find-forms/about-form-5655/"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label':
                  'Request help with VA Form 5655',
              });
            }}
          >
            Request help with VA Form 5655
          </a>
        </p>
        <p>
          <strong>Note: </strong>
          We’ll continue to add late fees and interest, and take other
          collection action as needed, while we consider your appeal.
        </p>
      </div>
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.disagree,
  component: Disagree,
};
