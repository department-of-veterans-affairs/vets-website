import React from 'react';

const SecondaryCaregiverCopy = ({ label }) => {
  const header = title => `${title} Statement of Truth`;
  return (
    <div>
      <h3 className="vads-u-margin-top--4">{header(label)}</h3>

      <p className="vads-u-margin-y--4">
        I certify that I am at least 18 years of age.
      </p>

      <p>
        I certify that I am a family member of the Veteran named in this
        application or I reside with the Veteran, or will do so upon designation
        as the Veteran's Secondary Family Caregiver.
      </p>

      <p>
        I agree to perform personal care services as the Secondary Family
        Caregiver for the Veteran named on this application.
      </p>

      <p>
        I understand that the Veteran or Veteran’s surrogate may request my
        discharge from the Program of Comprehensive Assistance for Family
        Caregivers (PCAFC) at any time. I understand that my designation as a
        Secondary Family Caregiver may be revoked or I may be discharged from
        the program by the Secretary of Veterans Affairs or his designee, as set
        forth in 38 CFR 71.45.
      </p>

      <p>
        I understand that participation in the Program of Comprehensive
        Assistance for Family Caregivers does not create an employment
        relationship with the Department of Veterans Affairs.
      </p>
    </div>
  );
};

export default SecondaryCaregiverCopy;
