import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';
import ContactDMC from '../components/Contacts';
import DelayedLiveRegion from '../DelayedLiveRegion';

const LessThanFive = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert':
        'no submission needed to request an extended monthly payment plan of up to 5 years',
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
            We’ve changed our process for extended monthly payment plans as part
            of COVID-19 debt relief.
          </strong>
        </p>
        <p>
          You don’t need to submit a Financial Status Report (VA Form 5655) to
          request an extended monthly payment plan of up to 5 years. During this
          time, you can request a plan online, by phone, or by mail.
        </p>
        <ul>
          <li>
            <strong>Online: </strong>
            <a
              href="https://www.va.gov/contact-us/"
              className="vads-u-margin-left--0p5"
              onClick={() => {
                recordEvent({
                  event: 'howToWizard-alert-link-click',
                  'howToWizard-alert-link-click-label':
                    'Contact us through Ask VA',
                });
              }}
            >
              Contact us through Ask VA
            </a>
          </li>
          <li>
            <strong>Phone: </strong>
            <ContactDMC />
          </li>
          <li>
            <strong>Mail: </strong>
            <div>Debt Management Center</div>
            <div>P.O. Box 11930</div>
            <div>St. Paul, MN 55111-0930</div>
          </li>
        </ul>
      </div>
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.lessThan,
  component: LessThanFive,
};
