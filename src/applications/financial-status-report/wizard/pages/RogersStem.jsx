import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';
import DelayedLiveRegion from '../DelayedLiveRegion';

const RogersStem = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert': 'help with STEM program debt',
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
        <p>
          <strong>For help with STEM program debt,</strong> contact us by email
          or regular mail.
        </p>
        <ul>
          <li>
            <strong>Email: </strong>
            <a className="email" href="mailto:stem.vbauf@va.gov">
              STEM.VBAUF@va.gov
            </a>
            .
          </li>
          <li>
            <strong>Mail: </strong>
            <div>VA Regional Processing Office 307</div>
            <div>P.O. Box 4616</div>
            <div>Buffalo, NY 14240-4616</div>
          </li>
        </ul>
      </div>
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.stem,
  component: RogersStem,
};
