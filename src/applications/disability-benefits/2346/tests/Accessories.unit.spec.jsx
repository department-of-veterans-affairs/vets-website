import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import moment from 'moment';
import Accessories from '../components/Accessories';

const lastYear = moment()
  .subtract(1, 'years')
  .format('YYYY');

const fakeLastOrderDates = [
  `${lastYear}-01-18`,
  `${lastYear}-03-02`,
  `${lastYear}-03-30`,
];

const fakeStore = {
  getState: () => ({
    form: {
      data: {
        supplies: [
          {
            productName: 'DOME',
            productGroup: 'Accessory',
            productId: 3,
            availableForReorder: true,
            lastOrderDate: fakeLastOrderDates[0],
            nextAvailabilityDate: '2020-12-15',
            quantity: 10,
            size: '6mm',
          },
          {
            productName: 'fake name 1',
            productGroup: 'Accessory',
            productId: 4,
            availableForReorder: true,
            lastOrderDate: fakeLastOrderDates[1],
            nextAvailabilityDate: '2019-12-15',
            quantity: 5,
            size: '3mm',
          },
          {
            productName: 'fake name 2',
            productGroup: 'Accessory',
            productId: 9,
            availableForReorder: false,
            lastOrderDate: fakeLastOrderDates[2],
            nextAvailabilityDate: '2999-12-15',
            quantity: 2,
          },
        ],
        selectedProducts: [{ productId: 3 }],
        eligibility: {
          accessories: true,
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
            productName: 'DOME',
            productGroup: 'Accessory',
            productId: 3,
            availableForReorder: true,
            lastOrderDate: '2015-06-30',
            nextAvailabilityDate: '2099-12-15',
            quantity: 10,
            size: '6mm',
          },
          {
            productName: 'fake name 1',
            productGroup: 'Accessory',
            productId: 4,
            availableForReorder: true,
            lastOrderDate: '2014-01-18',
            nextAvailabilityDate: '2099-10-19',
            quantity: 5,
            size: '3mm',
          },
          {
            productName: 'fake name 2',
            productGroup: 'Accessory',
            productId: 9,
            availableForReorder: false,
            lastOrderDate: '2016-03-02',
            nextAvailabilityDate: '2999-08-03',
            quantity: 2,
          },
        ],
        selectedProducts: [{ productId: 3 }],
        eligibility: {
          accessories: false,
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('Accessories', () => {
  it('should render', () => {
    const wrapper = mount(<Accessories store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
  it('should display the product name of the accessory', () => {
    const wrapper = shallow(<Accessories store={fakeStore} />);
    expect(wrapper.html()).to.include('DOM');
    expect(wrapper.html()).to.include('fake name 1');
    expect(wrapper.html()).to.include('fake name 2');
    wrapper.unmount();
  });

  it('should display the quantity of the accessory', () => {
    const wrapper = mount(<Accessories store={fakeStore} />);
    expect(wrapper.text()).to.include('Quantity: 10');
    expect(wrapper.text()).to.include('Quantity: 5');
    expect(wrapper.text()).to.include('Quantity: 2');
    wrapper.unmount();
  });
  it('should display the last order date of the accessories', () => {
    const wrapper = mount(<Accessories store={fakeStore} />);
    expect(wrapper.text()).to.include(
      `Last order date:  ${moment(fakeLastOrderDates[0]).format('MM/DD/YYYY')}`,
    );
    expect(wrapper.text()).to.include(
      `Last order date:  ${moment(fakeLastOrderDates[1]).format('MM/DD/YYYY')}`,
    );
    expect(wrapper.text()).to.include(
      `Last order date:  ${moment(fakeLastOrderDates[2]).format('MM/DD/YYYY')}`,
    );
    wrapper.unmount();
  });
  it('should display the product name of the accessory', () => {
    const wrapper = mount(<Accessories store={fakeStore} />);
    expect(wrapper.text()).to.include('DOME');
    expect(wrapper.text()).to.include('fake name 1');
    expect(wrapper.text()).to.include('fake name 2');
    wrapper.unmount();
  });
  it('should display the accessories with a light gray background', () => {
    const wrapper = mount(<Accessories store={fakeStore} />);
    expect(
      wrapper.find('.vads-u-background-color--gray-lightest').length,
    ).to.equal(3);
    wrapper.unmount();
  });
  it('should display an alert box if the Veteran is not eligible to order accessories and has not ordered in the last 2 years', () => {
    const wrapper = mount(<Accessories store={fakeStoreNoEligibility2Years} />);
    expect(wrapper.find('.accessories-two-year-alert-content').length).to.equal(
      1,
    );
    wrapper.unmount();
  });
});
