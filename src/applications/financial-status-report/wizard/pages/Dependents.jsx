import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { PAGE_NAMES } from '../constants';
import ContactDMC from '../components/Contacts';
import DelayedLiveRegion from '../DelayedLiveRegion';

const Dependents = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert': 'request help with debt for spouses or dependents',
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
            Here’s how to request help with debt for spouses or dependents:
          </strong>
        </p>

        <p>
          To request help with VA education, disability compensation, or pension
          benefit debt, fill out the PDF version of our
          <a
            className="vads-u-margin-left--0p5"
            href="https://www.va.gov/find-forms/about-form-5655/"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-alert-link-click',
                'howToWizard-alert-link-click-label':
                  'Financial Status Report (VA Form 5655).',
              });
            }}
          >
            Financial Status Report (VA Form 5655)
          </a>
          .
        </p>

        <p>
          You can use this form to request a debt waiver, compromise offer, or
          extended monthly payment plan. You’ll also need to include a personal
          statement to tell us why it’s hard for you to repay the debt.
        </p>

        <p>Submit your completed, signed form and statement by mail or fax.</p>

        <ul>
          <li>
            <strong>Mail: </strong>
            <div>Debt Management Center</div>
            <div>P.O. Box 11930</div>
            <div>St. Paul, MN 55111-0930</div>
          </li>
          <li>
            <strong>Fax:</strong> <VaTelephone contact="1-612-970-5688" />
          </li>
        </ul>

        <p>
          <strong>If you submitted VA Form 5655 in the past 6 months</strong>
        </p>

        <p>
          You don’t need to submit a new request unless you have changes to
          report. <ContactDMC />
        </p>
      </div>
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.dependents,
  component: Dependents,
};
