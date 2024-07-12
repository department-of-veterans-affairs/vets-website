import React from 'react';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import MainContentSubSection from '../../HubRail/shared/mainContentSubSection';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';

const OtherResources = () => {
  return (
    <MainContentSubDiv
      id="other-resources-for-schools"
      header="Other resources for schools"
    >
      <va-accordion uswds>
        <va-accordion-item
          header="Enrollment Manager"
          subheader="Access Enrollment Manager  and essential training for VA student enrollment certifications and compliance."
        >
          <p>
            Congress shall make no law respecting an establishment of religion,
            or prohibiting the free exercise thereof; or abridging the freedom
            of speech, or of the press; or the right of the people peaceably to
            assemble, and to petition the Government for a redress of
            grievances.
          </p>
        </va-accordion-item>
        <va-accordion-item
          header="Payment and debt"
          subheader="Find information about managing debt related to VA education benefits."
        >
          <p>
            A well regulated Militia, being necessary to the security of a free
            State, the right of the people to keep and bear Arms, shall not be
            infringed.
          </p>
        </va-accordion-item>
        <va-accordion-item
          header="Veteran Readiness and Employment (VR&E) Chapter 31"
          subheader="The Veteran Readiness and Employment program assists Veterans with service-connected disabilities to explore employment options and address education and/or training needs."
        >
          <p>
            No Soldier shall, in time of peace be quartered in any house,
            without the consent of the Owner, nor in time of war, but in a
            manner to be prescribed by law.
          </p>
        </va-accordion-item>
        <va-accordion-item
          header="85/15"
          subheader="Information on the 85 percent rule, or 85/15 rule, which requires that at least 15 percent of students enrolled in an approved program are self-supported."
        >
          <p>
            No Soldier shall, in time of peace be quartered in any house,
            without the consent of the Owner, nor in time of war, but in a
            manner to be prescribed by law.
          </p>
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
