import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import HowDoIDispute from './HowDoIDispute';

const HowDoIGetHelp = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const disputeDebtActive = useToggleValue(TOGGLE_NAMES.disputeDebt);

  return (
    <>
      <section>
        <h2
          id="howDoIGetHelp"
          className="vads-u-margin-top--4 vads-u-margin-bottom--0"
        >
          How to get financial help
        </h2>

        <p>You can request these relief options:</p>
        <ul>
          <li>
            <strong>Repayment plan.</strong> This would allow you to repay the
            debt in smaller monthly amounts over time.
          </li>
          <li>
            <strong>Compromise offer.</strong> This means you offer a lesser
            one-time lump sum amount as full payment of the debt. If we approve
            your request, you’ll have to pay the one-time amount within 30 days.
          </li>
          <li>
            <strong>Waiver.</strong> This means you ask us to forgive (or
            “waive”) part or all of the debt. If we approve your request, you
            won’t have to pay the amount waived.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> The time limit to request a waiver (debt
          forgiveness) is 1 year from the date you received your first debt
          letter.
        </p>
        <va-link-action
          href="/manage-va-debt/request-debt-help-form-5655/"
          message-aria-describedby="Opens pay.va.gov"
          text="Request help with this overpayment"
          type="secondary"
        />
      </section>
      {disputeDebtActive && <HowDoIDispute />}
    </>
  );
};

export default HowDoIGetHelp;
