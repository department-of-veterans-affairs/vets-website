import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { utcToZonedTime, format } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { isLoggedIn } from 'platform/user/selectors';

import { focusElement } from 'platform/utilities/ui';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { SubmissionConfirmationAlert } from '../components/FormAlerts';
import {
  formatFullName,
  obfuscateAccountNumber,
  scrollToTop,
} from '../helpers';

const centralTz = 'America/Chicago';

const ConfirmationPage = ({ route }) => {
  const form = useSelector(state => state.form);
  const loggedIn = useSelector(isLoggedIn);
  const { formConfig } = route;
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showUpdatedConfirmation = useToggleValue(
    TOGGLE_NAMES.pensionConfirmationUpdate,
  );
  const { submission, data } = form;
  const response = submission?.response ?? {};
  const fullName = formatFullName(data?.veteranFullName ?? {});

  const usingDirectDeposit =
    !!data.bankAccount && Object.keys(data.bankAccount).length > 0;

  const zonedDate = submission?.timestamp
    ? utcToZonedTime(submission?.timestamp, centralTz)
    : null;
  const submittedAt = zonedDate
    ? format(zonedDate, 'LLL d, yyyy h:mm a zzz', { timeZone: centralTz })
    : '';

  const confirmationNumber = response?.confirmationNumber;
  const submissionAlertContent = (
    <>
      <p>Your submission is in progress.</p>
      <p>
        It can take up to 10 days for us to receive your form.
        {confirmationNumber &&
          ` Your confirmation number is ${confirmationNumber}.`}
      </p>
    </>
  );

  useEffect(() => {
    focusElement('h2');
    scrollToTop();
  }, []);

  return (
    <div className="vads-u-margin-bottom--9">
      <ConfirmationView
        submitDate={submission?.timestamp}
        confirmationNumber={confirmationNumber}
        formConfig={formConfig}
      >
        {showUpdatedConfirmation ? (
          <ConfirmationView.SubmissionAlert
            content={submissionAlertContent}
            actions={<p />}
          />
        ) : (
          <>
            <h2 className="vads-u-margin-bottom--3">
              Your Veterans Pension application
            </h2>
            <SubmissionConfirmationAlert />
            <br />
          </>
        )}
        <va-summary-box>
          <h3 slot="headline" className="vads-u-margin-top--0">
            Your information for this application
          </h3>
          <h4>Your name</h4>
          <p className="name dd-privacy-hidden" data-dd-action-name="full name">
            {fullName}
          </p>
          <h4>Date you submitted your application</h4>
          <p>{submittedAt}</p>
          {confirmationNumber && (
            <>
              <h4 id="pension_527ez_submission_confirmation">
                Confirmation number
              </h4>
              <p>{confirmationNumber}</p>
            </>
          )}
          {!showUpdatedConfirmation && (
            <va-button
              class="screen-only"
              text="Print this page"
              onClick={() => {
                window.print();
              }}
            />
          )}
        </va-summary-box>
        {showUpdatedConfirmation ? (
          <>
            <ConfirmationView.PrintThisPage />
            <ConfirmationView.WhatsNextProcessList
              item1Header="We’ll confirm when we receive your form"
              item1Content="This can take up to 10 days. When we receive your form, we'll send you an email."
              item1Actions={<p />}
              item2Content="If we have questions or need more information after reviewing your form, we'll contact you by phone, email, or mail."
            />
            <p className="vads-u-padding-left--7">
              If we send you a request for more information, you’ll need to
              respond within 30 days of our request. If you don’t respond within
              30 days, we may decide your claim with the evidence thats
              available to us.
            </p>
            {loggedIn ? (
              <section>
                <h2>If you need to submit supporting documents</h2>
                <p>
                  If you didn’t already submit your supporting documents and
                  additional evidence, you can submit them in one of these 2
                  ways:
                </p>
                <h3>
                  Option 1: Upload your documents using the Claim Status Tool
                </h3>
                <p>
                  It may take 7-10 days for your pension claim to appear in the
                  Claim Status Tool. After your pension claim appears, you can
                  upload your documents in the Files tab.
                </p>
                <va-link
                  href="/track-claims"
                  text="Use the Claim Status Tool to upload your documents"
                />
                <h3>Option 2: Mail us copies of your documents</h3>
                <p>
                  Don’t send us a printed copy of your pension claim. We already
                  have it. And don’t send us your original documents. We can’t
                  return them.
                </p>
                <p>Mail us copies of your documents to this address:</p>
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
                  <strong>Note:</strong> If we asked you to submit any
                  supporting documents, you should keep a copy of them for your
                  records.
                </p>
              </section>
            ) : (
              <section>
                <h2>If you need to submit supporting documents</h2>
                <p>
                  If you didn’t already submit your supporting documents and
                  additional evidence, you can submit copies of your documents
                  by mail.
                </p>
                <p>Mail any supporting documents to this address:</p>
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
                  <strong>Note:</strong> Mail us copies of your documents only.
                  Don’t send us your original documents. We can’t return them.
                </p>
              </section>
            )}
          </>
        ) : (
          <>
            <section>
              <h2>If you need to submit supporting documents</h2>
              <span>You can submit supporting documents in one of 2 ways:</span>
              <h4>Submit your documents online through AccessVA</h4>
              <div>
                <p>
                  You can use the QuickSubmit tool through AccessVA to submit
                  your documents online.
                </p>
                <va-link
                  href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
                  text="Go to AccessVA to use QuickSubmit"
                />
              </div>
              <h4>Mail copies of your documents</h4>
              <div>
                <p>
                  Don’t mail us a printed copy of your pension application. We
                  already have your application. If you need to submit
                  supporting documents, you can mail copies of your documents to
                  us at this address:
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
                  <strong>Note:</strong> Don’t send us your original documents.
                  We can’t return them. Mail us copies of your documents only.
                </p>
                <p>
                  If we asked you to complete and submit additional forms, be
                  sure to make copies of the forms for your records before you
                  mail them to us.
                </p>
              </div>
            </section>
            <section>
              <h2>What to expect next</h2>
              <p>
                You don’t need to do anything while you wait for a decision
                unless we send you a letter to ask you for more information. If
                we send you a request for more information, you’ll need to
                respond within 30 days of our request. If you don’t respond
                within 30 days, we may decide your claim with the evidence
                that’s available to us.
              </p>
              <p>
                If you’ve opted to receive VA emails or texts, we’ll send you
                updates about the status of your application. You can manage
                your notification settings within your Va.gov profile.
              </p>
              <p>
                You can also{' '}
                <va-link
                  href="https://www.va.gov/claim-or-appeal-status"
                  text="check the status of your pension claim online."
                />
              </p>
              <p>
                <strong>Note:</strong> It may take 7 to 10 days after you apply
                for your pension claim to appear online.
              </p>
            </section>
          </>
        )}
        {usingDirectDeposit && (
          <section>
            <h2>Direct deposit account information</h2>
            <va-alert>
              <h4 slot="headline" className="vads-u-font-size--h4">
                If we approve your application for pension benefits, we’ll use
                the account you provided for all your VA benefit payments
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
            <p className="va-address-block dd-privacy-hidden">
              {data.bankAccount.bankName && (
                <span data-dd-action-name="bank name">
                  {data.bankAccount.bankName}
                  <br />
                </span>
              )}
              {data.bankAccount.accountNumber ? (
                <span data-dd-action-name="bank account number">
                  {obfuscateAccountNumber(data.bankAccount.accountNumber)}
                  <br />
                </span>
              ) : null}
              {data.bankAccount.accountType ? (
                <span data-dd-action-name="bank account type">
                  {`${data.bankAccount.accountType.charAt(0).toUpperCase() +
                    data.bankAccount.accountType.slice(1)} Account`}
                </span>
              ) : null}
            </p>
            <p>
              If you currently receive VA benefit payments through direct
              deposit, you can review your direct deposit information.
            </p>
            <va-link
              href="https://www.va.gov/change-direct-deposit/"
              text="Review your direct deposit information"
            />
          </section>
        )}
        {showUpdatedConfirmation ? (
          <>
            <section>
              <h2>When to tell us if your information changes</h2>
              <p>
                If you receive Veterans Pension benefits, you’ll need to tell us
                if certain information changes. Tell us right away if any of
                these are true for you:
              </p>
              <ul>
                <li>
                  Your income or the income of your dependents changes
                  (including earnings, Social Security benefits, or lottery and
                  gambling winnings)
                </li>
                <li>
                  Your net worth increases (including bank accounts,
                  investments, or real estate)
                </li>
                <li>Your medical expenses decrease</li>
                <li>
                  You add or remove a dependent (including children, parents, or
                  spouses)
                </li>
                <li> Your address or phone number changes</li>
              </ul>
            </section>
            <ConfirmationView.HowToContact />
          </>
        ) : (
          <section>
            <h2>How to contact us if you have questions</h2>
            <p>
              You can ask us a question{' '}
              <va-link
                href="https://ask.va.gov/"
                text="online through Ask VA."
              />
            </p>
            <p>
              Or call us at <va-telephone contact="8008271000" international />{' '}
              <va-telephone contact="711" tty />
            </p>
          </section>
        )}
        <div className="screen-only vads-u-margin-top--4">
          <a className="vads-c-action-link--green" href="/">
            Go back to VA.gov
          </a>
        </div>
        {showUpdatedConfirmation && <ConfirmationView.NeedHelp />}
      </ConfirmationView>
    </div>
  );
};

ConfirmationPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired,
  }).isRequired,
};

export default ConfirmationPage;
