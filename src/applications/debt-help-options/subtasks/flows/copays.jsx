import React from 'react';

export const copays = {
  questions: {
    initial: {
      title: 'What do you want to do for this copay?',
      options: [
        {
          value: 'requestRelief',
          label: 'Request debt relief (a waiver or compromise offer)',
          nextStep: 'copayReliefQuestion',
        },
        {
          value: 'paymentPlan',
          label: 'Request a monthly payment plan',
          nextStep: 'copayPaymentPlanQuestion',
        },
        {
          value: 'hardship',
          label:
            'Request a hardship determination and copay exemption to stop paying future copays',
          nextStep: 'copayHardshipQuestion',
        },
        {
          value: 'reconsider',
          label: 'Ask VA to reconsider the decision on my waiver request',
          nextStep: 'copayReconsiderQuestion',
        },
        {
          value: 'dispute',
          label: 'Dispute my copay bill',
          nextStep: 'copayDisputeQuestion',
        },
        {
          value: 'makePayment',
          label: 'Pay my copay bill',
          nextStep: 'copayMakePaymentOutcome', // remains as a direct outcome
        },
      ],
    },
    copayReliefQuestion: {
      title: 'Copay Relief: Please answer a few more questions',
      options: [
        {
          value: 'info',
          label: 'I need more information on eligibility',
          nextStep: 'copayReliefOutcome',
        },
        {
          value: 'proceed',
          label: 'I understand the requirements and want to proceed',
          nextStep: 'copayReliefOutcome',
        },
      ],
    },
    copayPaymentPlanQuestion: {
      title: 'Copay Payment Plan: Please answer a few more questions',
      options: [
        {
          value: 'setup',
          label: 'I want to set up a monthly payment plan',
          nextStep: 'copayPaymentPlanOutcome',
        },
        {
          value: 'needHelp',
          label: 'I need help understanding my options',
          nextStep: 'copayPaymentPlanOutcome',
        },
      ],
    },
    copayHardshipQuestion: {
      title: 'Copay Hardship: Please answer a few more questions',
      options: [
        {
          value: 'proceed',
          label: 'Proceed with hardship determination',
          nextStep: 'copayHardshipOutcome',
        },
      ],
    },
    copayReconsiderQuestion: {
      title: 'Copay Reconsideration: Please answer a few more questions',
      options: [
        {
          value: 'reconsider',
          label: 'I want VA to reconsider the decision',
          nextStep: 'copayReconsiderOutcome',
        },
      ],
    },
    copayDisputeQuestion: {
      title: 'Copay Dispute: Please answer a few more questions',
      options: [
        {
          value: 'dispute',
          label: 'I want to dispute my copay bill',
          nextStep: 'copayDisputeOutcome',
        },
      ],
    },
  },
  outcomes: {
    copayReliefOutcome: [
      {
        title: 'Yes',
        message: (
          <>
            <p>
              You can use our online Financial Status Report (VA Form 5655) to
              request help with copay bills within the past 6 months.
            </p>
          </>
        ),
      },
    ],
    copayPaymentPlanOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              You can request a monthly payment plan to pay your debt over time
              by filling out{' '}
              <a href="https://www.va.gov/vaforms/medical/pdf/VA_Form_10-323.pdf">
                Veteran Repayment Plan (RPP) Agreement (VA Form 10-323)
              </a>
              .
            </p>
            <p>
              <va-link
                download
                href="https://www.va.gov/vaforms/medical/pdf/VA_Form_10-323.pdf"
                text="Download Repayment Plan Agreement"
              />
            </p>
          </>
        ),
      },
    ],
    copayHardshipOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              If your income has decreased and you won’t be able to pay future
              copays, we can help. You will need to fill out Request for
              Hardship Determination (VA Form 10-10HS).
            </p>
            <p>
              <va-link-action
                text="Find out how to request a VA hardship determination copay exemption"
                href="https://www.va.gov/health-care/pay-copay-bill/financial-hardship/#what-if-my-income-has-decrease"
              />
            </p>
          </>
        ),
      },
    ],
    copayReconsiderOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              To ask VA to reconsider the decision on a denied waiver request,
              call our Health Resource Center at{' '}
              <va-telephone contact="8664001238" /> (
              <va-telephone contact="711" tty />
              ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          </>
        ),
      },
    ],
    copayDisputeOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              You have the right to dispute all or part of your copay charges.
              To avoid late charges, you’ll need to dispute the debt within 30
              days of receiving your bill.
            </p>
            <p>
              <va-link-action
                text="Learn more about disputing copay charges"
                href="https://www.va.gov/health-care/pay-copay-bill/dispute-charges/"
              />
            </p>
          </>
        ),
      },
    ],
    copayMakePaymentOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              To pay your bill, have your account number ready. You can find
              this on the patient statement.
            </p>
            <p>
              <va-link-action
                text="Pay your copay bill at Pay.gov"
                href="https://www.pay.gov/public/form/start/25987221/"
              />
            </p>
            <p>
              Visit{' '}
              <a href="https://va.gov/manage-va-debt/">Manage your VA debt</a>{' '}
              for information on paying by phone or mail.
            </p>
            <p>
              Be sure to make a payment or request help within{' '}
              <strong>30 days</strong> of when you receive your first debt
              letter from us. This will help you avoid late fees, interest, or
              other collection action.
            </p>
          </>
        ),
      },
    ],
  },
};
