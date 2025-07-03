import React from 'react';

const HowDoIDispute = () => {
  return (
    <div>
      <h2
        id="howDoIDispute"
        className="vads-u-margin-top--4 vads-u-margin-bottom-2"
      >
        How to dispute your VA debt
      </h2>

      <p>
        If you think your debt is an error, your first step should be to dispute
        the charges. The time limit to dispute a debt is <strong>1 year</strong>{' '}
        from the date you received your first debt letter. If you dispute the
        debt within <strong>30 days</strong>, you can avoid collection actions.
      </p>
      <p>
        You’ll need to continue making payments on your debt while we review
        your dispute.{' '}
      </p>
      <a
        className="vads-c-action-link--blue"
        href="/manage-va-debt/dispute-debt/"
      >
        Dispute an overpayment online
      </a>
    </div>
  );
};

HowDoIDispute.propTypes = {};

export default HowDoIDispute;
