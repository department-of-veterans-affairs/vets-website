import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ReviewPageAccessories from '../components/ReviewPageAccessories';

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
          selectedProducts: [{ productId: '4' }, { productId: '5' }],
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  it('should render ReviewPageAccessories', () => {
    const reviewPageAccessories = mount(
      <ReviewPageAccessories store={fakeStore} />,
    );
    expect(reviewPageAccessories).not.to.be.undefined;
    reviewPageAccessories.unmount();
  });

  it('verify accessories selected countt', () => {
    const reviewPageAccessories = mount(
      <ReviewPageAccessories store={fakeStore} />,
    );
    expect(
      reviewPageAccessories
        .find('span')
        .at(1)
        .text(),
    ).to.equal('(2 out of 3 selected)');
    reviewPageAccessories.unmount();
  });

  it('verify accessories heading content', () => {
    const reviewPageAccessories = mount(
      <ReviewPageAccessories store={fakeStore} />,
    );
    expect(
      reviewPageAccessories
        .find('h5')
        .at(0)
        .text(),
    ).to.equal('DOME');
    expect(
      reviewPageAccessories
        .find('h5')
        .at(1)
        .text(),
    ).to.equal('WaxBuster Single Unit');
    reviewPageAccessories.unmount();
  });

  it('verify accessories quantity content', () => {
    const reviewPageAccessories = mount(
      <ReviewPageAccessories store={fakeStore} />,
    );
    expect(
      reviewPageAccessories
        .find('span')
        .at(2)
        .text(),
    ).to.equal('Quantity: 10');
    expect(
      reviewPageAccessories
        .find('span')
        .at(3)
        .text(),
    ).to.equal('Quantity: 10');
    reviewPageAccessories.unmount();
  });
});
