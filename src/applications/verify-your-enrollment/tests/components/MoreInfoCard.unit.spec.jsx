import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MoreInfoCard from '../../components/MoreInfoCard';

const mockStore = configureStore([]);
const initialState = {
  personalInfo: {},
};
const store = mockStore(initialState);
describe('when <MoreInfoCard/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MoreInfoCard />
      </Provider>,
    );
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
