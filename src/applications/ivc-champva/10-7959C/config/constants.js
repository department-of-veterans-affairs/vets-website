import React from 'react';

/* List of required files - not enforced by the form because we want
users to be able to opt into mailing these documents. This object 
performs double duty by also providing a map to presentable names. */
export const requiredFiles = {
  applicantMedicareIneligibleProof: 'Proof of Medicare Ineligibility',
  applicantMedicarePartAPartBCard: 'Medicare Parts A and B card',
  applicantMedicarePartDCard: 'Medicare Part D card',
  primaryInsuranceCard: 'Primary health insurance card',
  secondaryInsuranceCard: 'Secondary health insurance card',
  primaryInsuranceScheduleOfBenefits:
    'Primary health insurance schedule of benefits document',
  secondaryInsuranceScheduleOfBenefits:
    'Secondary health insurance schedule of benefits document',
};

export const office = 'Chief Business Office Purchased Care';
export const officeAddress = (
  <>
    {office}
    <br />
    P.O. Box 469063
    <br />
    Denver, CO 80246-9063
    <br />
    United States of America
  </>
);
export const officeFaxNum = '3033317808';
