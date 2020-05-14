import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ReviewPageBatteries from '../components/ReviewPageBatteries';

describe('ReviewPageAccessories', () => {
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
              nextAvailabilityDate: '2020-09-01',
              quantity: 60,
              prescribedDate: '2020-12-20',
            },
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
              productName: 'DOME',
              productGroup: 'hearing aid accessories',
              productId: '4',
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '7mm',
            },
            {
              productName: 'WaxBuster Single Unit',
              productGroup: 'hearing aid accessories',
              productId: '5',
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
            },
          ],
          selectedProducts: [{ productId: '1' }],
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  it('should render ReviewPageBatteries', () => {
    const reviewPageBatteries = mount(
      <ReviewPageBatteries store={fakeStore} />,
    );
    expect(reviewPageBatteries).not.to.be.undefined;
    reviewPageBatteries.unmount();
  });

  it('verify accessories selected countt', () => {
    const reviewPageBatteries = mount(
      <ReviewPageBatteries store={fakeStore} />,
    );
    expect(
      reviewPageBatteries
        .find('span')
        .at(1)
        .text(),
    ).to.equal('(1 out of 1 selected)');
    reviewPageBatteries.unmount();
  });

  it('verify batteries heading content', () => {
    const reviewPageBatteries = mount(
      <ReviewPageBatteries store={fakeStore} />,
    );
    expect(
      reviewPageBatteries
        .find('h5')
        .at(0)
        .text(),
    ).to.equal('OMEGAX d3241');
    reviewPageBatteries.unmount();
  });

  it('verify batteries quantity content', () => {
    const reviewPageBatteries = mount(
      <ReviewPageBatteries store={fakeStore} />,
    );
    expect(
      reviewPageBatteries
        .find('span')
        .at(2)
        .text(),
    ).to.equal('ZA1239 batteries (Quantity: 60)');
    reviewPageBatteries.unmount();
  });
});
