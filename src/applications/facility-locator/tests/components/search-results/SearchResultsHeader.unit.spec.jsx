import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SearchResultsHeader } from '../../../components/SearchResultsHeader';
import { LocationType } from '../../../constants';
import { urgentCareServices, emergencyCareServices } from '../../../config';

describe('SearchResultsHeader', () => {
  it('should not render header if context is not provided', () => {
    const wrapper = shallow(<SearchResultsHeader results={[]} />);

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results are empty and context exists', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[]}
        context="11111"
        pagination={{ totalEntries: 0 }}
      />,
    );

    expect(
      wrapper
        .find('h2')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.equal('No results found for "" near "11111"');
    wrapper.unmount();
  });

  it('should not render header if inProgress is true', () => {
    const wrapper = shallow(<SearchResultsHeader results={[{}]} inProgress />);

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results exist', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.HEALTH}
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "VA health",\s+"All VA health services"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.HEALTH for VA health service autosuggest, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        facilityType={LocationType.HEALTH}
        inProgress={false}
        pagination={{ totalEntries: 1 }}
        results={[{}]}
        serviceType={null}
        context="new york"
        vamcServiceDisplay="All VA health services"
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 result for "VA health",\s+"All VA health services"\s+near\s+"new york"/,
    );

    wrapper.unmount();
  });

  it('should render header with LocationType.HEALTH, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.HEALTH}
        serviceType="PrimaryCare"
        context="new york"
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 result for "VA health",\s+"Primary care"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.HEALTH, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.HEALTH}
        serviceType="PrimaryCare"
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "VA health",\s+"Primary care"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.HEALTH, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} // 15 results
        facilityType={LocationType.HEALTH}
        serviceType="PrimaryCare"
        context="new york"
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 11 - 15 of 15 results for "VA health",\s+"Primary care"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('with LocationType.HEALTH, null serviceType', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.HEALTH}
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "VA health",\s+"All VA health services"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.URGENT_CARE', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.URGENT_CARE}
        serviceType="NonVAUrgentCare"
        context="new york"
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      new RegExp(
        `Results for "Urgent care",\\s+"${
          urgentCareServices.NonVAUrgentCare
        }"\\s+near\\s+"new york"`,
      ),
    );
    wrapper.unmount();
  });

  it('LocationType.URGENT_CARE, null serviceType', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.URGENT_CARE}
        context="new york"
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      new RegExp(
        `Results for "Urgent care",\\s+"${
          urgentCareServices.AllUrgentCare
        }"\\s+near\\s+"new york"`,
      ),
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.EMERGENCY_CARE', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.EMERGENCY_CARE}
        serviceType="NonVAEmergencyCare"
        context="new york"
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      new RegExp(
        `Results for "Emergency Care",\\s+"${
          emergencyCareServices.NonVAEmergencyCare
        }"\\s+near\\s+"new york"`,
      ),
    );
    wrapper.unmount();
  });

  it('LocationType.EMERGENCY_CARE, null serviceType', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.EMERGENCY_CARE}
        context="new york"
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      new RegExp(
        `Results for "Emergency Care",\\s+"${
          emergencyCareServices.AllEmergencyCare
        }"\\s+near\\s+"new york"`,
      ),
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.URGENT_CARE_PHARMACIES, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.URGENT_CARE_PHARMACIES}
        context="new york"
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 result for "Community pharmacies \(in VA’s network\)"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.URGENT_CARE_PHARMACIES, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.URGENT_CARE_PHARMACIES}
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "Community pharmacies \(in VA’s network\)"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.URGENT_CARE_PHARMACIES, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} // 15 results
        facilityType={LocationType.URGENT_CARE_PHARMACIES}
        context="new york"
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 11 - 15 of 15 results for "Community pharmacies \(in VA’s network\)"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.CC_PROVIDER, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.CC_PROVIDER}
        serviceType="foo"
        context="new york"
        specialtyMap={{ foo: 'test' }}
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 result for "Community providers \(in VA’s network\)",\s+"test"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.CC_PROVIDER, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.CC_PROVIDER}
        serviceType="foo"
        context="new york"
        specialtyMap={{ foo: 'test' }}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "Community providers \(in VA’s network\)",\s+"test"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.CC_PROVIDER, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} // 15 results
        facilityType={LocationType.CC_PROVIDER}
        serviceType="foo"
        context="new york"
        specialtyMap={{ foo: 'test' }}
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 11 - 15 of 15 results for "Community providers \(in VA’s network\)",\s+"test"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.BENEFITS, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.BENEFITS}
        serviceType="ApplyingForBenefits"
        context="new york"
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 result for "VA benefits",\s+"Applying for benefits"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.BENEFITS, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.BENEFITS}
        serviceType="ApplyingForBenefits"
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "VA benefits",\s+"Applying for benefits"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.BENEFITS, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} // 15 results
        facilityType={LocationType.BENEFITS}
        serviceType="ApplyingForBenefits"
        context="new york"
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 11 - 15 of 15 results for "VA benefits",\s+"Applying for benefits"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('LocationType.BENEFITS, serviceType null', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.BENEFITS}
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "VA benefits",\s+"All VA benefit services"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('LocationType.CEMETERY, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.CEMETERY}
        context="new york"
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 result for "VA cemeteries"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('LocationType.CEMETERY, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.CEMETERY}
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "VA cemeteries"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('LocationType.CEMETERY, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} // 15 results
        facilityType={LocationType.CEMETERY}
        context="new york"
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 11 - 15 of 15 results for "VA cemeteries"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });
  it('should refresh header with new results', () => {
    let wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.HEALTH}
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );
    wrapper = shallow(
      <SearchResultsHeader
        results={[{}, {}, {}, {}, {}]} // 5 results
        facilityType={LocationType.HEALTH}
        context="new jersey"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Showing 1 - 5 results for "VA health",\s+"All VA health services"\s+near\s+"new jersey"/,
    );
    wrapper.unmount();
  });

  // TODO: find a way to unit test the React.memo behavior

  describe('#handleNumberOfResults', () => {
    it('should handle filtered results - 2 results on first page with large total (filtered)', () => {
      // API returns 15 total entries but only 2 are actually displayed due to filtering
      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}, {}]} // 2 results
          facilityType={LocationType.CC_PROVIDER}
          serviceType="Dental"
          context="new york"
          specialtyMap={{ Dental: 'Dental' }}
          pagination={{ totalEntries: 15, currentPage: 1, totalPages: 2 }}
        />,
      );

      expect(wrapper.find('h2').text()).to.include(
        'Showing 1 - 2 results for "Community providers',
      );
      wrapper.unmount();
    });

    it('should handle normal pagination - 80+ facilities with full pagination', () => {
      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} // 10 results
          facilityType={LocationType.HEALTH}
          serviceType="PrimaryCare"
          context="new york"
          pagination={{ totalEntries: 80, currentPage: 1, totalPages: 8 }}
        />,
      );

      expect(wrapper.find('h2').text()).to.match(
        /Showing 1 - 10 of 80 results for "VA health",\s+"Primary care"\s+near\s+"new york"/,
      );
      wrapper.unmount();
    });

    it('should handle normal pagination - 80+ facilities on last page', () => {
      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} // 10 results
          facilityType={LocationType.HEALTH}
          serviceType="PrimaryCare"
          context="new york"
          pagination={{ totalEntries: 80, currentPage: 8, totalPages: 8 }}
        />,
      );

      expect(wrapper.find('h2').text()).to.match(
        /Showing 71 - 80 of 80 results for "VA health",\s+"Primary care"\s+near\s+"new york"/,
      );
      wrapper.unmount();
    });

    it('should handle small result sets - 5 total results', () => {
      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}, {}, {}, {}, {}]} // 5 results
          facilityType={LocationType.HEALTH}
          serviceType="PrimaryCare"
          context="new york"
          pagination={{ totalEntries: 5, currentPage: 1, totalPages: 1 }}
        />,
      );

      expect(wrapper.find('h2').text()).to.match(
        /Showing 1 - 5 results for "VA health",\s+"Primary care"\s+near\s+"new york"/,
      );
      wrapper.unmount();
    });

    it('should handle single result correctly', () => {
      const wrapper = shallow(
        <SearchResultsHeader
          results={[{}]}
          facilityType={LocationType.HEALTH}
          serviceType="PrimaryCare"
          context="new york"
          pagination={{ totalEntries: 1, currentPage: 1, totalPages: 1 }}
        />,
      );

      expect(wrapper.find('h2').text()).to.match(
        /Showing 1 result for "VA health",\s+"Primary care"\s+near\s+"new york"/,
      );
      wrapper.unmount();
    });

    it('should handle no results correctly', () => {
      const wrapper = shallow(
        <SearchResultsHeader
          results={[]}
          facilityType={LocationType.HEALTH}
          serviceType="PrimaryCare"
          context="new york"
          pagination={{ totalEntries: 0, currentPage: 1, totalPages: 1 }}
        />,
      );

      expect(wrapper.find('h2').text()).to.match(
        /No results found for "VA health",\s+"Primary care"\s+near\s+"new york"/,
      );
      wrapper.unmount();
    });
  });
});
