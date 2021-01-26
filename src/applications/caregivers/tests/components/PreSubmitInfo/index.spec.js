import { expect } from 'chai';

import {
  veteranSignatureContent,
  primaryCaregiverContent,
  secondaryCaregiverContent,
} from 'applications/caregivers/definitions/content';

describe('SignatureBox content', () => {
  it('veteranSignatureContent has not changed', () => {
    const mockVeteranSignatureContent = [
      'I certify that I give consent to the individual(s) named in this application to perform personal care services for me upon being approved as Primary and/or Secondary Family Caregivers in the Program of Comprehensive Assistance for Family Caregivers.',
    ];

    expect(mockVeteranSignatureContent).to.deep.equal(veteranSignatureContent);
  });

  it('veteranSignatureContent has not changed', () => {
    const mockPrimaryCaregiverContent = [
      'I certify that I am at least 18 years of age.',
      "I certify that I am a family member of the Veteran named in this application or I reside with the Veteran, or will do so upon designation as the Veteran's Primary Family Caregiver.",
      'I agree to perform personal care services as the Primary Family Caregiver for the Veteran named on this application.',
      'I understand that the Veteran or Veteran’s surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time. I understand that my designation as a Primary Family Caregiver may be revoked or I may be discharged from the program by the Secretary of Veterans Affairs or his designee, as set forth in 38 CFR 71.45.',
      'I understand that participation in Program of Comprehensive Assistance for Family Caregivers does not create an employment relationship between me and the Department of Veterans Affairs.',
    ];

    expect(mockPrimaryCaregiverContent).to.deep.equal(primaryCaregiverContent);
  });

  it('veteranSignatureContent has not changed', () => {
    const mockSecondaryCaregiverContent = [
      'I certify that I am at least 18 years of age.',
      "I certify that I am a family member of the Veteran named in this application or I reside with the Veteran, or will do so upon designation as the Veteran's Secondary Family Caregiver.",
      'I agree to perform personal care services as the Secondary Family Caregiver for the Veteran named on this application.',
      'I understand that the Veteran or Veteran’s surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time. I understand that my designation as a Secondary Family Caregiver may be revoked or I may be discharged from the program by the Secretary of Veterans Affairs or his designee, as set forth in 38 CFR 71.45.',
      'I understand that participation in Program of Comprehensive Assistance for Family Caregivers does not create an employment relationship between me and the Department of Veterans Affairs.',
    ];

    expect(mockSecondaryCaregiverContent).to.deep.equal(
      secondaryCaregiverContent,
    );
  });
});
