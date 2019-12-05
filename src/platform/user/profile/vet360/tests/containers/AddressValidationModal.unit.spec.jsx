import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import AddressValidationModal from '../../containers/AddressValidationModal';

describe('<AddressValidationModal/>', () => {
  const fakeStore = {
    getState: () => ({
      vet360: {
        modal: 'addressValidation',
        formFields: {
          mailingAddress: {
            value: {
              addressLine1: '1493 Martin Luther King Rd',
              addressLine2: '',
              addressLine3: '',
              addressPou: 'CORRESPONDENCE',
              addressType: 'DOMESTIC',
              city: 'Fulton',
              countryName: 'United States',
              id: 123,
              internationalPostalCode: null,
              province: null,
              stateCode: 'NY',
              zipCode: '97062',
            },
          },
        },
        isAddressValidationModalVisible: true,
        addressValidationError: false,
        suggestedAddresses: [
          {
            addressLine1: '12345 1st Ave',
            addressLine2: 'bldg 2',
            addressLine3: 'apt 23',
            city: 'Tampa',
            stateCode: 'FL',
            zipCode: '12346',
            addressMetaData: {
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
              residentialDeliveryIndicator: 'MIXED',
            },
          },
          {
            addressLine1: '22222 1st Ave',
            addressLine2: 'bldg 2',
            addressLine3: 'apt 23',
            city: 'Saint Petersburg',
            stateCode: 'FL',
            zipCode: '55555',
            addressMetaData: {
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
              residentialDeliveryIndicator: 'MIXED',
            },
          },
        ],
        addressValidationType: 'mailingAddress',
        userEnteredAddress: {},
        validationKey: 1234,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('validate render', () => {
    const component = enzyme.mount(
      <AddressValidationModal store={fakeStore} />,
    );
    expect(component.exists('AddressValidationModal')).to.equal(true);
    expect(component.exists('Modal')).to.equal(true);
    component.unmount();
  });

  it('renders alert box', () => {
    const component = enzyme.mount(
      <AddressValidationModal store={fakeStore} />,
    );

    expect(component.exists('AlertBox')).to.equal(true);
    component.unmount();
  });

  it('renders correct buttons', () => {
    const component = enzyme.mount(
      <AddressValidationModal store={fakeStore} />,
    );

    expect(component.find('.usa-button-primary').text()).to.equal('Continue');
    expect(component.find('.usa-button-secondary').text()).to.equal('Cancel');
    component.unmount();
  });

  it('renders correct buttons', () => {
    const newFakeStore = {
      getState: () => ({
        vet360: {
          modal: 'addressValidation',
          formFields: {
            mailingAddress: {
              value: {
                addressLine1: '1493 Martin Luther King Rd',
                addressLine2: '',
                addressLine3: '',
                addressPou: 'CORRESPONDENCE',
                addressType: 'DOMESTIC',
                city: 'Fulton',
                countryName: 'United States',
                id: 123,
                internationalPostalCode: null,
                province: null,
                stateCode: 'NY',
                zipCode: '97062',
              },
            },
          },
          isAddressValidationModalVisible: true,
          addressValidationError: true,
          suggestedAddresses: [],
          addressValidationType: 'mailingAddress',
          userEnteredAddress: {},
          validationKey: null,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const component = enzyme.mount(
      <AddressValidationModal store={newFakeStore} />,
    );

    expect(component.find('.usa-button-primary').text()).to.equal(
      'Edit Address',
    );
    expect(component.find('.usa-button-secondary').text()).to.equal('Cancel');
    component.unmount();
  });

  it('validates inputs', () => {
    const component = enzyme.mount(
      <AddressValidationModal store={fakeStore} />,
    );

    expect(
      component
        .find('label')
        .at(1)
        .text(),
    ).to.equal('12345 1st Ave bldg 2 apt 23 Tampa, FL 12346');

    expect(
      component
        .find('label')
        .at(2)
        .text(),
    ).to.equal('22222 1st Ave bldg 2 apt 23 Saint Petersburg, FL 55555');
    component.unmount();
  });

  it('validates headings', () => {
    const component = enzyme.mount(
      <AddressValidationModal store={fakeStore} />,
    );

    expect(
      component
        .find('h3')
        .at(0)
        .text(),
    ).to.equal('Edit mailing address');
    expect(
      component
        .find('h3')
        .at(1)
        .text(),
    ).to.equal("Your address update isn't valid");
    component.unmount();
  });
});
