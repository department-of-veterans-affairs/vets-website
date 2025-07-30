import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import GetFormHelp from '../components/GetFormHelp';

import manifest from '../manifest.json';

export default function ConfirmationPage() {
  const form = useSelector(state => state?.form);

  const { submission, data } = form;
  const response = submission?.response ?? {};
  const confirmationNumber = response?.attributes?.confirmationNumber;
  const veteranFirstName = data?.veteranInformation?.fullName?.first || '';
  const veteranLastName = data?.veteranInformation?.fullName?.last || '';

  const dateSubmitted = submission?.timestamp
    ? format(new Date(submission?.timestamp), 'MMMM d, yyyy')
    : '';

  useEffect(() => {
    focusElement('#thank-you-message');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <>
      <va-alert status="success" class="vads-u-margin-bottom--4" uswds>
        <h2>Form submission started on {dateSubmitted}</h2>
        <p className="vads-u-margin-y--0">Your submission is in progress.</p>
        <p>
          It can take up to 10 days for us to receive your form. Your
          confirmation number is {confirmationNumber}.
        </p>
        <va-link-action
          href="/my-va/"
          text="Check the status of your form on My VA"
          label="Check the status of your form on My VA"
          message-aria-describedby="Check the status of your form on My VA"
        />
      </va-alert>
      <va-summary-box>
        <h3 slot="headline">Your submission information</h3>
        <p>
          <strong>Your name</strong>
        </p>
        <p>
          {veteranFirstName} {veteranLastName}
        </p>
        <p>
          <strong>Date submitted</strong>
        </p>
        <p data-testid="dateSubmitted">{dateSubmitted}</p>
        <va-button
          text="Print this page for your records"
          message-aria-describedby="Print this page for your records"
          onClick={() => {
            window.print();
          }}
        />
      </va-summary-box>
      <section>
        <h2>What to expect</h2>
        <va-process-list>
          <va-process-list-item
            active
            header="We’ll confirm that we’ve received your form"
          >
            <p>
              This can take up to 10 days. When we receive your form, we’ll
              update the status on My VA.
            </p>
            <va-link
              href="/my-va/"
              text="Check the status of your form on My VA"
              label="Check the status of your form on My VA"
            />
          </va-process-list-item>
          <va-process-list-item pending header="Next, we’ll review your form">
            <p>
              If we need more information after reviewing your form, we’ll
              contact you.
            </p>
          </va-process-list-item>
        </va-process-list>
      </section>
      <section>
        <h2>What if I have additional evidence I need to submit?</h2>
        <p>
          If you still need to submit additional supporting documents, you can
          submit them in one of these 2 ways:
        </p>
        <h3>Option 1: Upload your documents using the Claim Status Tool</h3>
        <p>
          It may take 10 days for your request to appear in the Claim Status
          Tool. After your request appears, you can upload your documents in the
          Files tab.
        </p>
        <va-link
          href="/track-claims"
          text="Use the Claim Status Tool to upload your documents"
          label="Use the Claim Status Tool to upload your documents"
        />
        <h3>Option 2: Mail us copies of your documents</h3>
        <p>
          <strong>If your request is related to disability compensation</strong>
          , send copies of your documents to this address:
        </p>
        <p className="va-address-block">
          U.S. Department of Veterans Affairs <br />
          Evidence Intake Center
          <br />
          P.O. Box 4444
          <br />
          Janesville, WI 53547-4444
          <br />
          United States of America
        </p>
        <p>
          <strong>If your request is related to pension benefits</strong>, send
          copies of your documents to this address:
        </p>
        <p className="va-address-block">
          U.S. Department of Veterans Affairs <br />
          Pension Intake Center
          <br />
          P.O. Box 5365
          <br />
          Janesville, WI 53547-5365
          <br />
          United States of America
        </p>
        <p>
          <strong>Note:</strong> Don't send us your original documents. We can't
          return them. Send us copies of your documents only.
        </p>
      </section>
      <section>
        <h2>What if I need to add or remove another dependent later?</h2>
        <p>
          If you need to add or remove another dependent, complete and submit
          another dependency claim.
        </p>
        <va-link
          href={manifest.rootUrl}
          text="Start a new dependency claim"
          label="Start a new dependency claim"
        />
      </section>
      <section>
        <h2>How to contact us if you have questions</h2>
        <p>
          Call us at <va-telephone international contact="8008271000" /> (
          <va-telephone tty contact="711" />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <p>
          Or you can ask us a question online through Ask VA. Select the
          category and topic for the VA benefit this form is related to.
        </p>
        <va-link
          text="Contact us online
        through Ask VA"
          label="Contact us online
        through Ask VA"
          href="ask.va.gov"
        />
        <div className="vads-u-margin-top--3 vads-u-margin-bottom--6">
          <va-link-action
            text="Go back to VA.gov"
            label="Go back to VA.gov"
            href="/"
            type="secondary"
          />
        </div>
      </section>

      <h2 className="vads-u-margin-bottom--0 vads-u-padding-bottom--0p5 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary">
        Need help?
      </h2>
      <GetFormHelp />
    </>
  );
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteranInformation: PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          last: PropTypes.string,
        }),
      }),
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: {
        timestamp: PropTypes.string,
      },
    }),
  }),
};
