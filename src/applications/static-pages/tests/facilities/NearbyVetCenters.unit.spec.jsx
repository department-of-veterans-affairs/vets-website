import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import NearbyVetCenters from '../../facilities/vet-center/NearByVetCenters';

const createFakeStore = state => {
  return {
    getState: () => state,
  };
};

describe('NearbyVetCenters', () => {
  it('should render spinner while loading', () => {
    const state = {
      facilitiesLoading: true,
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(<NearbyVetCenters store={fakeStore} />);
    // console.log(wrapper.debug());
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;
    wrapper.unmount();
  });
});
