import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import ConfirmationPage from '../containers/ConfirmationPage';

describe('ConfirmationPage', () => {
  const fakeStore = {
    getState: () => ({
      form: {
        data: {
          permanentAddress: {
            'view:livesOnMilitaryBaseInfo': {},
            country: 'United States',
            street: '101 Example Street',
            street2: 'Apt 2',
            city: 'Kansas City',
            state: 'MO',
            postalCode: '64117',
          },
          temporaryAddress: {
            'view:livesOnMilitaryBaseInfo': {},
            country: 'United States',
            street: '201 Example Street',
            city: 'Galveston',
            state: 'TX',
            postalCode: '77550',
          },
          vetEmail: 'vet@vet.com',
          supplies: [
            {
              deviceName: 'OMEGAX d3241',
              productName: 'ZA1239',
              productGroup: 'BATTERIES',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2019-12-25',
              nextAvailabilityDate: '2020-01-01',
              quantity: 60,
              prescribedDate: '2019-12-20',
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
          fullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
          ssnLastFour: '1200',
          gender: 'M',
          dateOfBirth: '1933-04-05',
          eligibility: { batteries: true, accessories: true },
          'view:currentAddress': 'permanentAddress',
          order: [{ productId: 3 }],
        },
        submission: {
          errorMessage: false,
          response: {
            orderId: 'TEST1234',
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const fakeStoreNoSelections = {
    getState: () => ({
      form: {
        data: {
          permanentAddress: {
            'view:livesOnMilitaryBaseInfo': {},
            country: 'United States',
            street: '101 Example Street',
            street2: 'Apt 2',
            city: 'Kansas City',
            state: 'MO',
            postalCode: '64117',
          },
          temporaryAddress: {
            'view:livesOnMilitaryBaseInfo': {},
            country: 'United States',
            street: '201 Example Street',
            city: 'Galveston',
            state: 'TX',
            postalCode: '77550',
          },
          vetEmail: 'vet@vet.com',
          supplies: [
            {
              deviceName: 'OMEGAX d3241',
              productName: 'ZA1239',
              productGroup: 'BATTERIES',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2019-12-25',
              nextAvailabilityDate: '2020-01-01',
              quantity: 60,
              prescribedDate: '2019-12-20',
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
          fullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
          ssnLastFour: '1200',
          gender: 'M',
          dateOfBirth: '1933-04-05',
          'view:currentAddress': 'permanentAddress',
          eligibility: { batteries: true, accessories: true },
          order: [],
        },
        submission: {
          errorMessage: false,
          response: {
            orderId: 'TEST1234',
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const fakeStoreWithErrorMessage = {
    getState: () => ({
      form: {
        data: {
          permanentAddress: {
            'view:livesOnMilitaryBaseInfo': {},
            country: 'United States',
            street: '101 Example Street',
            street2: 'Apt 2',
            city: 'Kansas City',
            state: 'MO',
            postalCode: '64117',
          },
          temporaryAddress: {
            'view:livesOnMilitaryBaseInfo': {},
            country: 'United States',
            street: '201 Example Street',
            city: 'Galveston',
            state: 'TX',
            postalCode: '77550',
          },
          vetEmail: 'vet@vet.com',
          supplies: [
            {
              deviceName: 'OMEGAX d3241',
              productName: 'ZA1239',
              productGroup: 'BATTERIES',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2019-12-25',
              nextAvailabilityDate: '2020-01-01',
              quantity: 60,
              prescribedDate: '2019-12-20',
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
          fullName: { first: 'Greg', middle: 'A', last: 'Anderson' },
          ssnLastFour: '1200',
          gender: 'M',
          dateOfBirth: '1933-04-05',
          'view:currentAddress': 'permanentAddress',
          eligibility: { batteries: true, accessories: true },
          order: [{ productId: 3 }],
        },
        submission: {
          errorMessage: true,
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
    ).to.include('vet@vet.com');
    confirmationPage.unmount();
  });

  it('verify second alertbox content', () => {
    const confirmationPage = mount(<ConfirmationPage store={fakeStore} />);
    const alertBox = confirmationPage.find('AlertBox').last();
    expect(alertBox.find('h4').text()).to.equal(
      'Request for Batteries and Accessories (Form 2346A)',
    );
    expect(
      alertBox
        .find('li')
        .at(0)
        .text(),
    ).to.equal('DOME (Quantity: 10)');
    expect(alertBox.text()).to.include('Shipping address');
    expect(alertBox.text()).to.include('101 Example Street Apt 2');
    expect(alertBox.text()).to.include('Kansas City');
    expect(alertBox.text()).to.include('MO');
    confirmationPage.unmount();
  });
  it('should render the empty state alert if no products were selected', () => {
    const confirmationPage = mount(
      <ConfirmationPage store={fakeStoreNoSelections} />,
    );
    expect(confirmationPage.find('.empty-state-alert')).length.to.be(1);
    confirmationPage.unmount();
  });
  it('should render the partially submitted errors alert if there was an error submitted some of the products', () => {
    const confirmationPage = mount(
      <ConfirmationPage store={fakeStoreWithErrorMessage} />,
    );
    expect(confirmationPage.find('.partial-submit-alert')).length.to.be(1);
    confirmationPage.unmount();
  });
});
