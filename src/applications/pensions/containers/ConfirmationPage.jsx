import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { utcToZonedTime, format } from 'date-fns-tz';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import {
  formatFullName,
  obfuscateAccountNumber,
  scrollToTop,
} from '../helpers';

const centralTz = 'America/Chicago';

const ConfirmationPage = props => {
  const {
    form: { submission, data },
  } = props;
  const response = submission?.response ?? {};
  const fullName = formatFullName(data?.veteranFullName ?? {});

  // Determine usingDirectDeposit based on whether bankAccount exists and is not empty
  const usingDirectDeposit =
    !!data.bankAccount && Object.keys(data.bankAccount).length > 0;

  const zonedDate = utcToZonedTime(submission?.timestamp, centralTz);
  const submittedAt = format(zonedDate, 'LLL d, yyyy h:mm a zzz', {
    timeZone: centralTz,
  });

  useEffect(
    () => {
      focusElement('.confirmation-page-title');
      scrollToTop();
    },
    [props],
  );

  return (
    <div className="vads-u-margin-bottom--9">
      <h2 className="vads-u-margin-bottom--3">
        Your Veterans Pension application
      </h2>
      <va-alert uswds status="success">
        <h3>Thank you for submitting your Veterans Pension application.</h3>
        <p className="vads-u-margin-y--0">
          We’ve received your Veterans Pension application (VA Form 21P-527EZ).
          After we complete our review, we’ll mail you a decision letter with
          the details of our decision.
        </p>
      </va-alert>
      <br />
      <va-summary-box uswds>
        <h3 slot="headline" className="vads-u-margin-top--0">
          Your information for this application
        </h3>
        <h4>Your name</h4>
        <span>{fullName}</span>
        <h4>Date you submitted your application</h4>
        <span>{submittedAt}</span>
        {response?.confirmationNumber && (
          <div id="pension_527ez_submission_confirmation">
            <h4>Confirmation number</h4>
            <span>{response?.confirmationNumber}</span>
          </div>
        )}
        <va-button
          uswds
          class="screen-only vads-u-margin-top--2"
          text="Print this page"
          onClick={() => {
            window.print();
          }}
        />
      </va-summary-box>
      <section>
        <h3>If you need to submit supporting documents</h3>
        <span>You can submit supporting documents in one of 2 ways:</span>
        <h4>Submit your documents online through AccessVA</h4>
        <div>
          <p>
            You can use the QuickSubmit tool through AccessVA to submit your
            documents online.
          </p>
          <va-link
            href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
            text="Go to AccessVA to use QuickSubmit"
          />
        </div>
        <h4>Mail copies of your documents</h4>
        <div>
          <p>
            Don’t mail us a printed copy of your pension application. We already
            have your application. If you need to submit supporting documents,
            you can mail copies of your documents to us at this address:
          </p>
          <p className="va-address-block">
            Department of Veterans Affairs
            <br />
            Pension Intake Center
            <br />
            PO Box 5365
            <br />
            Janesville, WI 53547-5365
          </p>
          <p>
            <strong>Note:</strong> Don’t send us your original documents. We
            can’t return them. Mail us copies of your documents only.
          </p>
          <p>
            If we asked you to complete and submit additional forms, be sure to
            make copies of the forms for your records before you mail them to
            us.
          </p>
        </div>
      </section>
      <section>
        <h3>What to expect next</h3>
        <p>
          You don’t need to do anything while you wait for a decision unless we
          send you a letter to ask you for more information. If we send you a
          request for more information, you’ll need to respond within 30 days of
          our request. If you don’t respond within 30 days, we may decide your
          claim with the evidence that’s available to us.
        </p>
        <p>
          If you’ve opted to receive VA emails or texts, we’ll send you updates
          about the status of your application.
        </p>
        <p>
          You can also{' '}
          <va-link
            href="https://www.va.gov/claim-or-appeal-status"
            text="check the status of your pension claim online."
          />
        </p>
        <p>
          <strong>Note:</strong> It may take 7 to 10 days after you apply for
          your pension claim to appear online.
        </p>
      </section>
      {usingDirectDeposit && (
        <section>
          <h3 className="vads-u-margin-bottom--3">
            Direct deposit account information
          </h3>
          <va-alert uswds>
            <h4 slot="headline" className="vads-u-font-size--h4">
              If we approve your application for pension benefits, we’ll use the
              account you provided for all your VA benefit payments
            </h4>
            <p>
              That means we’ll update your direct deposit information for all
              your VA benefit payments. We’ll deposit any payments you may
              receive for pension or education benefits directly into the bank
              account you provided in this application.
            </p>
            <p>
              We use a single account for benefits direct deposits to help
              protect you from fraud, and to make sure we can pay you on time,
              every time, without error.
            </p>
          </va-alert>
          <h4>Bank account you provided in your VA pension application</h4>
          <p className="va-address-block">
            {data.bankAccount.bankName && (
              <>
                {data.bankAccount.bankName}
                <br />
              </>
            )}
            {obfuscateAccountNumber(data.bankAccount.accountNumber)}
            <br />
            {data.bankAccount.accountType.charAt(0).toUpperCase() +
              data.bankAccount.accountType.slice(1)}{' '}
            Account
          </p>
          <p>
            If you currently receive VA benefit payments through direct deposit,
            you can review your direct deposit information.
          </p>
          <va-link
            href="https://www.va.gov/change-direct-deposit/"
            text="Review your direct deposit information"
          />
        </section>
      )}
      <section>
        <h3>How to contact us if you have questions</h3>
        <p>
          You can ask us a question{' '}
          <va-link href="https://ask.va.gov/" text="online through Ask VA." />
        </p>
        <p>
          Or call us at <va-telephone contact="8008271000" international />{' '}
          <va-telephone contact="711" tty />
        </p>
      </section>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteranFullName: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      }).isRequired,
      bankAccount: PropTypes.shape({
        accountType: PropTypes.string,
        bankName: PropTypes.string,
        accountNumber: PropTypes.string,
        routingNumber: PropTypes.string,
      }),
    }),
    submission: PropTypes.shape({
      response: PropTypes.shape({
        confirmationNumber: PropTypes.string,
      }),
      timestamp: PropTypes.string,
    }),
  }),
};

export default connect(mapStateToProps)(ConfirmationPage);
