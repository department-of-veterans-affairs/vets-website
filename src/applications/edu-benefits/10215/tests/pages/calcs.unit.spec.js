// src/applications/edu-benefits/10215/pages/calcs.test.js
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Calcs from '../../pages/calcs';

const mockStore = configureStore();

describe('<Calcs />', () => {
  const mockData = {
    programs: [
      {
        supported: true,
        nonSupported: false,
        total: 10,
        supportedFTEPercent: 100,
      },
    ],
  };

  it('should render correctly with given props', () => {
    const store = mockStore({ form: { data: mockData } });
    const wrapper = mount(
      <Provider store={store}>
        <Calcs data={mockData} />
      </Provider>,
    );

    expect(
      wrapper
        .find('label')
        .at(0)
        .text(),
    ).to.equal('Total Enrolled FTE');
    expect(
      wrapper
        .find('span')
        .at(0)
        .text(),
    ).to.equal('--');
    expect(
      wrapper
        .find('label')
        .at(1)
        .text(),
    ).to.equal('Supported student percentage FTE');
    expect(
      wrapper
        .find('span')
        .at(1)
        .text(),
    ).to.equal('--%');
    wrapper.unmount();
  });

  it('should render "--" when no data is available', () => {
    const emptyData = { programs: [] };
    const store = mockStore({ form: { data: emptyData } });
    const wrapper = mount(
      <Provider store={store}>
        <Calcs data={emptyData} />
      </Provider>,
    );

    expect(
      wrapper
        .find('span')
        .at(0)
        .text(),
    ).to.equal('--');
    expect(
      wrapper
        .find('span')
        .at(1)
        .text(),
    ).to.equal('--%');
    wrapper.unmount();
  });
});
