import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import SelectArrayItemsFromBatteries from '../components/Batteries';

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
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('Batteries', () => {
  it('should render', () => {
    const wrapper = mount(<SelectArrayItemsFromBatteries store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });

  it('should display the device name of the battery', () => {
    const wrapper = mount(<SelectArrayItemsFromBatteries store={fakeStore} />);
    expect(wrapper.text()).to.include('OMEGAX d3241');
    expect(wrapper.text()).to.include('fake device name');
    wrapper.unmount();
  });
  it('should display the prescribed date of the battery', () => {
    const wrapper = mount(<SelectArrayItemsFromBatteries store={fakeStore} />);
    expect(wrapper.text()).to.include('Prescribed December 20, 2020');
    expect(wrapper.text()).to.include('Prescribed April 05, 2017');
    wrapper.unmount();
  });
  it('should display the last order date of the batteries', () => {
    const wrapper = mount(<SelectArrayItemsFromBatteries store={fakeStore} />);
    expect(wrapper.text()).to.include('Last order date:  01/01/2020');
    expect(wrapper.text()).to.include('Last order date:  03/02/2020');
    wrapper.unmount();
  });
  it('should display the quantity of the battery', () => {
    const wrapper = mount(<SelectArrayItemsFromBatteries store={fakeStore} />);
    expect(wrapper.text()).to.include('Quantity: 60');
    expect(wrapper.text()).to.include('Quantity: 2');
    wrapper.unmount();
  });
  it('should display the batteries with a light gray background', () => {
    const wrapper = mount(<SelectArrayItemsFromBatteries store={fakeStore} />);
    expect(
      wrapper.find('.vads-u-background-color--gray-lightest').length,
    ).to.equal(2);
    wrapper.unmount();
  });
  it('should display an alert box if the Veteran cannot order batteries', () => {
    const wrapper = mount(<SelectArrayItemsFromBatteries store={fakeStore} />);
    expect(wrapper.find('AlertBox').length).to.equal(1);
    wrapper.unmount();
  });
});
