import React from 'react';
import MainContentSubSection from '../../HubRail/shared/mainContentSubSection';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';
import LiSpanAndVaLink from '../../HubRail/shared/liSpanAndVaLink';

const OtherResources = () => {
  return (
    <div>
      <section>
        <div className="va-h-ruled--stars" />
      </section>
      <h2 id="other-resources-for-schools">Other resources for schools</h2>
      <va-accordion uswds>
        <va-accordion-item
          level="3"
          header="Enrollment Manager"
          subheader="Access Enrollment Manager  and essential training for VA student enrollment certifications and compliance."
        >
          <h4>Access Enrollment Manager</h4>
          <ul className="vads-u-margin-left--neg2p5">
            <LiSpanAndVaLink
              hrefText="Launch VA Education Platform Portal"
              class="hydrated"
              href="https://iam.education.va.gov/auth/realms/dgib/protocol/openid-connect/auth?response_type=code&amp;scope=openid+profile+email&amp;client_id=apigw&amp;redirect_uri=https://iam.education.va.gov:443/_codexch&amp;nonce=GtVNXpMNDc0rQreRf8kTvzlqvDM-zVIsBcz4n2gCn-E&amp;state=0"
            />
          </ul>
          <h4>User guides and essential information</h4>
          <ul className="vads-u-margin-left--neg2p5">
            <LiSpanAndVaLink
              hrefText="Enrollment Manager User Guide"
              href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000298609/EM-User-Guide"
            />
            <LiSpanAndVaLink
              hrefText="Enrollment Manager FAQs"
              class="hydrated"
              href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000300540/Enrollment-Manager-Frequently-Asked-Questions"
            />
          </ul>
          <h4>Quick Start Guides</h4>
          <ul className="vads-u-margin-left--neg2p5">
            <LiSpanAndVaLink
              hrefText="Download Flight - Enrollment Manager Quick Start Guide (PDF, 4 pages)"
              href="https://benefits.va.gov/gibill/docs/guides/flight-quick-start-guide.pdf"
            />
            <LiSpanAndVaLink
              hrefText="Download Institutions of Higher Learning - Enrollment Manager Quick Start Guide (PDF, 3 pages)"
              href="https://benefits.va.gov/gibill/docs/guides/ihl-quick-start-guide.pdf"
            />
            <LiSpanAndVaLink
              hrefText="Download Non-College Degree Programs - Enrollment Manager Quick Start Guide (PDF, 3 pages)"
              href="https://benefits.va.gov/gibill/docs/guides/ncd-quick-start-guide.pdf"
            />
            <LiSpanAndVaLink
              hrefText="Download On-The-Job Training/Apprenticeship - Enrollment Manager Quick Start Guide (PDF, 4 pages)"
              href="https://benefits.va.gov/gibill/docs/guides/ojtapp-quick-start-guide.pdf"
            />
          </ul>
          <h4>Updates</h4>
          <ul className="vads-u-margin-left--neg2p5">
            <LiSpanAndVaLink
              hrefText="Enrollment Manager System Updates"
              href="https://benefits.va.gov/GIBILL/enrollment-manager/enrollment-manager-system-updates.asp"
            />
            <LiSpanAndVaLink
              hrefText="Download VA Paper-Based Forms to Enrollment Manager Crosswalk (PPTX, 124 pages)"
              href="https://benefits.va.gov/GIBILL/enrollment-manager/paper-based-enrollment-manager-crosswalk.pptx"
            />
          </ul>
        </va-accordion-item>
        <va-accordion-item
          level="3"
          header="New SCO Toolkit"
          subheader="A step-by-step onboarding guide for newly designated School Certifying Officials (SCOs). This toolkit includes guidance on training requirements, designation as a certifying official, access to VA systems, enrollment certification, compliance, and helpful resources."
        >
          <ul className="vads-u-margin-left--neg2p5">
            <LiSpanAndVaLink
              hrefText="New SCO Toolkit"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/new-sco-toolkit.asp"
            />
            <LiSpanAndVaLink
              hrefText="Getting Started as an SCO"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/getting-started.asp"
            />
            <LiSpanAndVaLink
              hrefText="Role of the SCO"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/role-of-the-sco.asp"
            />
            <LiSpanAndVaLink
              hrefText="Required Training"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/required-training.asp"
            />
            <LiSpanAndVaLink
              hrefText="Gaining Access to Enrollment Manager"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/gaining-access-to-enrollment-manager.asp"
            />
            <LiSpanAndVaLink
              hrefText="Certification Basics"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/certification-basics.asp"
            />
            <LiSpanAndVaLink
              hrefText="SCO Responsibilities to the SAA"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/sco-responsibilities-to-the-saa.asp"
            />
            <LiSpanAndVaLink
              hrefText="Compliance and Reporting"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/compliance-and-reporting.asp"
            />
            <LiSpanAndVaLink
              hrefText="Common Mistakes to Avoid"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/common-mistakes-to-avoid.asp"
            />
            <LiSpanAndVaLink
              hrefText="Resources and Support"
              href="https://benefits.va.gov/GIBILL/SCO/new-sco/resources-and-support.asp"
            />
          </ul>
        </va-accordion-item>
        <va-accordion-item
          level="3"
          header="Payment and debt"
          subheader="Find information about managing debt related to VA education benefits."
        >
          <ul className="vads-u-margin-left--neg2p5">
            <LiSpanAndVaLink
              hrefText="GI Bill overpayments and debt"
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
          level="3"
          header="Veteran Readiness and Employment (VR&E) Chapter 31"
          subheader="The Veteran Readiness and Employment program assists Veterans with service-connected disabilities to explore employment options and address education and/or training needs."
        >
          <h4>For schools</h4>
          <ul className="vads-u-margin-left--neg2p5">
            <LiSpanAndVaLink
              hrefText="VR&amp;E School Certifying Official Handbook"
              href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000260798/VRE-School-Certifying-Official-Handbook"
            />
            <LiSpanAndVaLink
              hrefText="Login to Tungsten"
              href="https://authentication.tungsten-network.com/login"
            />
            <LiSpanAndVaLink
              hrefText="Download VR&amp;E Tungsten invoicing (PDF, 14 pages)"
              href="https://www.benefits.va.gov/GIBILL/docs/job_aids/VRE_Tungsten_Invoicing.pdf"
            />
            <LiSpanAndVaLink
              hrefText="VR&amp;E Tungsten customer campaign"
              href="https://www.tungsten-network.com/customer-campaigns/vre/"
            />
          </ul>
          <h4>Resources to share with students</h4>
          <ul className="vads-u-margin-left--neg2p5">
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
            <LiSpanAndVaLink
              hrefText="VetSuccess on Campus (VSOC)"
              href="https://www.benefits.va.gov/vocrehab/vsoc.asp"
            />
          </ul>
        </va-accordion-item>
        <va-accordion-item
          level="3"
          header="85/15"
          subheader="Information on the 85 percent rule, or 85/15 rule, which requires that at least 15 percent of students enrolled in an approved program are self-supported."
        >
          <ul className="vads-u-margin-left--neg2p5">
            <LiSpanAndVaLink
              hrefText="The 85/15 rule"
              href="https://benefits.va.gov/GIBILL/85_15/85_15_homepage.asp"
            />
            <LiSpanAndVaLink
              hrefText="Reporting requirements"
              href="https://benefits.va.gov/GIBILL/85_15/Reporting_Requirements.asp"
            />
            <LiSpanAndVaLink
              hrefText="35 Percent Exemption"
              href="https://benefits.va.gov/GIBILL/85_15/35_percent_exemption.asp"
            />
            <LiSpanAndVaLink
              hrefText="Department of Defense Exemption"
              href="https://benefits.va.gov/GIBILL/85_15/dod_exemption.asp"
            />
            <LiSpanAndVaLink
              hrefText="Education Service Waiver"
              href="https://benefits.va.gov/GIBILL/85_15/education_service_waiver.asp"
            />
            <LiSpanAndVaLink
              hrefText="Supported and non-supported students"
              href="https://benefits.va.gov/GIBILL/85_15/supported_non_supported_students.asp"
            />
            <LiSpanAndVaLink
              hrefText="Suspension and review"
              href="https://benefits.va.gov/GIBILL/85_15/Suspension_and_Review.asp"
            />
            <LiSpanAndVaLink
              hrefText="85/15 FAQs"
              href="https://benefits.va.gov/gibill/85_15_faqs.asp"
            />
            <LiSpanAndVaLink
              hrefText="85/15 and Approved Rule 56"
              href="https://benefits.va.gov/GIBILL/85_15/85-15-ar-56.asp"
            />
            <LiSpanAndVaLink
              hrefText="85/15 Webpage Archives "
              href="https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000291680/8515-Webpage-Archives"
            />
          </ul>
        </va-accordion-item>
      </va-accordion>
      <MainContentSubSection
        id="understanding-veteran-education"
        header="Understanding Veteran education benefits"
      >
        <LiSpanAndVaLinkAndPTag
          href="https://www.va.gov/education/about-gi-bill-benefits/"
          hrefText="About GI Bill benefits"
          pText="Learn how the GI Bill works and explore options Veterans have to pay for school or training."
        />
        <LiSpanAndVaLinkAndPTag
          href="https://www.va.gov/education/gi-bill-comparison-tool/"
          hrefText="GI Bill Comparison Tool"
          pText="Compare and calculate GI Bill benefits at VA-approved schools."
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
        <LiSpanAndVaLinkAndPTag
          href="https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/"
          hrefText="How to use GI Bill benefits"
          pText="Learn how students may use their GI Bill benefits to advance their education and training."
        />
        <LiSpanAndVaLinkAndPTag
          href="https://benefits.va.gov/GIBILL/workstudy-site-supervisor-guidance.asp"
          hrefText="Work Study Site Supervisor Guidance"
          pText="Learn how to administer the VA work study program at your site."
        />
      </MainContentSubSection>
    </div>
  );
};

export default OtherResources;
