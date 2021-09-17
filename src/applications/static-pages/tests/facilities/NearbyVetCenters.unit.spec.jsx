import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import NearbyVetCenters from '../../facilities/vet-center/NearByVetCenters';

const createFakeStore = state => {
  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };
};

describe('NearbyVetCenters', () => {
  it('should render spinner while loading', () => {
    const state = {
      facility: { loading: true },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearbyVetCenters />
      </Provider>,
    );
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should not render spinner if not loading', () => {
    const state = {
      facility: { loading: false },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearbyVetCenters />
      </Provider>,
    );
    expect(wrapper.find('LoadingIndicator').exists()).to.be.false;
    wrapper.unmount();
  });
});
