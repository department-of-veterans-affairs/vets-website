import React from 'react';

const MedicareClaimNumberDescription = (
  <>
    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-top--3 vads-u-margin-bottom--4"
      uswds
    >
      <div>
        <p className="vads-u-margin-top--0">
          We use your Medicare claim number to keep track of the health care
          services that Medicare covers. We use your claim number when we need
          to create a Medicare explanation of benefits.
        </p>
        <p>
          We don’t bill Medicare for any services. By law, Medicare can’t pay
          for our services. But this explanation shows what Medicare would have
          paid for services if they could.
        </p>
        <p>
          We may need to bill Medicare supplemental insurance or a private
          insurance provider for certain services. And some providers must have
          this explanation before they’ll pay the bill.
        </p>
        <p className="vads-u-margin-bottom--0">
          <strong>Note:</strong> Having Medicare or other health insurance
          doesn’t affect the VA health care benefits you can get. And you won’t
          have to pay any unpaid balance that a health insurance provider
          doesn’t cover.
        </p>
      </div>
    </va-additional-info>
  </>
);

export default MedicareClaimNumberDescription;
