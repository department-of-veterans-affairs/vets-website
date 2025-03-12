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
              productGroup: 'Battery',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2019-12-25',
              nextAvailabilityDate: '2020-01-01',
              quantity: 60,
              prescribedDate: '2019-12-20',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 3,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '6mm',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 4,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '7mm',
            },
            {
              productName: 'WaxBuster Single Unit',
              productGroup: 'Accessory',
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
          response: [
            {
              status: 'Order Processed',
              orderId: 'TEST1234',
              productId: 1234,
            },
            {
              status: 'Order Processed',
              orderId: 'TEST6789',
              productId: 6789,
            },
          ],
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const fakeStoreNoApenaToggle = {
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
              productGroup: 'Battery',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2019-12-25',
              nextAvailabilityDate: '2020-01-01',
              quantity: 60,
              prescribedDate: '2019-12-20',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 3,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '6mm',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 4,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '7mm',
            },
            {
              productName: 'WaxBuster Single Unit',
              productGroup: 'Accessory',
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
          response: [
            {
              status: 'Order Processed',
              orderId: 'TEST1234',
              productId: 1234,
            },
            {
              status: 'Order Processed',
              orderId: 'TEST6789',
              productId: 6789,
            },
          ],
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
              productGroup: 'Battery',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2019-12-25',
              nextAvailabilityDate: '2020-01-01',
              quantity: 60,
              prescribedDate: '2019-12-20',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 3,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '6mm',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 4,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '7mm',
            },
            {
              productName: 'WaxBuster Single Unit',
              productGroup: 'Accessory',
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
          response: {
            errors: [
              {
                title: 'Supplies Not Selected',
                detail: 'No supplies were selected to order',
                code: 'MDOT_supplies_not_selected',
                status: '422',
              },
            ],
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const fakeStorePtSubmittedOrder = {
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
              productGroup: 'Battery',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2019-12-25',
              nextAvailabilityDate: '2020-01-01',
              quantity: 60,
              prescribedDate: '2019-12-20',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 3,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '6mm',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 4,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '7mm',
            },
            {
              productName: 'WaxBuster Single Unit',
              productGroup: 'Accessory',
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
          response: [
            {
              status: 'Order Processed',
              orderId: 9443,
              productId: 6584,
            },
            {
              status: 'Unable to place order.  Please call 303-273-6276.',
              orderId: 1,
              productId: 6449,
            },
            {
              status: 'Unable to place order.  Please call 303-273-6276.',
              orderId: 3,
              productId: 6447,
            },
          ],
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const fakeStoreServerError = {
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
              productGroup: 'Battery',
              productId: 1,
              availableForReorder: true,
              lastOrderDate: '2019-12-25',
              nextAvailabilityDate: '2020-01-01',
              quantity: 60,
              prescribedDate: '2019-12-20',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 3,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '6mm',
            },
            {
              productName: 'DOME',
              productGroup: 'Accessory',
              productId: 4,
              availableForReorder: true,
              lastOrderDate: '2019-06-30',
              nextAvailabilityDate: '2019-12-15',
              quantity: 10,
              size: '7mm',
            },
            {
              productName: 'WaxBuster Single Unit',
              productGroup: 'Accessory',
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
          response: [
            {
              status: 'Unable to place order.  Please call 303-273-6276.',
              orderId: 0,
              productId: 6448,
            },
          ],
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

  it('should render the your order has been submitted alert', () => {
    const confirmationPage = mount(<ConfirmationPage store={fakeStore} />);
    expect(confirmationPage.find('.usa-alert-heading').text()).to.equal(
      'Your order has been submitted',
    );
    expect(
      confirmationPage
        .find('.order-submission-alert')
        .first()
        .text(),
    ).to.include('vet@vet.com');
    confirmationPage.unmount();
  });

  it('should render the order summary alert', () => {
    const confirmationPage = mount(<ConfirmationPage store={fakeStore} />);
    const vaAlert = confirmationPage.find('va-alert').last();
    expect(vaAlert.find('h4').text()).to.equal(
      'Request for hearing aid or CPAP supplies',
    );
    expect(
      vaAlert
        .find('li')
        .at(0)
        .text(),
    ).to.equal('DOME (Quantity: 10)');

    expect(vaAlert.text()).to.include('Shipping address');
    expect(vaAlert.text()).to.include('101 Example Street Apt 2');
    expect(vaAlert.text()).to.include('Kansas City');
    expect(vaAlert.text()).to.include('MO');
    confirmationPage.unmount();
  });
  it('should render the empty state alert if no products were selected', () => {
    const confirmationPage = mount(
      <ConfirmationPage store={fakeStoreNoSelections} />,
    );
    expect(confirmationPage.find('.empty-state-alert')).length.to.be(1);
    confirmationPage.unmount();
  });
  it('should render the partially submitted errors alert if there was an error submitting some of the products', () => {
    const confirmationPage = mount(
      <ConfirmationPage store={fakeStorePtSubmittedOrder} />,
    );
    expect(confirmationPage.find('.partial-submit-alert')).length.to.be(1);
    confirmationPage.unmount();
  });
  it('should render the submission failed error alert if there was an error submitting the order', () => {
    const confirmationPage = mount(
      <ConfirmationPage store={fakeStoreServerError} />,
    );
    expect(confirmationPage.find('.submission-error-alert')).length.to.be(1);
    confirmationPage.unmount();
  });

  it('should render the order summary alert', () => {
    const confirmationPage = mount(
      <ConfirmationPage store={fakeStoreNoApenaToggle} />,
    );
    const vaAlert = confirmationPage.find('va-alert').last();
    expect(
      vaAlert
        .find('li')
        .at(0)
        .text(),
    ).to.equal('DOME (Quantity: 10)');

    expect(vaAlert.text()).to.include('Shipping address');
    expect(vaAlert.text()).to.include('101 Example Street Apt 2');
    expect(vaAlert.text()).to.include('Kansas City');
    expect(vaAlert.text()).to.include('MO');
    confirmationPage.unmount();
  });
});
