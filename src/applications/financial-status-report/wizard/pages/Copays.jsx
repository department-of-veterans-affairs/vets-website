import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import { PAGE_NAMES } from '../constants';
import DelayedLiveRegion from '../DelayedLiveRegion';

const Copays = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert': 'debt related to VA health care copays',
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
          <strong>
            Here’s how to pay or get help with your VA copay bill:
          </strong>
        </p>
        <p>
          <a
            href="/health-care/pay-copay-bill/"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label':
                  'Find out how to pay your VA copay bill',
              });
            }}
          >
            Find out how to pay your VA copay bill
          </a>
        </p>
        <p>
          <a
            href="/health-care/pay-copay-bill/financial-hardship/"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label':
                  'Learn how to request financial hardship assistance',
              });
            }}
          >
            Learn how to request financial hardship assistance
          </a>
        </p>
        <p>
          Or call us at <Telephone contact="866-400-1238" />. We’re here Monday
          through Friday, 8:00 a.m. to 8:00 p.m. ET. If you have hearing loss,
          call TTY:
          <Telephone
            contact={CONTACTS[711]}
            pattern={PATTERNS['3_DIGIT']}
            className="vads-u-margin-left--0p5"
          />
          .
        </p>
      </div>
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.copays,
  component: Copays,
};
