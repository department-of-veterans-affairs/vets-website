import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ExclusionPeriodsWidget from '../../../components/ExclusionPeriodsWidget';

describe('ExclusionPeriodsWidget', () => {
  const mockStore = configureStore();
  it('should display ROTC message when displayType is ROTC', () => {
    const initialState = {
      form: {
        data: {
          exclusionPeriods: ['ROTC'],
        },
      },
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ExclusionPeriodsWidget displayType="ROTC" />
      </Provider>,
    );
    expect(wrapper.text()).to.include(
      'Dept. of Defense data shows you were commissioned as the result of a Senior ROTC.',
    );
    wrapper.unmount();
  });
  it('should display LRP message when displayType is LRP', () => {
    const initialState = {
      form: {
        data: {
          exclusionPeriods: ['LRP'],
        },
      },
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ExclusionPeriodsWidget displayType="LRP" />
      </Provider>,
    );
    expect(wrapper.text()).to.include(
      'Dept. of Defense data shows a period of active duty that the military considers as being used for purposes of repaying an Education Loan.',
    );
    wrapper.unmount();
  });
  it('should display Academy message when displayType is Academy', () => {
    const initialState = {
      form: {
        data: {
          exclusionPeriods: ['Academy'],
        },
      },
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ExclusionPeriodsWidget displayType="Academy" />
      </Provider>,
    );
    expect(wrapper.text()).to.include(
      'Dept. of Defense data shows you have graduated from a Military Service Academy',
    );
    wrapper.unmount();
  });
  it('should return null when displayType is not included in exclusionPeriods', () => {
    const initialState = {
      form: {
        data: {
          exclusionPeriods: ['ROTC'],
        },
      },
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ExclusionPeriodsWidget displayType="LRP" />
      </Provider>,
    );
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });
  it('should return null when displayType is not provided', () => {
    const initialState = {
      form: {
        data: {
          exclusionPeriods: ['ROTC', 'LRP', 'Academy'],
        },
      },
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ExclusionPeriodsWidget />
      </Provider>,
    );
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });
});
