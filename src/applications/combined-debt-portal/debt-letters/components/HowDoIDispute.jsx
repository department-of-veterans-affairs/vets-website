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
        you can avoid collection actions.
      </p>
      <p>
        You’ll need to continue making payments on your debt while we review
        your dispute.{' '}
      </p>
      <va-link-action
        href="/manage-va-debt/dispute-debt/"
        message-aria-describedby="Opens pay.va.gov"
        text="Dispute an overpayment online"
        type="secondary"
      />
    </section>
  );
};

HowDoIDispute.propTypes = {};

export default HowDoIDispute;
