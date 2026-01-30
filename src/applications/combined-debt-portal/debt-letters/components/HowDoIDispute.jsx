import React from 'react';

const HowDoIDispute = () => {
  return (
    <section>
      <h2
        id="howDoIDispute"
        className="vads-u-margin-top--4 vads-u-margin-bottom-2"
      >
        How to dispute an overpayment
      </h2>

      <p>
        If you think your debt is an error, your first step should be to dispute
        the charges. If you dispute the debt within <strong>30 days</strong>,
        you can avoid collection actions. You’ll need to continue making
        payments on your debt while we review your dispute.
      </p>
      <p>You can dispute an overpayment online through our form.</p>
      <va-link-action
        href="/manage-va-debt/dispute-debt/"
        message-aria-describedby="Opens pay.va.gov"
        text="Dispute an overpayment online"
        type="secondary"
      />
      <va-accordion open-single>
        <va-accordion-item
          header="Other ways to dispute an overpayment"
          subheader="You can also dispute charges for an overpayment online through Ask
            VA or by mail."
          id="other-ways-to-dispute"
          class="vads-u-margin-top--2"
          bordered
        >
          <h3 className="vads-u-margin-top--0">
            Dispute online through Ask VA
          </h3>
          <p>Follow these steps to dispute overpayment debt through Ask VA:</p>
          <ol>
            <li>
              <va-link
                text="Go to Ask VA to start your VA debt dispute"
                href="/contact-us/ask-va/introduction"
              />
            </li>
            <li>
              For the category, select{' '}
              <strong>
                Debt for benefit overpayments and health care copay bills
              </strong>
            </li>
            <li>
              For the topic, select the type of overpayment you’re disputing
            </li>
            <li>Answer the questions about your information</li>
            <li>
              When you get to the <strong>Your question</strong> section, enter
              if you’re disputing all or part of the overpayment and why
              disputing this debt
            </li>
            <li>Upload your written statement and any supporting evidence</li>
          </ol>
          <h3>Dispute by mail</h3>
          <p>Send your written statement to this address:</p>
          <p className="va-address-block vads-u-margin-left--4 vads-u-margin-bottom--0">
            U.S. Department of Veterans Affairs
            <br />
            Debt Management Center
            <br />
            PO Box 11930
            <br />
            St. Paul, MN 55111
          </p>
        </va-accordion-item>
      </va-accordion>
    </section>
  );
};

HowDoIDispute.propTypes = {};

export default HowDoIDispute;
