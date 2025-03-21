import React from 'react';

/* List of required files - not enforced by the form because we want
users to be able to opt into mailing these documents. This object 
performs double duty by also providing a map to presentable names. */
export const requiredFiles = {
  applicantMedicareIneligibleProof: 'Proof of Medicare Ineligibility',
  applicantMedicarePartAPartBCardFront: 'Front of Medicare card',
  applicantMedicarePartAPartBCardBack: 'Back of Medicare card',
  applicantMedicarePartDCard: 'Medicare Part D card',
  // Note: The text 'Primary health insurance' and 'Secondary health insurance'
  // are replaced via regex in `MissingFileConsentPage > prefixFileNames()`
  primaryInsuranceCard: 'Primary health insurance card',
  secondaryInsuranceCard: 'Secondary health insurance card',
  primaryInsuranceScheduleOfBenefits:
    'Primary health insurance schedule of benefits document',
  secondaryInsuranceScheduleOfBenefits:
    'Secondary health insurance schedule of benefits document',
};

export const office = 'VHA Office of Integrated Veteran Care';
export const officeAddress = (
  <>
    {office}
    <br />
    ChampVA Eligibility
    <br />
    P.O. Box 137
    <br />
    Spring City, PA 19475
    <br />
    United States of America
  </>
);
export const officeFaxNum = '3033317807';
