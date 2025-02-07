import React from 'react';

export const overpayments = {
  steps: {
    initial: {
      title: 'What do you want to do for this benefit overpayment?',
      options: [
        {
          value: 'requestRelief',
          label: 'Request debt relief (a waiver or compromise offer)',
          nextStep: 'debtReliefOutcome',
        },
        {
          value: 'paymentPlan',
          label: 'Request an extended monthly payment plan',
          nextStep: 'paymentPlanQuestion',
        },
        {
          value: 'report',
          label: 'Report an error or a disagreement with a VA decision',
          nextStep: 'reportQuestion',
        },
        {
          value: 'reconsider',
          label: 'Ask VA to reconsider the decision on my waiver request',
          nextStep: 'reconsiderQuestion',
        },
        {
          value: 'makePayment',
          label: 'Make a payment on an overpayment',
          nextStep: 'makePaymentOutcome',
        },
      ],
    },
    paymentPlanQuestion: {
      title: 'How much time do you need to repay the overpayment?',
      options: [
        {
          value: 'lessthan5',
          label: '5 years or less',
          nextStep: 'paymentPlanLessThan5Outcome',
        },
        {
          value: 'morethan5',
          label: 'More than 5 years',
          nextStep: 'paymentPlan5orMoreOutcome',
        },
      ],
    },
    reportQuestion: {
      title: 'Which of these issues do you want to report?',
      options: [
        {
          value: 'disagree',
          label:
            'I disagree with the VA decision that resulted in this overpayment',
          nextStep: 'reportDisagreeOutcome',
        },
        {
          value: 'error',
          label:
            'I think this overpayment is due to an error or the amount is wrong',
          nextStep: 'reportErrorOutcome',
        },
      ],
    },
    reconsiderQuestion: {
      title: 'How do you want us to reconsider the decision?',
      options: [
        {
          value: 'waiverReconsider',
          label:
            'I want to ask the Committee of Waivers and Compromises to reconsider my waiver',
          nextStep: 'reconsiderWaiverOutcome',
        },
        {
          value: 'appeal',
          label:
            "I want appeal the decision with the Board of Veterans' Appeals",
          nextStep: 'reconsiderAppealOutcome',
        },
      ],
    },
  },
  outcomes: {
    requestRelieOutcome: [
      {
        title: 'Yes',
        message: (
          <>
            <p>
              <strong>If you’re a spouse or dependent</strong>
            </p>
            <p>
              Fill out the PDF version of the{' '}
              <va-link
                download
                href="https://www.va.gov/find-forms/about-form-5655/"
                title="Download the PDF version of VA Form 5655"
                text="Financial Status Report (VA Form 5655)"
              />
              .
            </p>
            <p>
              <strong>
                If you submitted VA Form 5655 in the past 6 months
              </strong>
            </p>
            <p className="vads-u-margin-top--0">
              You don’t need to submit a new request unless you have changes to
              report. Call us at <va-telephone contact="8008271000" /> (or{' '}
              <va-telephone contact="6127136415" international /> from
              overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00
              p.m. ET. If you have hearing loss, call (
              <va-telephone contact="711" tty />
              ).
            </p>
          </>
        ),
      },
    ],
    paymentPlanLessThan5Outcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              You don’t need to submit a Financial Status Report (VA Form 5655)
              to request an extended monthly payment plan of up to 5 years.
              During this time, you can request a plan online, by phone, or by
              mail.
            </p>
            <ul>
              <li>
                <strong>Online:</strong>{' '}
                <va-link
                  href="https://www.va.gov/contact-us/"
                  text="Contact us through Ask VA"
                />
              </li>
              <li>
                <strong>Phone: </strong>
                Call us at <va-telephone contact="8008271000" /> (or{' '}
                <va-telephone
                  contact="6127136415"
                  international="true"
                  tty="true"
                />
                from overseas). We’re here Monday through Friday, 7:30 a.m. to
                7:00 p.m. ET. If you have hearing loss, call (
                <va-telephone contact="711" tty="true" />
                ).
              </li>
              <li>
                <strong>Mail: </strong>
                <div>Debt Management Center</div>
                <div>P.O. Box 11930</div>
                <div>St. Paul, MN 55111-0930</div>
              </li>
            </ul>
          </>
        ),
      },
    ],
    paymentPlan5orMoreOutcome: [
      {
        title: 'Yes',
        message: (
          <>
            <p>
              <strong>
                If you submitted VA Form 5655 in the past 6 months
              </strong>
            </p>
            <p className="vads-u-margin-top--0">
              You don’t need to submit a new request unless you have changes to
              report. Call us at <va-telephone contact="8008271000" /> (or{' '}
              <va-telephone contact="6127136415" international /> from
              overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00
              p.m. ET. If you have hearing loss, call (
              <va-telephone contact="711" tty />
              ).
            </p>
          </>
        ),
      },
    ],
    reportDisagreeOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              If you disagree with the VA decision that resulted in this
              overpayment, you can{' '}
              <a href="https://va.gov/decision-reviews/">
                submit a Supplemental Claim, request a Higher Level Review, or a
                board appeal
              </a>
              .
            </p>
            <p>If you need more help, you can call your VA benefit office.</p>
            <p>
              <a href="https://va.gov/resources/helpful-va-phone-numbers/">
                Find helpful VA phone numbers
              </a>
            </p>
            <p>
              <strong>What to know about debt waivers</strong>
            </p>
            <p>
              You have <strong>1 year</strong> from the date you received your
              first debt letter to request a debt waiver. A waiver is a request
              to ask us to stop collection on your debt.
            </p>
            <p>
              If you’re worried that we won’t complete your appeal before the 1
              year limit, you can request a waiver with our online Financial
              Status Report (VA Form 5655).
            </p>
            <p>
              <a href="https://www.va.gov/find-forms/about-form-5655/">
                Request help with VA Form 5655
              </a>
            </p>
            <p>
              <strong>Note: </strong>
              We’ll continue to add late fees and interest, and take other
              collection action as needed, while we consider your appeal.
            </p>
          </>
        ),
      },
    ],
    reportErrorOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              If you think your overpayment or the amount of your debt is due to
              an error, you can dispute it. Submit a written statement to tell
              us why you dispute the overpayment.
            </p>
            <p>You can submit your dispute statement online or by mail.</p>
            <ul>
              <li>
                <strong>Online:</strong>{' '}
                <va-link
                  href="https://www.va.gov/contact-us/"
                  text="Contact us through Ask VA"
                />
              </li>
              <li>
                <strong>Mail: </strong>
                <div>Debt Management Center</div>
                <div>P.O. Box 11930</div>
                <div>St. Paul, MN 55111-0930</div>
              </li>
            </ul>
            <p>
              <strong>Note:</strong> You have <strong>1 year</strong> from the
              date you received your first debt letter to submit your dispute
              statement. After this time, we can’t consider the request.
            </p>
            <p>
              We encourage you to submit your dispute statement within 30 days.
              If we receive the statement within <strong>30 days</strong>, we
              won’t add late fees and interest, or take other collection action,
              while we review your dispute.
            </p>
          </>
        ),
      },
    ],
    reconsiderWaiverOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              To ask our Committee of Waivers and Compromises to reconsider your
              waiver, you’ll need to tell us why you think we should reconsider.
            </p>
            <p>You can submit your dispute statement online or by mail.</p>
            <ul>
              <li>
                <strong>Online:</strong>{' '}
                <va-link
                  href="https://www.va.gov/contact-us/"
                  text="Contact us through Ask VA"
                />
              </li>
              <li>
                <strong>Mail: </strong>
                <div>Debt Management Center</div>
                <div>P.O. Box 11930</div>
                <div>St. Paul, MN 55111-0930</div>
              </li>
            </ul>
          </>
        ),
      },
    ],
    reconsiderAppealOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              If you disagree with our decision on your waiver request, you can{' '}
              <va-link
                href="https://va.gov/decision-reviews/board-appeal/"
                text="request a Board Appeal"
              />
              . When you choose this option, you appeal to a Veterans Law Judge
              at the Board of Veterans Appeals in Washington, D.C. A judge who’s
              an expert in Veterans law will review your case.
            </p>
            <p>
              <va-link-action
                href="https://va.gov/decision-reviews/board-appeal/"
                text="Learn how to request a Board Appeal"
              />
            </p>
            <p>
              <strong>Note:</strong> You have 1 year from the date on your
              decision letter to request a Board Appeal, unless you have a{' '}
              <a href="https://va.gov/decision-reviews/contested-claims/">
                contested claim.
              </a>
            </p>
          </>
        ),
      },
    ],
    makePaymentOutcome: [
      {
        title: 'No',
        message: (
          <>
            <p>
              You can make payments on VA disability compensation, pension, or
              education overpayments by visiting{' '}
              <a href="https://www.pay.va.gov/">pay.va.gov</a>.
            </p>
            <p>
              <va-link-action
                href="https://www.pay.va.gov/"
                text="Pay your benefit overpayment"
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
