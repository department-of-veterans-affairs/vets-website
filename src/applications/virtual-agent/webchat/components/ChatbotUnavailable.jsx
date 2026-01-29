import React from 'react';

export default function ChatbotUnavailable() {
  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5">
          <h1>VA chatbot</h1>
          <p>
            We closed our beta testing period for the VA.gov chatbot on January
            12, 2026. We're now using your feedback to improve the chatbot
            before we bring it back to the site later this year. Thank you for
            your patience as we work to improve your experience.
          </p>

          <h2>Continue to manage your benefits and health care on VA.gov</h2>
          <p>
            While we work to improve the chatbot, you can continue to manage
            your VA benefits and health care on VA.gov.
          </p>

          <h3>Get help with signing in to VA.gov</h3>
          <ul>
            <li>
              <va-link
                href="/resources/creating-an-account-for-vagov/"
                text="Creating an account for VA.gov"
              />
            </li>
            <li>
              <va-link
                href="/resources/support-for-common-idme-and-logingov-issues/"
                text="Support for common ID.me and Login.gov issues"
              />
            </li>
            <li>
              <va-link
                href="/resources/verifying-your-identity-on-vagov/"
                text="Verifying your identity on VA.gov"
              />
            </li>
            <li>
              <va-link
                href="/resources/signing-in-to-vagov/"
                text="Signing in to VA.gov"
              />
            </li>
          </ul>

          <h3>Manage common benefit needs</h3>
          <ul>
            <li>
              <va-link
                href="/claim-or-appeal-status/"
                text="Check your claim, decision review, or appeal status"
              />
            </li>
            <li>
              <va-link
                href="/va-payment-history/"
                text="Review your payment history"
              />
            </li>
            <li>
              <va-link
                href="/records/download-va-letters/"
                text="Download your benefit letters"
              />
            </li>
            <li>
              <va-link
                href="/disability/view-disability-rating/"
                text="Review your disability rating"
              />
            </li>
            <li>
              <va-link
                href="/view-change-dependents/"
                text="Manage dependents for disability, pension, or DIC benefits"
              />
            </li>
            <li>
              <va-link
                href="/education/verify-school-enrollment/"
                text="Verify your school enrollment"
              />
            </li>
            <li>
              <va-link
                href="/education/check-remaining-gi-bill-benefits/"
                text="Check your remaining GI Bill benefits"
              />
            </li>
          </ul>

          <h3>Manage common health care needs</h3>
          <ul>
            <li>
              <va-link
                href="https://www.myhealth.va.gov/"
                text="Manage your health care with My HealtheVet"
                external
              />
            </li>
            <li>
              <va-link
                href="/my-health/appointments/"
                text="Manage health appointments"
              />
            </li>
            <li>
              <va-link
                href="/my-health/medications/"
                text="Refill prescriptions and manage medications"
              />
            </li>
            <li>
              <va-link
                href="/my-health/travel-claim-status/"
                text="File for travel pay reimbursement"
              />
            </li>
          </ul>

          <h3>Get more help and information</h3>
          <ul>
            <li>
              <va-link
                href="/resources/"
                text="Explore our resources and support content"
              />
            </li>
            <li>
              <va-link
                href="/contact-us/ask-va-faqs/"
                text="Contact us online through Ask VA"
              />
            </li>
            <li>
              <va-link
                href="/contact-us/"
                text="Call us at one of our helpful VA phone numbers"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
