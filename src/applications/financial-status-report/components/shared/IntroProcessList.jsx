import React from 'react';

const IntroProcessList = () => {
  return (
    <>
      <va-process-list
        class="vads-u-margin-left--neg2 vads-u-padding-bottom--0"
        data-testid="static-process-list"
      >
        <va-process-list-item header="Make sure this is the right form for you">
          <p>
            You should only use this form if all these descriptions are true for
            you:
          </p>
          <ul>
            <li>
              You’re a Veteran, <strong>and</strong>
            </li>
            <li>
              You need to request a repayment plan of more than 5 years or debt
              relief (a waiver or compromise offer), <strong>and</strong>
            </li>
            <li>
              You need to request help for a VA disability compensation,
              pension, or GI Bill benefit overpayment or a VA health care copay
              debt
            </li>
          </ul>
          <p>Not sure if this is the right form for you?</p>
          <va-link
            data-testid="learn-more-about-options-link"
            href="/resources/options-to-request-help-with-va-debt/"
            text="Learn more about options for requesting help with VA debts"
          />
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <p>Here’s what you’ll need to fill out your request:</p>
          <ul>
            <li>
              <strong>Work history for the past 2 years.</strong> You’ll need
              the employer’s name, start and end dates, and monthly income for
              each job.
            </li>
            <li>
              <strong>Income.</strong> This includes earned money from a job, VA
              or Social Security benefits, or other sources. You’ll find the
              details you’ll need on a recent pay stub or statement.
            </li>
            <li>
              <strong>Assets.</strong> This includes cash in hand and in a
              checking or savings account.
            </li>
          </ul>
          <p>
            We may also ask you to share this information for you and your
            spouse (if you’re married):
          </p>
          <ul>
            <li>
              <strong>Additional assets.</strong> This includes stocks and
              bonds, real estate, cars, jewelry, and other items of value.
            </li>
            <li>
              <strong>Monthly living expenses.</strong> These include housing,
              food, and utilities (like gas, electricity, and water.)
            </li>
            <li>
              <strong>Installment contracts or other debts.</strong> These
              include car loans, student loans, credit card debt, and other
              debts or purchase payment plans.
            </li>
            <li>
              <strong>Other living expenses.</strong> These include expenses
              like clothing, transportation, child care, or health care.
            </li>
            <li>
              <strong>If you’ve ever declared bankruptcy,</strong> you’ll need
              any related documents.
            </li>
          </ul>
          {/* <li></li> */}
        </va-process-list-item>
        <va-process-list-item header="Start your request">
          <p>
            We’ll take you through each step of the process. It should take
            about 60 minutes.
          </p>
          <p>
            When your request, you’ll get a confirmation message. You can print
            this for your records.
          </p>
          <p>
            <strong>Note:</strong> Submit your request within{' '}
            <strong>30 days</strong> of receiving a debt collection letter from
            us. This will help you avoid late fees, interest, and other
            collection actions.
          </p>
        </va-process-list-item>
      </va-process-list>
      <h2 className="vads-u-font-size--h3">After you submit your request</h2>
      <p>
        After we review your request, we’ll send you this information by mail:
      </p>
      <ul>
        <li>Our decision on your request</li>
        <li>Any payments you may need to make, and how to make them</li>
        <li>How to appeal our decision if you disagree</li>
      </ul>
      <p>If you need to make any payments, be sure to pay on time.</p>
    </>
  );
};

IntroProcessList.propTypes = {};

export default IntroProcessList;
