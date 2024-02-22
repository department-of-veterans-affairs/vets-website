import React from 'react';
import { utcToZonedTime, format } from 'date-fns-tz';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { scrollToTop, formatFullName } from '../helpers';

const centralTz = 'America/Chicago';

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  render() {
    const {
      form: { submission, data },
    } = this.props;
    const response = submission?.response ?? {};
    const fullName = formatFullName(data?.veteranFullName ?? {});

    const zonedDate = utcToZonedTime(submission?.timestamp, centralTz);
    const submittedAt = format(zonedDate, 'LLL d, yyyy h:mm a zzz', {
      timeZone: centralTz,
    });

    return (
      <div>
        <h2>Your Veteran's Pension application</h2>

        <va-alert status="success">
          <h3>Thank you for submitting your Veterans Pension application.</h3>
          <p>
            We've received your Veterans Pension application (VA Form
            21P-527EZ). After we complete our review, we'll mail you a decision
            letter with the details of our decision.
          </p>
        </va-alert>

        <div className="inset">
          <h3>Your information for this application</h3>

          <h4>Your name</h4>
          <span>{fullName}</span>

          <h4>Date you submitted your application</h4>
          <span>{submittedAt}</span>

          {response?.confirmationNumber && (
            <>
              <h4>Confirmation number</h4>
              <span>{response?.confirmationNumber}</span>
            </>
          )}

          <va-button text="Print this page for your records" />
        </div>

        <h3>If you need to submit supporting documents</h3>
        <span>You can submit supporting documents in one of 2 ways:</span>

        <h4>Submit your documents online through AccessVA</h4>
        <div>
          <span>
            You can use the QuickSubmit tool through AccessVA to submit your
            documents online.
          </span>
          <br />
          <a
            href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
            target="_blank"
            rel="noreferrer"
          >
            Go to AccessVA to use QuickSubmit (opens in new tab).
          </a>
        </div>

        <h4>Mail copies of your documents</h4>
        <div>
          <span>
            Don’t mail us a printed copy of your pension application. We already
            have your application. If you need to submit supporting documents,
            you can mail copies of your documents to us at this address:
          </span>
          <p className=".va-address-block">
            Department of Veterans Affairs
            <br />
            Pension Intake Center
            <br />
            PO Box 5365
            <br />
            Janesville, WI 53547-5365
          </p>
          <span>
            <strong>Note:</strong> Don't send us your original documents. We
            can't return them. Mail us copies of your documents only.
          </span>
          <span>
            If we asked you to complete and submit additional forms, be sure to
            make copies of the forms for your records before you mail them to
            us.
          </span>
        </div>

        <h3>What to expect next</h3>
        <div>
          <span>
            You don't need to do anything while you wait for a decision unless
            we send you a letter to ask you for more information. If we send you
            a request for more information, you’ll need to respond within 30
            days of our request. If you don't respond within 30 days, we may
            decide your claim with the evidence that's available to us.
          </span>
          <br />
          <span>
            If you’ve opted to receive VA emails or texts, we’ll send you
            updates about the status of your application.
          </span>
          <br />
          <span>
            You can also{' '}
            <a href="https://www.va.gov/claim-or-appeal-status">
              check the status of your pension claim online.
            </a>
          </span>
          <br />
          <span>
            <strong>Note:</strong> It may take 7 to 10 days after you apply for
            your pension claim to appear online.
          </span>
        </div>

        <h3>How to contact us if you have questions</h3>
        <div>
          <span>
            You can ask us a question{' '}
            <a href="https://ask.va.gov/">online through Ask VA.</a>
          </span>
          <br />
          <span>
            Or call us at <va-telephone contact="8008271000" international />
            (TTY: <va-telephone contact="711" tty />)
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
