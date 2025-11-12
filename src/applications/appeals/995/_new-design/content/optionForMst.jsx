import React from 'react';

export const optionForMstTitle =
  'Would you like to view an option for an indicator if your claim is related to Military Sexual Trauma (MST)?';

export const optionForMstHint =
  'This option is for an indicator on your health record and will not affect the status or decision for your claim.';

export const supportInfo = (
  <va-additional-info
    trigger="How can I find support?"
    class="vads-u-margin-bottom--4"
  >
    <div>
      <p className="vads-u-margin-top--0">
        <va-link
          href="/health-care/about-va-health-benefits/"
          external
          text="Learn more about Veterans Health Administration (VHA) health care
          services"
        />
      </p>
      <p>
        To learn about VHA health care services available related to MST,
        contact a VHA MST Coordinator.
      </p>
      <p>
        <va-link
          href="https://www.mentalhealth.va.gov/msthome/vha-mst-coordinators.asp"
          external
          text="Find a VHA MST coordinator"
        />
      </p>
      <p>
        Or contact your local VA medical facility and ask to speak to a MST
        Coordinator.
      </p>
      <p className="vads-u-margin-bottom--0">
        <va-link
          href="/find-locations/"
          external
          text="Find a VA medical facility near you"
        />
      </p>
    </div>
  </va-additional-info>
);
