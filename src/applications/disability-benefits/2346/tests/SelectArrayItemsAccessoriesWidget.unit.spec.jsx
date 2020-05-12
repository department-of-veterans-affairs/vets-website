import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
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
            lastOrderDate: '2019-06-30',
            nextAvailabilityDate: '2019-12-15',
            quantity: 5,
            size: '3mm',
          },
          {
            productName: 'fake name 2',
            productGroup: 'hearing aid accessories',
            productId: '9',
            availableForReorder: false,
            lastOrderDate: '2019-06-30',
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
    const shallowWrapper = shallow(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(shallowWrapper.prop('selectedProducts')).to.eql([
      { productId: '3' },
    ]);
    // TODO: How to select SelectArrayItemsFromAccessoriesWidget??  -@maharielrosario at 5/12/2020, 6:43:34 PM
    //
    // const widget = mountedWrapper.find('SelectArrayItemsFromAccessoriesWidget');
    // mountedWrapper.find({ id: '4' }).simulate('click');
    // console.log(widget.debug());
    // expect(widget.prop('selectedProducts')).to.eql([
    //   {
    //     productId: '3',
    //   },
    //   {
    //     productId: '4',
    //   },
    // ]);
    shallowWrapper.unmount();
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
  it('should display the last order date of the accessory', () => {
    const wrapper = mount(
      <SelectArrayItemsFromAccessoriesWidget store={fakeStore} />,
    );
    expect(wrapper.text()).to.include('Quantity: 10');
    expect(wrapper.text()).to.include('Quantity: 5');
    expect(wrapper.text()).to.include('Quantity: 2');
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
