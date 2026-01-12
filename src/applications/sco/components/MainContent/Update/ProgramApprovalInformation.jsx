import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';

const ProgramApprovalInformation = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const form10275Toggle = useToggleValue(TOGGLE_NAMES.form10275Release);

  return (
    <MainContentSubDiv
      id="program-approval-information"
      header="Program approval information"
    >
      <li>
        <va-link
          href="https://www.va.gov/education/gi-bill-comparison-tool/schools-and-employers"
          text="GI Bill® Comparison Tool"
        />
        <p className="vads-u-margin-top--0">
          Use the GI Bill® Comparison Tool to identify educational institutions
          offering programs approved for Veterans’ training.
        </p>
      </li>
      <li>
        <va-link
          href="https://www.va.gov/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses"
          text="Licensing & certification tests and test preparatory courses"
        />
        <p className="vads-u-margin-top--0">
          Search GI Bill® Comparison Tool for approved licensing & certification
          tests, and related test preparatory courses.
        </p>
      </li>
      <li>
        <va-link
          href="https://www.va.gov/education/gi-bill-comparison-tool/national-exams"
          text="National Exams"
        />
        <p className="vads-u-margin-top--0">
          Search GI Bill® Comparison Tool to identify approved National Exams
          such as ACT, CLEP, MCAT, and more.
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
        href="https://benefits.va.gov/gibill/valor.asp"
        hrefText="VALOR ACT Approvals"
        pText="Discover essential information and answers to common questions about the Veterans Apprenticeship and Labor Opportunity Reform (VALOR) Act program."
      />
      {form10275Toggle ? (
        <li>
          <va-link
            href="https://benefits.va.gov/gibill/principles-of-excellence.asp"
            text="Principles of Excellence"
          />
          <p className="vads-u-margin-top--0">
            Understand the guidelines required by schools receiving federal
            funding through the GI Bill.{' '}
            <va-link
              data-testid="form-10275-link"
              href="https://www.va.gov/school-administrators/commit-principles-of-excellence-form-22-10275"
              text="Commit to the Principles of Excellence for educational institutions"
            />
          </p>
        </li>
      ) : (
        <LiSpanAndVaLinkAndPTag
          href="https://benefits.va.gov/gibill/principles-of-excellence.asp"
          hrefText="Principles of Excellence"
          pText="Understand the guidelines required by schools receiving federal funding through the GI Bill."
        />
      )}
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
