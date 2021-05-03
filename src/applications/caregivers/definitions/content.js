import React from 'react';

export const links = {
  findLocations: {
    label: 'Find locations with our facility locator tool',
    link: 'https://www.va.gov/find-locations',
  },
  caregiverSupportCoordinators: {
    link: 'https://www.caregiver.va.gov/support/New_CSC_Page.asp',
    label: 'Find a caregiver support coordinator near you.',
  },
  caregiverHelp: {
    link: 'https://www.caregiver.va.gov/help_landing.asp',
    label: 'Get help filing your claim.',
  },
  caregiverHelpPage: {
    link: 'https://www.caregiver.va.gov/',
    label: 'www.va.caregiver.gov',
  },
  applyVAHealthCare: {
    link: 'https://www.va.gov/health-care/how-to-apply/',
    label: 'Application for Health Benefits',
  },
  privacyPolicy: {
    link: 'https://www.va.gov/privacy-policy/',
  },
};

export const veteranSignatureContent = [
  'I certify that I give consent to the individual(s) named in this application to perform personal care services for me upon being approved as Primary and/or Secondary Family Caregivers in the Program of Comprehensive Assistance for Family Caregivers.',
];

export const primaryCaregiverContent = [
  'I certify that I am at least 18 years of age.',
  "I certify that I am a family member of the Veteran named in this application or I reside with the Veteran, or will do so upon designation as the Veteran's Primary Family Caregiver.",
  'I agree to perform personal care services as the Primary Family Caregiver for the Veteran named on this application.',
  'I understand that the Veteran or Veteran’s surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time. I understand that my designation as a Primary Family Caregiver may be revoked or I may be discharged from the program by the Secretary of Veterans Affairs or his designee, as set forth in 38 CFR 71.45.',
  'I understand that participation in Program of Comprehensive Assistance for Family Caregivers does not create an employment relationship between me and the Department of Veterans Affairs.',
];
export const secondaryCaregiverContent = [
  'I certify that I am at least 18 years of age.',
  "I certify that I am a family member of the Veteran named in this application or I reside with the Veteran, or will do so upon designation as the Veteran's Secondary Family Caregiver.",
  'I agree to perform personal care services as the Secondary Family Caregiver for the Veteran named on this application.',
  'I understand that the Veteran or Veteran’s surrogate may request my discharge from the Program of Comprehensive Assistance for Family Caregivers (PCAFC) at any time. I understand that my designation as a Secondary Family Caregiver may be revoked or I may be discharged from the program by the Secretary of Veterans Affairs or his designee, as set forth in 38 CFR 71.45.',
  'I understand that participation in Program of Comprehensive Assistance for Family Caregivers does not create an employment relationship between me and the Department of Veterans Affairs.',
];

export const representativeSignatureContent = [
  'Signed by the Veteran’s legal representative on behalf of the Veteran.',
  'I certify that I give consent to the individual(s) named in this application to perform personal care services for me (or if the Veteran’s Representative, the Veteran) upon being approved as a Primary and/or Secondary Family Caregiver(s) in the Program of Comprehensive Assistance for Family Caregivers.',
];

export const signatureBoxNoteContent =
  'According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or providing incorrect information. (See 18 U.S.C. 1001)';

export const veteranLabel = `Veteran\u2019s`;
export const primaryLabel = `Primary Family Caregiver applicant\u2019s`;
export const representativeLabel = `Representative\u2019s`;
export const secondaryOneLabel = `Secondary Family Caregiver applicant\u2019s`;
export const secondaryTwoLabel = `Secondary Family Caregiver (2) applicant\u2019s`;

export const PrivacyPolicy = () => (
  <p>
    I have read and accept the
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="vads-u-margin-left--0p5"
      href={links.privacyPolicy.link}
    >
      privacy policy
    </a>
    .
  </p>
);

export const SecondaryCaregiverCopy = ({ label }) => {
  const header = title => `${title} statement of truth`;
  const firstParagraph = secondaryCaregiverContent[0];
  const contentWithoutFirstParagraph = secondaryCaregiverContent.slice(1);

  return (
    <div>
      <h3 className="vads-u-margin-top--4">{header(label)}</h3>

      <p className="vads-u-margin-y--4">{firstParagraph}</p>

      {contentWithoutFirstParagraph.map((secondaryContent, idx) => {
        return <p key={`${label}-${idx}`}>{secondaryContent}</p>;
      })}
      <PrivacyPolicy />
    </div>
  );
};
