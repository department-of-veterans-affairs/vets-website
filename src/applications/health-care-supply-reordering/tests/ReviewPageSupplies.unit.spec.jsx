import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ReviewPageSupplies from '../components/ReviewPageSupplies';

describe('ReviewPageSupplies', () => {
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
              lastOrderDate: '2019-01-01',
              nextAvailabilityDate: '2019-09-01',
              quantity: 60,
              prescribedDate: '2020-12-20',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 3,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '6mm',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 4,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '7mm',
            },
            {
              productName: 'WaxBuster Single Unit',
              productGroup: 'Accessory',
              productId: 5,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
            },
            {
              productName: 'AIRFIT F10 M',
              productGroup: 'Apnea',
              productId: 4,
              availableForReorder: true,
              lastOrderDate: '2022-07-05',
              nextAvailabilityDate: '2022-12-05',
              quantity: 1,
            },
          ],
          order: [{ productId: 1 }, { productId: 3 }, { productId: 4 }],
          eligibility: {
            batteries: true,
            accessories: true,
            apneas: true,
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const fakeStoreEmptyStates = {
    getState: () => ({
      form: {
        data: {
          supplies: [
            {
              deviceName: 'OMEGAX d3241',
              productName: 'ZA1239',
              productGroup: 'Battery',
              productId: 1,
              lastOrderDate: '2020-01-01',
              nextAvailabilityDate: '2020-09-01',
              quantity: 60,
              prescribedDate: '2020-12-20',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 3,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '6mm',
            },
          ],
          order: [],
          eligibility: {
            batteries: false,
            accessories: true,
            apneas: true,
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('should render reviewPageSupplies', () => {
    const reviewPageSupplies = mount(<ReviewPageSupplies store={fakeStore} />);
    expect(reviewPageSupplies).not.to.be.undefined;
    reviewPageSupplies.unmount();
  });

  it('verify accessories selected count', () => {
    const reviewPageSupplies = mount(<ReviewPageSupplies store={fakeStore} />);
    expect(
      reviewPageSupplies
        .find('span')
        .at(1)
        .text(),
    ).to.equal('(1 out of 1 selected)');
    reviewPageSupplies.unmount();
  });

  it('verify batteries heading content', () => {
    const reviewPageSupplies = mount(<ReviewPageSupplies store={fakeStore} />);
    expect(reviewPageSupplies.text()).to.include('OMEGAX d3241');
    reviewPageSupplies.unmount();
  });

  it('verify batteries quantity content', () => {
    const reviewPageSupplies = mount(<ReviewPageSupplies store={fakeStore} />);
    expect(
      reviewPageSupplies
        .find('span')
        .at(2)
        .text(),
    ).to.equal('ZA1239 batteries (Quantity: 60)');
    reviewPageSupplies.unmount();
  });

  it('verify apnea heading content', () => {
    const reviewPageSupplies = mount(<ReviewPageSupplies store={fakeStore} />);
    expect(reviewPageSupplies.text()).to.include('AIRFIT F10 M');
    reviewPageSupplies.unmount();
  });

  it('should display empty state content', () => {
    const reviewPageSupplies = mount(
      <ReviewPageSupplies store={fakeStoreEmptyStates} />,
    );
    expect(
      reviewPageSupplies.find('.empty-state-ineligible-battery-text'),
    ).length.to.be(1);
    expect(
      reviewPageSupplies.find('.empty-state-eligible-accessory-text'),
    ).length.to.be(1);
    expect(
      reviewPageSupplies.find('.empty-state-eligible-apnea-text'),
    ).length.to.be(1);
    reviewPageSupplies.unmount();
  });
});
