import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SearchResultsHeader from '../../../components/SearchResultsHeader';
import { FacilityType } from '../../../constants';

describe('SearchResultsHeader', () => {
  it('should not render header if results are empty', () => {
    const wrapper = shallow(<SearchResultsHeader results={[]} />);

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results exist', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        facilityType={FacilityType.VA_HEALTH_FACILITY}
        context={'new york'}
      />,
    );

    expect(wrapper.find('h2').text()).to.equal(
      'Results for VA health near new york',
    );
    wrapper.unmount();
  });

  // TODO: find a way to unit test the React.memo behavior
});
