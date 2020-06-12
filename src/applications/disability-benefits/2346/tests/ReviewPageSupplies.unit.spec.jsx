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
              productGroup: 'BATTERIES',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2020-01-01',
              nextAvailabilityDate: '2020-09-01',
              quantity: 60,
              prescribedDate: '2020-12-20',
            },
            {
              productName: 'DOME',
              productGroup: 'ACCESSORIES',
              productId: 3,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '6mm',
            },
            {
              productName: 'DOME',
              productGroup: 'ACCESSORIES',
              productId: 4,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '7mm',
            },
            {
              productName: 'WaxBuster Single Unit',
              productGroup: 'ACCESSORIES',
              productId: 5,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
            },
          ],
          order: [{ productId: 1 }, { productId: 3 }],
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
    expect(
      reviewPageSupplies
        .find('h5')
        .at(0)
        .text(),
    ).to.equal('OMEGAX d3241');
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
});
