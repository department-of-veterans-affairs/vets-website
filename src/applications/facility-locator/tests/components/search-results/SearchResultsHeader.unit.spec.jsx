import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import SearchResultsHeader from '../../../components/SearchResultsHeader';
import { FacilityType } from '../../../constants';
import { Provider } from 'react-redux';

// TODO: fix the error being thrown by these tests!
describe.skip('SearchResultsHeader', () => {
  const defaultStore = {
    searchQuery: {
      specialties: [{ foo: 'bar' }],
    },
  };

  it('should not render header if results are empty', () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <SearchResultsHeader results={[]} />
      </Provider>,
    );

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it.skip('should not render header if inProgress is true', () => {
    const wrapper = mount(<SearchResultsHeader results={[{}]} inProgress />);

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it.skip('should render header if results exist', () => {
    const wrapper = mount(
      <SearchResultsHeader
        results={[{}]}
        facilityType={FacilityType.VA_HEALTH_FACILITY}
        context={'new york'}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      /Results for "VA health" near\s+"new york"/,
    );
    wrapper.unmount();
  });

  // TODO: find a way to unit test the React.memo behavior
});
