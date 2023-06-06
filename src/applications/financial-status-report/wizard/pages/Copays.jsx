import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';
import DelayedLiveRegion from '../DelayedLiveRegion';
import StartFormButton from '../components/StartFormButton';

const Copays = ({ setWizardStatus }) => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert': 'debt related to VA health care copays',
    });
  }, []);
  const label = 'Start your request now';

  return (
    <DelayedLiveRegion>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
        <h2
          className="vads-u-margin-top--0 vads-u-font-size--h6 vads-u-font-weight--normal vads-u-font-family--sans"
          id="wizard-results"
        >
          <strong>
            If you want to request a waiver or compromise offer for a VA copay
            bill
          </strong>
          , you can use our online Financial Status Report (VA Form 5655) to
          request help with your debt.
        </h2>
        <StartFormButton setWizardStatus={setWizardStatus} label={label} />
        <p>
          <strong>Need something else?</strong>
        </p>
        <ul>
          <li>
            <p>
              You can pay your copay bill online, by phone, by mail, or in
              person.
              <br />
              <a
                href="/manage-va-debt/#make-a-payment-now"
                onClick={() => {
                  recordEvent({
                    event: 'howToWizard-alert-link-click',
                    'howToWizard-alert-link-click-label':
                      'Learn how to make a payment now',
                  });
                }}
              >
                Learn how to make a payment now
              </a>
            </p>
          </li>
          <li>
            <p>
              You have the right to dispute all or part of your VA copay
              charges.
              <br />
              <a
                href="/health-care/pay-copay-bill/dispute-charges/"
                onClick={() => {
                  recordEvent({
                    event: 'howToWizard-alert-link-click',
                    'howToWizard-alert-link-click-label':
                      'Learn how to dispute your VA copay charges',
                  });
                }}
              >
                Learn how to dispute your VA copay charges
              </a>
            </p>
          </li>
          <li>
            <p>
              If your income has decreased and you won’t be able to pay future
              copays, we can help.
              <br />
              <a
                href="/health-care/pay-copay-bill/financial-hardship/#what-can-i-do-if-my-income-has"
                onClick={() => {
                  recordEvent({
                    event: 'howToWizard-alert-link-click',
                    'howToWizard-alert-link-click-label':
                      'Learn how to request a VA hardship determination and copay exemption',
                  });
                }}
              >
                Learn how to request a VA hardship determination and copay
                exemption
              </a>
            </p>
          </li>
        </ul>
        <p>
          <strong>Note: </strong>
          Be sure to pay your full balance or request help by the due date on
          your billing statement. This will help you avoid late fees, interest,
          or other collection action.
        </p>
        <p />
      </div>
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.copays,
  component: Copays,
};
