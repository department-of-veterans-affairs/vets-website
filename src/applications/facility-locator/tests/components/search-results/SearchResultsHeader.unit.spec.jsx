import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SearchResultsHeader } from '../../../components/SearchResultsHeader';
import { LocationType } from '../../../constants';

describe('SearchResultsHeader', () => {
  const defaultStore = {
    searchQuery: {
      specialties: [{ foo: 'bar' }],
    },
  };

  it('should not render header if results are empty', () => {
    const wrapper = shallow(<SearchResultsHeader results={[]} />);

    expect(wrapper.find('h2').length).to.equal(0);
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
        results={[{}]}
        facilityType={LocationType.HEALTH}
        context={'new york'}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Results for "VA health"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.HEALTH', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.HEALTH}
        serviceType="PrimaryCare"
        context="new york"
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Results for "VA health",\s+"Primary care"\s+near\s+"new york"/,
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
      /Results for "Urgent care",\s+"Community urgent care providers \(in VA’s network\)"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.CC_PROVIDER', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.CC_PROVIDER}
        serviceType="foo"
        context="new york"
        specialtyMap={{ foo: 'test' }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Results for "Community providers \(in VA’s network\)",\s+"test"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  it('should render header with LocationType.BENEFITS', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={LocationType.BENEFITS}
        serviceType="ApplyingForBenefits"
        context="new york"
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Results for "VA benefits",\s+"Applying for benefits"\s+near\s+"new york"/,
    );
    wrapper.unmount();
  });

  // TODO: find a way to unit test the React.memo behavior
});
