import React from 'react';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import MainContentSubSection from '../../HubRail/shared/mainContentSubSection';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';
import LiSpanAndVaLink from '../../HubRail/shared/liSpanAndVaLink';

const OtherResources = () => {
  return (
    <MainContentSubDiv
      id="other-resources-for-schools"
      header="Other resources for schools"
    >
      <va-accordion uswds>
        <va-accordion-item
          open
          header="Enrollment Manager"
          subheader="Access Enrollment Manager  and essential training for VA student enrollment certifications and compliance."
        >
          Access Enrollment Manager
          <ul>
            <LiSpanAndVaLink
              hrefText="Launch VA Education Platform Portal"
              class="hydrated"
              href="https://iam.education.va.gov/auth/realms/dgib/protocol/openid-connect/auth?response_type=code&amp;scope=openid+profile+email&amp;client_id=apigw&amp;redirect_uri=https://iam.education.va.gov:443/_codexch&amp;nonce=GtVNXpMNDc0rQreRf8kTvzlqvDM-zVIsBcz4n2gCn-E&amp;state=0"
            />
          </ul>
          User guides and essential information
          <ul>
            <LiSpanAndVaLink
              hrefText="Enrollment Manager User Guide (PPTX, 315 pages)"
              href="https://benefits.va.gov/gibill/enrollment-manager/enrollment-manager-sco-user-guide.pptx"
            />
            <LiSpanAndVaLink
              hrefText="Enrollment Manager FAQs"
              class="hydrated"
              href="https://benefits.va.gov/gibill/enrollment-manager/enrollment-manager-frequently-asked-questions.asp"
            />
          </ul>
          Quick Start Guides
          <ul>
            <LiSpanAndVaLink
              hrefText="Flight - Enrollment Manager Quick Start Guide (PDF, 4 pages)"
              href="https://benefits.va.gov/gibill/docs/guides/flight-quick-start-guide.pdf"
            />
            <LiSpanAndVaLink
              hrefText="Institutions of Higher Learning - Enrollment Manager Quick Start Guide (PDF, 3 pages)"
              href="https://benefits.va.gov/gibill/docs/guides/ihl-quick-start-guide.pdf"
            />
            <LiSpanAndVaLink
              hrefText="Non-College Degree Programs - Enrollment Manager Quick Start Guide (PDF, 3 pages)"
              href="https://benefits.va.gov/gibill/docs/guides/ncd-quick-start-guide.pdf"
            />
            <LiSpanAndVaLink
              hrefText="On-the-Job Training/Apprenticeship - Enrollment Manager Quick Start Guide (PDF, 4 pages)"
              href="https://benefits.va.gov/gibill/docs/guides/ojtapp-quick-start-guide.pdf"
            />
          </ul>
          Updates
          <ul>
            <LiSpanAndVaLink
              hrefText="Enrollment Manager System Updates"
              href="https://benefits.va.gov/GIBILL/enrollment-manager/enrollment-manager-system-updates.asp"
            />
            <LiSpanAndVaLink
              hrefText="VA Paper Based Forms to Enrollment Manager Crosswalk (PPTX, 124 pages)"
              href="https://benefits.va.gov/GIBILL/enrollment-manager/paper-based-enrollment-manager-crosswalk.pptx"
            />
          </ul>
        </va-accordion-item>
        <va-accordion-item
          open
          header="Payment and debt"
          subheader="Find information about managing debt related to VA education benefits."
        >
          <ul>
            <LiSpanAndVaLink
              hrefText="GI Bill Overpayments and Debt"
              href="https://www.benefits.va.gov/gibill/resources/education_resources/debt_info.asp"
            />
            <LiSpanAndVaLink
              hrefText="VA Debt Management Center"
              href="https://www.va.gov/resources/va-debt-management/"
            />
            <LiSpanAndVaLink
              hrefText="Treasury Offset Program (TOP)"
              href="https://www.fiscal.treasury.gov/TOP/"
            />
          </ul>
        </va-accordion-item>
        <va-accordion-item
          open
          header="Veteran Readiness and Employment (VR&E) Chapter 31"
          subheader="The Veteran Readiness and Employment program assists Veterans with service-connected disabilities to explore employment options and address education and/or training needs."
        >
          For schools
          <ul>
            <LiSpanAndVaLink
              hrefText="VR&amp;E School Certifying Official Handbook"
              href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000260919/VRE-School-Certifying-Official-Handbook"
            />
            <LiSpanAndVaLink
              hrefText="Login to Tungsten"
              href="https://authentication.tungsten-network.com/login"
            />
            <LiSpanAndVaLink
              hrefText="VR&amp;E Tungsten Invoicing (PDF, 14 pages)"
              href="https://www.benefits.va.gov/GIBILL/docs/job_aids/VRE_Tungsten_Invoicing.pdf"
            />
            <LiSpanAndVaLink
              hrefText="VR&amp;E Tungsten Customer Campaign"
              href="https://www.tungsten-network.com/customer-campaigns/vre/"
            />
          </ul>
          Resources to share with students
          <ul>
            <LiSpanAndVaLink
              hrefText="Veteran Readiness and Employment (Chapter 31)"
              href="https://www.va.gov/careers-employment/vocational-rehabilitation/"
            />
            <LiSpanAndVaLink
              hrefText="Eligibility for VR&amp;E"
              href="https://www.va.gov/careers-employment/vocational-rehabilitation/eligibility/"
            />
            <LiSpanAndVaLink
              hrefText="How to apply for VR&amp;E"
              href="https://www.va.gov/careers-employment/vocational-rehabilitation/how-to-apply/"
            />
          </ul>
        </va-accordion-item>
        <va-accordion-item
          open
          header="85/15"
          subheader="Information on the 85 percent rule, or 85/15 rule, which requires that at least 15 percent of students enrolled in an approved program are self-supported."
        >
          <ul>
            <LiSpanAndVaLink
              hrefText="The 85/15 Rule"
              href="https://benefits.va.gov/GIBILL/85_15/85_15_homepage.asp"
            />
            <LiSpanAndVaLink
              hrefText="Reporting Requirements"
              href="https://benefits.va.gov/GIBILL/85_15/Reporting_Requirements.asp"
            />
            <LiSpanAndVaLink
              hrefText="35 Percent Exemption"
              href="https://benefits.va.gov/GIBILL/85_15/35_percent_exemption.asp"
            />
            <LiSpanAndVaLink
              hrefText="Department of Defense (DoD) Exemption"
              href="https://benefits.va.gov/GIBILL/85_15/dod_exemption.asp"
            />
            <LiSpanAndVaLink
              hrefText="Education Service Waiver"
              href="https://benefits.va.gov/GIBILL/85_15/education_service_waiver.asp"
            />
            <LiSpanAndVaLink
              hrefText="Supported and Non-Supported Students"
              href="https://benefits.va.gov/GIBILL/85_15/supported_non_supported_students.asp"
            />
            <LiSpanAndVaLink
              hrefText="Restricted Aid"
              href="https://benefits.va.gov/GIBILL/85_15/restricted_aid.asp"
            />
            <LiSpanAndVaLink
              hrefText="Suspension and Review"
              href="https://benefits.va.gov/GIBILL/85_15/Suspension_and_Review.asp"
            />
            <LiSpanAndVaLink
              hrefText="85/15 FAQs"
              href="https://benefits.va.gov/gibill/85_15_faqs.asp"
            />
          </ul>
        </va-accordion-item>
      </va-accordion>
      <MainContentSubSection
        id="understanding-veteran-educatio"
        header="Understanding Veteran education benefits"
      >
        <LiSpanAndVaLinkAndPTag
          href="https://www.va.gov/education/about-gi-bill-benefits/"
          hrefText="About GI Bill Benefits"
          pText="Learn how the GI Bill works and explore options Veterans have to pay for school or training."
        />
        <LiSpanAndVaLinkAndPTag
          href="https://www.va.gov/education/gi-bill-comparison-tool/"
          hrefText="GI Bill Comparison Tool"
          pText="Compare and calculate GI Bill benefits at VA approved schools."
        />
        <LiSpanAndVaLinkAndPTag
          href="https://www.va.gov/education/benefit-rates/"
          hrefText="Current VA education benefit rates"
          pText="Check program rate tables and determine how much of the full benefit rate Veterans can receive."
        />
        <LiSpanAndVaLinkAndPTag
          href="https://www.va.gov/education/other-va-education-benefits/"
          hrefText="Other VA education benefits"
          pText="Explore additional GI Bill benefits and alternative programs for Veterans, National Guard, and Reserve members ineligible for the Post-9/11 GI Bill."
        />
      </MainContentSubSection>
    </MainContentSubDiv>
  );
};

export default OtherResources;