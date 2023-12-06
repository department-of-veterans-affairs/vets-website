import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import moment from 'moment';
import ApneaSupplies from '../components/ApneaSupplies';

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
            productName: 'AIRFIT F10 MR',
            productGroup: 'Apnea',
            productId: 6641,
            availableForReorder: true,
            lastOrderDate: fakeLastOrderDates[0],
            nextAvailabilityDate: '2020-12-15',
            quantity: 2,
          },
          {
            productName: 'CPAP THING',
            productGroup: 'Apnea',
            productId: 1234,
            availableForReorder: true,
            lastOrderDate: fakeLastOrderDates[1],
            nextAvailabilityDate: '2019-12-15',
            quantity: 7,
          },
          {
            productName: 'AIRCURVE10-ASV-CLIMATELINE',
            productGroup: 'Apnea',
            productId: 8467,
            lastOrderDate: fakeLastOrderDates[1],
            nextAvailabilityDate: '2019-12-15',
            quantity: 1,
          },
        ],
        selectedProducts: [{ productId: 1234 }],
        eligibility: {
          apneas: true,
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
            productName: 'AIRFIT F10 MR',
            productGroup: 'Apnea',
            productId: 6641,
            availableForReorder: true,
            lastOrderDate: '2015-06-30',
            nextAvailabilityDate: '2099-12-15',
            quantity: 2,
          },
          {
            productName: 'AIRCURVE10-ASV-CLIMATELINE',
            productGroup: 'Apnea',
            productId: 8467,
            lastOrderDate: '2014-01-18',
            nextAvailabilityDate: '2099-10-19',
            quantity: 1,
          },
        ],
        selectedProducts: [{ productId: 6641 }],
        eligibility: {
          apneas: false,
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('ApneaSupplies', () => {
  it('should render', () => {
    const wrapper = mount(<ApneaSupplies store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
  it('should display the product name of the Apnea supply', () => {
    const wrapper = shallow(<ApneaSupplies store={fakeStore} />);
    expect(wrapper.html()).to.include('AIRFIT');
    expect(wrapper.html()).to.include('AIRCURVE');
    expect(wrapper.html()).to.include('CPAP THING');
    wrapper.unmount();
  });

  it('should display the quantity of the Apnea supply', () => {
    const wrapper = mount(<ApneaSupplies store={fakeStore} />);
    expect(wrapper.text()).to.include('Quantity: 2');
    expect(wrapper.text()).to.include('Quantity: 1');
    expect(wrapper.text()).to.include('Quantity: 7');
    wrapper.unmount();
  });
  it('should display the last order date of the Apnea supplies', () => {
    const wrapper = mount(<ApneaSupplies store={fakeStore} />);
    expect(wrapper.text()).to.include(
      `Last order date:  ${moment(fakeLastOrderDates[0]).format('MM/DD/YYYY')}`,
    );
    expect(wrapper.text()).to.include(
      `Last order date:  ${moment(fakeLastOrderDates[1]).format('MM/DD/YYYY')}`,
    );
    wrapper.unmount();
  });
  it('should display the product name of the accessory', () => {
    const wrapper = mount(<ApneaSupplies store={fakeStore} />);
    expect(wrapper.text()).to.include('AIRFIT');
    expect(wrapper.text()).to.include('AIRCURVE');
    wrapper.unmount();
  });
  it('should display the accessories with a light gray background', () => {
    const wrapper = mount(<ApneaSupplies store={fakeStore} />);
    expect(
      wrapper.find('.vads-u-background-color--gray-lightest').length,
    ).to.equal(3);
    wrapper.unmount();
  });
  it('should display an alert box if the Veteran is not eligible to order Apnea supplies and has not ordered in the last 2 years', () => {
    const wrapper = mount(
      <ApneaSupplies store={fakeStoreNoEligibility2Years} />,
    );
    expect(
      wrapper.find('.apnea-supplies-two-year-alert-content').length,
    ).to.equal(1);
    wrapper.unmount();
  });
  it('should display an alert text if non-orderable item is included', () => {
    const wrapper = mount(<ApneaSupplies store={fakeStore} />);
    expect(wrapper.text()).to.include(
      'This item is not available for online reordering.',
    );
    wrapper.unmount();
  });
});
