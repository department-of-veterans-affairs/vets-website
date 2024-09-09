import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CurrentBenefitsStatus from '../../components/CurrentBenefitsStatus';

const mockStore = configureStore([]);
const initialState = {
  personalInfo: {},
};
const store = mockStore(initialState);
describe('when <CurrentBenefitsStatus/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <CurrentBenefitsStatus />
      </Provider>,
    );
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  it('should return null if response error is "Forbidden"', () => {
    const wrapper = mount(
      <Provider
        store={mockStore({
          personalInfo: {
            error: {
              error: 'Forbidden',
            },
          },
        })}
      >
        <CurrentBenefitsStatus />
      </Provider>,
    );
    expect(wrapper.html()).to.not.be.ok;
    wrapper.unmount();
  });
  it('Should render the link', () => {
    const wrapper = mount(
      <Provider store={store}>
        <CurrentBenefitsStatus
          link={() => <a href="http://some-link">some Link</a>}
        />
      </Provider>,
    );
    const link = wrapper.find('a');
    expect(link).to.exist;
    wrapper.unmount();
  });
});
