import React from 'react';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';

const ProgramApprovalInformation = () => {
  return (
    <MainContentSubDiv
      id="program-approval-information"
      header="Program approval information"
    >
      <li>
        <va-link
          href="https://inquiry.vba.va.gov/weamspub/buildSearchInstitutionCriteria.do"
          text="WEAMS Institution Search"
        />
        <p className="vads-u-margin-top--0">
          Use the Web Enabled Approval Management System (WEAMS) to identify
          educational institutions offering programs approved for Veterans
          training.{' '}
          <va-link
            href="https://www.va.gov/education/gi-bill-comparison-tool/schools-and-employers"
            text="Access this information using the GI Bill® Comparison Tool"
          />
        </p>
      </li>
      <li>
        <va-link
          href="https://inquiry.vba.va.gov/weamspub/buildSearchCountryLCCriteria.do"
          text="Licenses, certifications, and prep courses"
        />
        <p className="vads-u-margin-top--0">
          Search WEAMS for approved licensing, certification and related
          preparatory courses.{' '}
          <va-link
            href="https://www.va.gov/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses"
            text="Access this information using the GI Bill® Comparison Tool"
          />
        </p>
      </li>
      <li>
        <va-link
          href="https://inquiry.vba.va.gov/weamspub/buildSearchNE.do"
          text="National exams"
        />
        <p className="vads-u-margin-top--0">
          Search WEAMS to identify approved National Exams such as ACT, CLEP,
          MCAT, and more.{' '}
          <va-link
            href="https://www.va.gov/education/gi-bill-comparison-tool/national-exams"
            text="Access this information using the GI Bill® Comparison Tool"
          />
        </p>
      </li>
      <LiSpanAndVaLinkAndPTag
        href="https://benefits.va.gov/gibill/School_Program_Approval.asp"
        hrefText="Program approvals"
        pText="Identify general approval guidelines for programs of education broken down by various types of training programs."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://www.benefits.va.gov/gibill/foreign_program_approval_information_for_schools.asp"
        hrefText="Foreign program approvals"
        pText="Identify general approval guidelines for programs of education offered at foreign institutions."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://benefits.va.gov/gibill/federalemployerOJTandApprenticeshipProgramApprovalInformation.asp"
        hrefText="Federal on-the-job training/apprenticeship approvals"
        pText="Discover the process and criteria for VA approval of on-the-job training and apprenticeship (OJT/APP) programs."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://www.va.gov/education/choosing-a-school/principles-of-excellence/"
        hrefText="Principles of Excellence"
        pText="Understand the guidelines required by schools receiving federal funding through the GI Bill."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://www.benefits.va.gov/gibill/yellow_ribbon/yellow_ribbon_info_schools.asp"
        hrefText="Yellow Ribbon Program"
        pText="Find information for schools considering initial or continued participation in the Yellow Ribbon Program."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/covered-educational-institutions.asp"
        hrefText="Covered Educational Institutions"
        pText="Educational institutions that have enrolled 20 or more individuals using educational assistance under Title 38, United States Code, during the previous calendar year."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://nasaa-vetseducation.com/nasaa-contacts/"
        hrefText="State Approving Agency contact information"
        pText="Find out how you can contact your State Approving Agency."
      />
    </MainContentSubDiv>
  );
};

export default ProgramApprovalInformation;
