import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import SelectArrayItemsFromAccessoriesWidget from '../components/SelectArrayItemsAccessoriesWidget';

const fakeStore = {
  getState: () => ({
    form: {
      data: {
        supplies: [
          {
            productName: 'DOME',
            productGroup: 'hearing aid accessories',
            productId: '3',
            availableForReorder: true,
            lastOrderDate: '2019-06-30',
            nextAvailabilityDate: '2019-12-15',
            quantity: 10,
            size: '6mm',
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
            productName: 'fake name 2',
            productGroup: 'hearing aid accessories',
            productId: '9',
            availableForReorder: false,
            lastOrderDate: '2020-03-02',
            nextAvailabilityDate: '2999-12-15',
            quantity: 2,
          },
        ],
        selectedProducts: [{ productId: '3' }],
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('SelectArrayItemsAccessoriesWidget', () => {
  it('should render', () => {
    const wrapper = mount(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
  it('should display accessories', () => {
    const wrapper = shallow(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(wrapper.html()).to.include('DOM');
    expect(wrapper.html()).to.include('fake name 1');
    expect(wrapper.html()).to.include('fake name 2');
    wrapper.unmount();
  });
  it('should house the selected accessories inside selectedProducts array', () => {
    const mountedWrapper = mount(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    const spy = sinon.spy(mountedWrapper, 'selectedProducts', ['get', 'set']);
    mountedWrapper.setProps({
      selectedProducts: [{ productId: '3' }, { productId: '4' }],
    });
    expect(spy).to.have.property('selectedProducts', [
      { productId: '3' },
      { productId: '4' },
    ]);
    mountedWrapper.unmount();
  });
  it('should display the quantity of the accessory', () => {
    const wrapper = mount(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(wrapper.text()).to.include('Quantity: 10');
    expect(wrapper.text()).to.include('Quantity: 5');
    expect(wrapper.text()).to.include('Quantity: 2');
    wrapper.unmount();
  });
  it('should display the last order date of the accessories', () => {
    const wrapper = mount(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(wrapper.text()).to.include('Last order date:  06/30/2019');
    expect(wrapper.text()).to.include('Last order date:  01/18/2020');
    expect(wrapper.text()).to.include('Last order date:  03/02/2020');
    wrapper.unmount();
  });
  it('should display the product name of the accessory', () => {
    const wrapper = mount(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(wrapper.text()).to.include('DOME');
    expect(wrapper.text()).to.include('fake name 1');
    expect(wrapper.text()).to.include('fake name 2');
    wrapper.unmount();
  });
  it('should display the accessories with a light gray background', () => {
    const wrapper = mount(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(
      wrapper.find('.vads-u-background-color--gray-lightest').length,
    ).to.equal(3);
    wrapper.unmount();
  });
  it('should display an alert box if the Veteran cannot order accessories', () => {
    const wrapper = mount(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(wrapper.find('AlertBox').length).to.equal(1);
    wrapper.unmount();
  });
});
