import React from 'react';

const PrimaryCaregiverIntro = (
  <>
    <p>
      You can use this application to apply for benefits for a Primary Family
      Caregiver.
    </p>
    <p>
      <strong>Note:</strong> There can only be 1 Primary Caregiver at any one
      time.
    </p>

    <va-additional-info
      trigger="Learn more about who qualifies as a Primary Family Caregiver"
      class="vads-u-margin-y--2p5"
    >
      <div>
        <p className="vads-u-margin-top--0">
          Family caregivers are approved and designated by VA as Primary Family
          Caregivers and Secondary Family Caregivers to provide personal care
          services. A Primary Family Caregiver is the main caregiver for the
          eligible Veteran.
        </p>

        <p>A caregiver can have one of these relationships to the Veteran:</p>

        <ul className="vads-u-margin-bottom--0">
          <li>Parent</li>
          <li>Spouse</li>
          <li>Son or daughter</li>
          <li>Stepfamily member</li>
          <li>Grandchild</li>
          <li>Significant other</li>
          <li>Friend or neighbor</li>
          <li>Other relative</li>
        </ul>
      </div>
    </va-additional-info>
  </>
);

export default PrimaryCaregiverIntro;
