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
