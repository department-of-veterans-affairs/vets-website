import React from 'react';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';

const ScoHandbooks = () => {
  return (
    <MainContentSubDiv id="handbooks" header="Handbooks">
      <LiSpanAndVaLinkAndPTag
        href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000149088/School-Certifying-Official-Handbook-On-line"
        hrefText="School Certifying Official Handbook"
        pText="Access the School Certifying Official Handbook online."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000208001/Employers-Certification-Handbook-On-The-Job-Training-Apprenticeship-Programs"
        hrefText="Employer’s Certification Handbook On-The-Job Training &amp; Apprenticeship Programs"
        pText="Access the employer certification handbook for on-the-job training and apprenticeship (OJT/APP) programs."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000260798/VRE-School-Certifying-Official-Handbook"
        hrefText="VR&amp;E School Certifying Official Handbook"
        pText="Access the Veteran Readiness and Employment’s Certifying Official Handbook."
      />
    </MainContentSubDiv>
  );
};

export default ScoHandbooks;
