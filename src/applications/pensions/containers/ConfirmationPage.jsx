import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { utcToZonedTime, format } from 'date-fns-tz';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { formatFullName, obfuscateAccountNumber } from '../helpers';

const centralTz = 'America/Chicago';

const ConfirmationPage = ({ route }) => {
  const form = useSelector(state => state.form);
  const { formConfig } = route;
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
        <ConfirmationView.SubmissionAlert
          content={submissionAlertContent}
          actions={<p />}
        />
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
        </va-summary-box>
        <ConfirmationView.PrintThisPage />
        <ConfirmationView.WhatsNextProcessList
          item1Header="We’ll confirm when we receive your form"
          item1Content="This can take up to 10 days. When we receive your form, we'll send you an email."
          item1Actions={<p />}
          item2Content="If we have questions or need more information after reviewing your form, we'll contact you by phone, email, or mail."
        />
        <p className="vads-u-padding-left--7">
          If we send you a request for more information, you’ll need to respond
          within 30 days of our request. If you don’t respond within 30 days, we
          may decide your claim with the evidence thats available to us.
        </p>
        <section>
          <h2>If you need to submit supporting documents</h2>
          <p>
            If you didn’t already submit your supporting documents and
            additional evidence, you can submit them in one of these 2 ways:
          </p>
          <h3>Option 1: Upload your documents using the Claim Status Tool</h3>
          <p>
            It may take 7-10 days for your pension claim to appear in the Claim
            Status Tool. After your pension claim appears, you can upload your
            documents in the Files tab.
          </p>
          <va-link
            href="/track-claims"
            text="Use the Claim Status Tool to upload your documents"
          />
          <h3>Option 2: Mail us copies of your documents</h3>
          <p>
            Don’t send us a printed copy of your pension claim. We already have
            it. And don’t send us your original documents. We can’t return them.
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
            <strong>Note:</strong> If we asked you to submit any supporting
            documents, you should keep a copy of them for your records.
          </p>
        </section>
        {usingDirectDeposit && (
          <section>
            <h2>Direct deposit account information</h2>
            <va-alert>
              <h3 slot="headline" className="vads-u-font-size--h4">
                If we approve your application for pension benefits, we’ll use
                the account you provided for all your VA benefit payments
              </h3>
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
        <section>
          <h2>When to tell us if your information changes</h2>
          <p>
            If you receive Veterans Pension benefits, you’ll need to tell us if
            certain information changes. Tell us right away if any of these are
            true for you:
          </p>
          <ul>
            <li>
              Your income or the income of your dependents changes (including
              earnings, Social Security benefits, or lottery and gambling
              winnings)
            </li>
            <li>
              Your net worth increases (including bank accounts, investments, or
              real estate)
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
        <ConfirmationView.GoBackLink />
        <ConfirmationView.NeedHelp />
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
