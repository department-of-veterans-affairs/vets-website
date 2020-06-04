import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import ConfirmationPage from '../containers/ConfirmationPage';

describe('ConfirmationPage', () => {
  const fakeStore = {
    getState: () => ({
      form: {
        submission: {
          submittedAt: 'May 8, 2020',
          response: {
            attributes: {
              confirmationNumber: '123456',
            },
            shippingAddress: {
              'view:livesOnMilitaryBaseInfo': {},
              country: 'USA',
              street: '101 Example Street',
              street2: 'Apt 2',
              city: 'Kansas City',
              state: 'MO',
              postalCode: '64117',
            },
          },
        },
        data: {
          permanentAddress: {
            'view:livesOnMilitaryBaseInfo': {},
            country: 'USA',
            street: '101 Example Street',
            street2: 'Apt 2',
            city: 'Kansas City',
            state: 'MO',
            postalCode: '64117',
          },
          temporaryAddress: {
            'view:livesOnMilitaryBaseInfo': {},
            country: 'USA',
            street: '201 Example Street',
            city: 'Galveston',
            state: 'TX',
            postalCode: '77550',
          },
          email: 'test2@test1.net',
          currentAddress: 'temporaryAddress',
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
          fullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
          ssnLastFour: '1200',
          gender: 'M',
          dateOfBirth: '1933-04-05',
          selectedProducts: [{ productId: '4' }, { productId: '5' }],
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  it('should render ConfirmationPage', () => {
    const confirmationPage = mount(<ConfirmationPage store={fakeStore} />);
    expect(confirmationPage).not.to.be.undefined;
    confirmationPage.unmount();
  });

  it('should render AlertBox', () => {
    const confirmationPage = mount(<ConfirmationPage store={fakeStore} />);
    const alertBox = confirmationPage.find('AlertBox');
    expect(alertBox).not.to.be.undefined;
    confirmationPage.unmount();
  });

  it('verify first alertbox text', () => {
    const confirmationPage = mount(<ConfirmationPage store={fakeStore} />);
    const alertBox = confirmationPage.find('AlertBox');
    expect(
      alertBox
        .first()
        .find('h3')
        .text(),
    ).to.equal('Your order has been submitted');
    expect(
      alertBox
        .first()
        .find('p')
        .text(),
    ).to.include('test2@test1.net');
    confirmationPage.unmount();
  });

  it('verify second alertbox content', () => {
    const confirmationPage = mount(<ConfirmationPage store={fakeStore} />);
    const alertBox = confirmationPage.find('AlertBox').last();
    expect(alertBox.find('h4').text()).to.equal(
      'Request for Batteries and Accessories (Form 2346)',
    );
    expect(
      alertBox
        .find('li')
        .at(0)
        .text(),
    ).to.equal('DOME (Quantity: 10)');
    expect(
      alertBox
        .find('li')
        .at(1)
        .text(),
    ).to.equal('WaxBuster Single Unit (Quantity: 10)');
    expect(alertBox.text()).to.include('May 8, 2020');
    expect(alertBox.text()).to.include('123456');
    expect(alertBox.text()).to.include('Shipping Address');
    expect(alertBox.text()).to.include('101 Example Street Apt 2');
    expect(alertBox.text()).to.include('Kansas City');
    expect(alertBox.text()).to.include('MO');
    confirmationPage.unmount();
  });
});
