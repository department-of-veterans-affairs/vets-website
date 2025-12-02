import React from 'react';

export default function ProcessList() {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>
          You’ll need to have applied for at least one of these VA education
          benefits and be found eligible in order for your reimbursement to be
          processed.
        </p>
        <p>
          <a href="https://www.va.gov/education/apply-for-gi-bill-form-22-1990/introduction">
            Application for VA Education Benefits Form 22-1990 (opens in a new
            tab)
          </a>
          , <strong>or</strong>{' '}
          <a href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction">
            Dependents’ Application for VA Education Benefits Form 22-5490
            (opens in a new tab)
          </a>
          , <strong>or</strong>{' '}
          <a href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e/introduction">
            Application for Family Member to Use Transferred Benefits Form
            22-1990e (opens in a new tab)
          </a>
        </p>
        <p>You must also have paid in full for the test.</p>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <h4>Here’s what you’ll need to fill out this form:</h4>
        <ul>
          <li>
            Your social security number or VA file number along with payee
            number (if applicable)
          </li>
          <li>Your current mailing address and contact information</li>
          <li>
            The name of the licensing or certification test and date test was
            taken
          </li>
          <li>
            The name and address of organization issuing the license or
            certification
          </li>
          <li>A receipt and a copy of your test results</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Fill out the online form">
        <p>
          We’ll take you through each step of the process. It should take about
          15 minutes. You’ll also be provided the opportunity to give additional
          commentary regarding your licensing or certification test.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Upload your form and attachments to QuickSubmit or mail them to your Regional Processing Office">
        <p>
          You will need to take your completed form as well as your receipt and
          test results to QuickSubmit to finish the submission process there.
        </p>
        <p>
          If you would rather print and mail your form and attachments, the
          addresses for your region will be listed at the end of this form.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
}
