import React from 'react';

const DependentSupportDescription = (
  <>
    <p>
      Next, we’ll ask about any financial support you provide to your dependent.
    </p>
    <va-additional-info
      trigger="What we consider dependent financial support"
      class="vads-u-margin-bottom--4 hydrated"
      uswds
    >
      <div>
        <p className="vads-u-margin-top--0">
          We consider any payments, even if they aren’t regular or the same
          amount, to be financial support.
        </p>
        <p className="vads-u-font-weight--bold">
          Financial support includes payments for these types of expenses:
        </p>
        <ul className="vads-u-margin-bottom--0">
          <li>Tuition or medical bills</li>
          <li>Monthly child support</li>
          <li>One-time payment financial support</li>
        </ul>
      </div>
    </va-additional-info>
  </>
);

export default DependentSupportDescription;
