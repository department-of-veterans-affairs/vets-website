import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';

const Appeals = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert':
        'appeal the decision with the board of Veterans Appeals',
    });
  }, []);

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, this isn’t the form you need.
      </p>
      <p className="vads-u-margin-bottom--0">
        <strong>
          If you disagree with our decision on your waiver request,
        </strong>{' '}
        you can{' '}
        <a
          href="/decision-reviews/board-appeal/"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-alert-link-click',
              'howToWizard-alert-link-click-label': 'request a Board Appeal',
            });
          }}
        >
          request a Board Appeal
        </a>
        . When you choose this option, you appeal to a Veterans Law Judge at the
        Board of Veterans' Appeals in Washington, D.C. A judge who’s an expert
        in Veterans law will review your case.
      </p>
      <p className="vads-u-margin-top--1">
        <a
          href="/decision-reviews/board-appeal/"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-alert-link-click',
              'howToWizard-alert-link-click-label':
                'Find out how to request a Board Appeal',
            });
          }}
        >
          Find out how to request a Board Appeal
        </a>
      </p>
      <p>
        <strong>Note: </strong>
        You have one year from the date on your decision letter to request a
        Board Appeal, unless you have a{' '}
        <a
          href="/decision-reviews/contested-claims"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-alert-link-click',
              'howToWizard-alert-link-click-label': 'contested claim',
            });
          }}
        >
          contested claim
        </a>
        .
      </p>
    </div>
  );
};

export default {
  name: PAGE_NAMES.appeals,
  component: Appeals,
};
