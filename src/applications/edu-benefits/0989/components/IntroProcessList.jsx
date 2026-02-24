import React from 'react';

export default function ProcessList() {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>
          Entitlement restoration can only be granted for certain education
          benefits. You’ll need to have applied and be found eligible for the VA
          education benefit under which you want your reimbursement processed.
        </p>
        <ul>
          <li>Post-9/11 GI Bill (Chapter 33)</li>
          <li>
            Survivors' and Dependents' Educational Assistance (DEA) Program
            (Chapter 35)
          </li>
          <li>Montgomery GI Bill (MGIB) (Chapter 30)</li>
          <li>Montgomery GI Bill - Selected Reserve (Chapter 1606)</li>
          <li>
            Post-Vietnam Era Veterans' Educational Assistance Program (VEAP)
            (Chapter 32)
          </li>
        </ul>
        <p>
          If you haven’t applied for VA education benefits, you may do so by
          completing Form 22-1990, Form 22-5490, or 22-1990e.
        </p>
        <p>
          <a
            href="https://www.va.gov/education/apply-for-gi-bill-form-22-1990/introduction"
            target="_blank"
            rel="noreferrer"
          >
            Apply for VA education benefits using Form 22-1990
          </a>
          , <strong>or</strong>{' '}
        </p>
        <p>
          <a
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction"
            target="_blank"
            rel="noreferrer"
          >
            Apply for VA education benefits as a dependent using Form 22-5490
          </a>
          , <strong>or</strong>{' '}
        </p>
        <p>
          <a
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e/introduction"
            target="_blank"
            rel="noreferrer"
          >
            Apply to use transferred education benefits using Form 22-1990e
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <h4>Here’s what you’ll need to apply:</h4>
        <ul>
          <li>Your social security number or your VA file number</li>
          <li>Your current mailing address and contact information</li>
          <li>
            The name and mailing address of the institution where the program or
            school was suspended, withdrawn or closed.
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Complete your application">
        <p>
          The request should take about 15 minutes to complete. You can include
          any additional information you think is relevant in your request to
          have your entitlement restored.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Upload your form">
        <p>
          This application does not submit automatically. After you review your
          information, download your completed VA Form 22-0989. Then upload the
          form manually through QuickSubmit to complete the submission process.
        </p>
        <p>
          If you would rather print and mail your form and attachments, the
          addresses for your region will be listed at the end of this form.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
}
