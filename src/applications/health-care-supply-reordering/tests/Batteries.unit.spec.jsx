import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';
import Batteries from '../components/Batteries';

const fakeOrderDate1 = moment().subtract(1, 'years');
const fakeOrderDate2 = moment().subtract(2, 'years');

const fakeStore = {
  getState: () => ({
    form: {
      data: {
        supplies: [
          {
            deviceName: 'OMEGAX d3241',
            productName: 'ZA1239',
            productGroup: 'Battery',
            productId: 1,
            availableForReorder: true,
            lastOrderDate: fakeOrderDate1.format('YYYY-MM-DD'),
            nextAvailabilityDate: '2020-01-01',
            quantity: 60,
            prescribedDate: '2020-12-20',
          },
          {
            productName: 'fake name 1',
            productGroup: 'Battery',
            productId: 4,
            availableForReorder: true,
            lastOrderDate: fakeOrderDate2.format('YYYY-MM-DD'),
            nextAvailabilityDate: '2019-12-15',
            quantity: 5,
            size: '3mm',
            prescribedDate: '2019-10-12',
          },
        ],
        selectedProducts: [{ productId: 1 }],
        eligibility: {
          batteries: true,
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const fakeStoreNoEligibility2Years = {
  getState: () => ({
    form: {
      data: {
        supplies: [
          {
            deviceName: 'OMEGAX d3241',
            productName: 'ZA1239',
            productGroup: 'Battery',
            productId: 1,
            availableForReorder: false,
            lastOrderDate: '2016-01-01',
            nextAvailabilityDate: '2099-01-01',
            quantity: 60,
            prescribedDate: '2015-12-20',
          },
        ],
        eligibility: {
          batteries: false,
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('Batteries', () => {
  it('should render', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });

  it('should display the device name of the battery', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(wrapper.text()).to.include('OMEGAX d3241');
    wrapper.unmount();
  });
  it('should display the prescribed date of the battery', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(wrapper.text()).to.include('Prescribed December 20, 2020');
    expect(wrapper.text()).to.include('Prescribed October 12, 2019');
    wrapper.unmount();
  });
  it('should display the last order date of the batteries', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(wrapper.text()).to.include(
      `Last order date:  ${fakeOrderDate1.format('MM/DD/YYYY')}`,
    );
    expect(wrapper.text()).to.include(
      `Last order date:  ${fakeOrderDate2.format('MM/DD/YYYY')}`,
    );
    wrapper.unmount();
  });
  it('should display the quantity of the battery', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(wrapper.text()).to.include('Quantity: 60');
    expect(wrapper.text()).to.include('Quantity: 5');
    wrapper.unmount();
  });
  it('should display the batteries with a light gray background', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(
      wrapper.find('.vads-u-background-color--gray-lightest').length,
    ).to.equal(2);
    wrapper.unmount();
  });
  it('should display an alert box if the Veteran does not have eligible battery orders within the last 2 years', () => {
    const wrapper = mount(<Batteries store={fakeStoreNoEligibility2Years} />);
    const twoYearAlert = wrapper.find('.batteries-two-year-alert-content');
    expect(twoYearAlert.length).to.equal(1);
    expect(twoYearAlert.text()).to.include(
      'You haven’t placed an order for hearing aid batteries within the past 2 years.',
    );
    wrapper.unmount();
  });
});
