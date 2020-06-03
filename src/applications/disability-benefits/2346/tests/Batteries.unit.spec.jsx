import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import Batteries from '../components/Batteries';

const fakeStore = {
  getState: () => ({
    form: {
      data: {
        supplies: [
          {
            deviceName: 'OMEGAX d3241',
            productName: 'ZA1239',
            productGroup: 'hearing aid batteries',
            productId: '1',
            availableForReorder: true,
            lastOrderDate: '2020-01-01',
            nextAvailabilityDate: '2020-01-01',
            quantity: 60,
            prescribedDate: '2020-12-20',
          },
          {
            productName: 'fake name 1',
            productGroup: 'hearing aid accessories',
            productId: '4',
            availableForReorder: true,
            lastOrderDate: '2020-01-18',
            nextAvailabilityDate: '2019-12-15',
            quantity: 5,
            size: '3mm',
          },
          {
            deviceName: 'fake device name',
            productName: 'fake product name',
            productGroup: 'hearing aid batteries',
            productId: '9',
            availableForReorder: false,
            lastOrderDate: '2020-03-02',
            nextAvailabilityDate: '2999-12-15',
            quantity: 2,
            prescribedDate: '2017-04-05',
          },
        ],
        selectedProducts: [{ productId: '1' }],
        eligibility: {
          batteries: true,
          accessories: false,
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const nextAvailDateAlertStore = {
  getState: () => ({
    form: {
      data: {
        supplies: [
          {
            deviceName: 'OMEGAX d3241',
            productName: 'ZA1239',
            productGroup: 'hearing aid batteries',
            productId: '1',
            availableForReorder: false,
            lastOrderDate: '2020-01-01',
            nextAvailabilityDate: '9999-12-30',
            quantity: 60,
            prescribedDate: '2020-12-20',
          },
        ],
        selectedProducts: [{ productId: '1' }],
        eligibility: {
          batteries: true,
          accessories: false,
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const fiveMonthAlertStore = {
  getState: () => ({
    form: {
      data: {
        supplies: [
          {
            deviceName: 'OMEGAX d3241',
            productName: 'ZA1239',
            productGroup: 'hearing aid batteries',
            productId: '1',
            availableForReorder: false,
            lastOrderDate: '2020-02-01',
            nextAvailabilityDate: '2025-01-01',
            quantity: 60,
            prescribedDate: '2999-12-20',
          },
          {
            productName: 'fake name 1',
            productGroup: 'hearing aid accessories',
            productId: '4',
            availableForReorder: false,
            lastOrderDate: '2020-01-18',
            nextAvailabilityDate: '2025-12-15',
            quantity: 5,
            size: '3mm',
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

const twoYearAlertStore = {
  getState: () => ({
    form: {
      data: {
        supplies: [],
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
    expect(wrapper.text()).to.include('fake device name');
    wrapper.unmount();
  });
  it('should display the prescribed date of the battery', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(wrapper.text()).to.include('Prescribed December 20, 2020');
    expect(wrapper.text()).to.include('Prescribed April 05, 2017');
    wrapper.unmount();
  });
  it('should display the last order date of the batteries', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(wrapper.text()).to.include('Last order date:  01/01/2020');
    expect(wrapper.text()).to.include('Last order date:  03/02/2020');
    wrapper.unmount();
  });
  it('should display the quantity of the battery', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(wrapper.text()).to.include('Quantity: 60');
    expect(wrapper.text()).to.include('Quantity: 2');
    wrapper.unmount();
  });
  it('should display the batteries with a light gray background', () => {
    const wrapper = mount(<Batteries store={fakeStore} />);
    expect(
      wrapper.find('.vads-u-background-color--gray-lightest').length,
    ).to.equal(2);
    wrapper.unmount();
  });
  it("should replace the order checkbox with an alert box if the Veteran's reorder date is a future date", () => {
    const wrapper = mount(<Batteries store={nextAvailDateAlertStore} />);
    const futureDateAlert = wrapper.find('AlertBox');
    expect(wrapper.find('input[type="checkbox"]').length).to.equal(0);
    expect(futureDateAlert.length).to.equal(1);
    expect(futureDateAlert.text()).to.include(
      "You can't reorder batteries for this device until December 30, 9999",
    );
    wrapper.unmount();
  });
  it('should display an alert box if the Veteran has ordered all eligible batteries in the last 5 months', () => {
    const wrapper = mount(<Batteries store={fiveMonthAlertStore} />);
    const fiveMonthAlert = wrapper.find({
      headline: "You can't add batteries to your order at this time",
    });
    expect(fiveMonthAlert.length).to.equal(1);
    expect(fiveMonthAlert.text()).to.include(
      'You recently reordered batteries for this device. You can only reorder batteries for each device once every 5 months.',
    );
    wrapper.unmount();
  });
  it('should display an alert box if the Veteran does not have eligible battery orders within the last 2 years', () => {
    const wrapper = mount(<Batteries store={twoYearAlertStore} />);
    const twoYearAlert = wrapper.find('AlertBox');
    expect(twoYearAlert.length).to.equal(1);
    expect(twoYearAlert.text()).to.include(
      "You haven't placed an order for hearing aid batteries within the past 2 years.",
    );
    wrapper.unmount();
  });
});
