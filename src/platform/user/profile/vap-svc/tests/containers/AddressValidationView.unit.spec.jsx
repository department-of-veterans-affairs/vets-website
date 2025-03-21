import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import AddressValidationView from '../../containers/AddressValidationView';

const mockStore = configureMockStore([]);

// Helper function to check multiple buttons
function expectButtons(container, expectedButtons) {
  const buttons = container.querySelectorAll('button');
  expect(buttons.length).to.equal(expectedButtons.length);
  expectedButtons.forEach((expectedButton, index) => {
    const button = buttons[index];
    expect(button).to.have.text(expectedButton.text);
    if (expectedButton.type) {
      expect(button).to.have.attribute('type', expectedButton.type);
    }
    if (expectedButton.dataTestId) {
      expect(button).to.have.attribute(
        'data-testid',
        expectedButton.dataTestId,
      );
    }
  });
}

describe('<AddressValidationView/>', () => {
  const store = mockStore({
    vapService: {
      fieldTransactionMap: {
        mailingAddress: {
          isPending: false,
        },
      },
      modal: 'addressValidation',
      addressValidation: {
        addressFromUser: {
          addressLine1: '12345 1st Ave',
          addressLine2: 'bldg 2',
          addressLine3: 'apt 23',
          city: 'Tampa',
          stateCode: 'FL',
          zipCode: '12346',
        },
        isAddressValidationModalVisible: true,
        addressValidationError: false,
        addressValidationType: 'mailingAddress',
        userEnteredAddress: {},
        validationKey: 1234,
        confirmedSuggestions: [],
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
      },
    },
  });

  it('renders VaAlert component and address elements in AddressValidationView component', async () => {
    const { getByRole, getByText, getByTestId } = render(
      <Provider store={store}>
        <AddressValidationView store={store} />
      </Provider>,
    );

    expect(getByRole('alert')).to.exist;
    expect(
      getByText(
        'We can’t confirm the address you entered with the U.S. Postal Service.',
      ),
    ).to.exist;
    expect(getByText('12345 1st Ave, bldg 2, apt 23')).to.exist;
    expect(getByTestId('confirm-address-button')).to.exist;
  });

  it('renders va-button and confirm address button with correct attributes and text', () => {
    const { container } = render(
      <Provider store={store}>
        <AddressValidationView store={store} />
      </Provider>,
    );

    expectButtons(container, [
      {
        type: 'submit',
        text: 'Use this address',
        dataTestId: 'confirm-address-button',
      },
      { text: 'Go back to edit', type: 'button' },
    ]);
  });

  it('renders two primary va-button components with correct text when no validationKey and suggestedAddress are present', () => {
    const newStore = mockStore({
      vapService: {
        fieldTransactionMap: { mailingAddress: { isPending: false } },
        modal: 'addressValidation',
        addressValidation: {
          addressFromUser: {
            addressLine1: '12345 1st Ave',
            addressLine2: 'bldg 2',
            addressLine3: 'apt 23',
            city: 'Tampa',
            stateCode: 'FL',
            zipCode: '12346',
          },
          isAddressValidationModalVisible: true,
          addressValidationError: '',
          addressValidationType: 'mailingAddress',
          userEnteredAddress: {},
          validationKey: null,
          confirmedSuggestions: [],
          suggestedAddresses: [],
        },
      },
    });

    const { container } = render(
      <Provider store={newStore}>
        <AddressValidationView store={newStore} />
      </Provider>,
    );

    expectButtons(container, [
      { text: 'Edit Address', type: 'submit' },
      { text: 'Go back to edit', type: 'button' },
    ]);
  });

  it('does not render Go back to edit button while pending transaction', () => {
    const newStore = mockStore({
      vapService: {
        fieldTransactionMap: {
          mailingAddress: {
            isPending: true,
          },
        },
        modal: 'addressValidation',
        addressValidation: {
          addressFromUser: {
            addressLine1: '12345 1st Ave',
            addressLine2: 'bldg 2',
            addressLine3: 'apt 23',
            city: 'Tampa',
            stateCode: 'FL',
            zipCode: '12346',
          },
          isAddressValidationModalVisible: true,
          addressValidationError: '',
          addressValidationType: 'mailingAddress',
          userEnteredAddress: {},
          validationKey: null,
          confirmedSuggestions: [],
          suggestedAddresses: [],
        },
      },
    });

    const { container } = render(
      <Provider store={newStore}>
        <AddressValidationView store={newStore} />
      </Provider>,
    );

    expectButtons(container, [{ text: 'Edit Address', type: 'submit' }]);
  });

  describe('AddressValidationView with TWO suggestions', () => {
    const baseStore = {
      vapService: {
        fieldTransactionMap: { mailingAddress: { isPending: false } },
        modal: 'addressValidation',
        addressValidation: {
          addressFromUser: {
            addressLine1: '1600 Pennsylvania Avenue NW',
            addressPou: 'RESIDENCE/CHOICE',
            addressType: 'DOMESTIC',
            city: 'Washington',
            countryCodeIso3: 'USA',
            stateCode: 'DC',
            zipCode: '00000',
          },
          isAddressValidationModalVisible: true,
          addressValidationError: false,
          addressValidationType: 'mailingAddress',
          userEnteredAddress: {},
          selectedAddressId: '0',
          suggestedAddresses: [
            {
              addressLine1: '1600 Pennsylvania Ave NW',
              addressType: 'DOMESTIC',
              city: 'Washington',
              countryName: 'United States',
              countryCodeIso3: 'USA',
              stateCode: 'DC',
              zipCode: '20500',
              zipCodeSuffix: '0005',
              addressMetaData: {
                confidenceScore: 100.0,
                addressType: 'Domestic',
                deliveryPointValidation: 'CONFIRMED',
                residentialDeliveryIndicator: 'BUSINESS',
              },
            },
            {
              addressLine1: '1600 Pennsylvania Ave NW',
              addressType: 'DOMESTIC',
              city: 'Washington',
              countryName: 'United States',
              countryCodeIso3: 'USA',
              stateCode: 'DC',
              zipCode: '20502',
              zipCodeSuffix: '0001',
              addressMetaData: {
                confidenceScore: 100.0,
                addressType: 'Domestic',
                deliveryPointValidation: 'CONFIRMED',
                residentialDeliveryIndicator: 'BUSINESS',
              },
            },
          ],
          confirmedSuggestions: [
            {
              addressLine1: '1600 Pennsylvania Ave NW',
              addressType: 'DOMESTIC',
              city: 'Washington',
              countryName: 'United States',
              countryCodeIso3: 'USA',
              countyCode: '11001',
              countyName: 'District of Columbia',
              stateCode: 'DC',
              zipCode: '20500',
              zipCodeSuffix: '0005',
              addressMetaData: {
                confidenceScore: 100.0,
                addressType: 'Domestic',
                deliveryPointValidation: 'CONFIRMED',
                residentialDeliveryIndicator: 'BUSINESS',
              },
            },
            {
              addressLine1: '1600 Pennsylvania Ave NW',
              addressType: 'DOMESTIC',
              city: 'Washington',
              countryName: 'United States',
              countryCodeIso3: 'USA',
              countyCode: '11001',
              countyName: 'District of Columbia',
              stateCode: 'DC',
              zipCode: '20502',
              zipCodeSuffix: '0001',
              addressMetaData: {
                confidenceScore: 100.0,
                addressType: 'Domestic',
                deliveryPointValidation: 'CONFIRMED',
                residentialDeliveryIndicator: 'BUSINESS',
              },
            },
          ],
        },
      },
    };

    it('renders correct labels, buttons, and 2 radio buttons for suggested addresses when validationKey is null', () => {
      const newStore = mockStore({
        ...baseStore,
        vapService: {
          ...baseStore.vapService,
          addressValidation: {
            ...baseStore.vapService.addressValidation,
            validationKey: null,
          },
        },
      });

      const { container, getAllByRole, getByText, getAllByText } = render(
        <Provider store={newStore}>
          <AddressValidationView store={newStore} />
        </Provider>,
      );

      expect(getByText('You entered:')).to.exist;
      expect(getByText('Suggested Addresses:')).to.exist;

      const radios = getAllByRole('radio');
      expect(radios.length).to.equal(2);
      expect(radios[0].checked).to.be.true;
      expect(radios[1].checked).to.be.false;

      const instances = getAllByText('1600 Pennsylvania Ave NW');
      expect(instances.length).to.equal(2);
      expect(getByText('Washington, DC 20500')).to.exist;
      expect(getByText('Washington, DC 20502')).to.exist;

      expectButtons(container, [
        {
          type: 'submit',
          text: 'Use this address',
          dataTestId: 'confirm-address-button',
        },
        { text: 'Go back to edit', type: 'button' },
      ]);
    });

    it('renders 3 radio buttons when validationKey is present', () => {
      const newStoreWithKey = mockStore({
        ...baseStore,
        vapService: {
          ...baseStore.vapService,
          addressValidation: {
            ...baseStore.vapService.addressValidation,
            validationKey: 1234,
          },
        },
      });

      const { getAllByRole } = render(
        <Provider store={newStoreWithKey}>
          <AddressValidationView store={newStoreWithKey} />
        </Provider>,
      );

      const radios = getAllByRole('radio');
      expect(radios.length).to.equal(3);
    });

    it('renders the alert with the correct headline and message for NO validationKey and NO suggestedAddresses', () => {
      const newStoreWithoutSuggestions = mockStore({
        ...baseStore,
        featureToggles: {
          [TOGGLE_NAMES.profileShowNoValidationKeyAddressAlert]: true,
          profileShowNoValidationKeyAddressAlert: true,
        },
        isNoValidationKeyAlertEnabled: true,
        vapService: {
          ...baseStore.vapService,
          addressValidation: {
            ...baseStore.vapService.addressValidation,
            validationKey: null,
            suggestedAddresses: [],
            confirmedSuggestions: [],
          },
        },
      });

      const { container, getByRole, getByText } = render(
        <Provider store={newStoreWithoutSuggestions}>
          <AddressValidationView store={newStoreWithoutSuggestions} />
        </Provider>,
      );

      const alert = getByRole('alert');
      expect(alert).to.exist;

      // Validate the headline
      const headline = getByText('This address you entered is invalid');
      expect(headline).to.exist;

      // Validate the alert message
      const alertMessage = getByText(
        'We can’t confirm the address you entered with the U.S. Postal Service. You’ll need to go back to edit it.',
      );
      expect(alertMessage).to.exist;

      // Validate correct buttons are getting displayed
      expectButtons(container, [{ text: 'Go back to edit', type: 'button' }]);
    });

    it('renders the alert with the correct headline and message for NO validationKey and has suggestedAddresses', () => {
      const newStoreWithSingleSuggestion = mockStore({
        ...baseStore,
        featureToggles: { profileShowNoValidationKeyAddressAlert: true },
        isNoValidationKeyAlertEnabled: true,
        vapService: {
          ...baseStore.vapService,
          addressValidation: {
            ...baseStore.vapService.addressValidation,
            validationKey: null,
            suggestedAddresses: [
              {
                addressLine1: '1600 Pennsylvania Ave NW',
                addressType: 'DOMESTIC',
                city: 'Washington',
                countryName: 'United States',
                countryCodeIso3: 'USA',
                stateCode: 'DC',
                zipCode: '20500',
                zipCodeSuffix: '0005',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'BUSINESS',
                },
              },
            ],
            confirmedSuggestions: [
              {
                addressLine1: '1600 Pennsylvania Ave NW',
                addressType: 'DOMESTIC',
                city: 'Washington',
                countryName: 'United States',
                countryCodeIso3: 'USA',
                countyCode: '11001',
                countyName: 'District of Columbia',
                stateCode: 'DC',
                zipCode: '20500',
                zipCodeSuffix: '0005',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'BUSINESS',
                },
              },
            ],
          },
        },
      });

      const { container, getByRole, getByText } = render(
        <Provider store={newStoreWithSingleSuggestion}>
          <AddressValidationView store={newStoreWithSingleSuggestion} />
        </Provider>,
      );

      const alert = getByRole('alert');
      expect(alert).to.exist;

      // Validate the headline
      const headline = getByText(
        'We can’t confirm the address you entered with the U.S. Postal Service',
      );
      expect(headline).to.exist;

      // Validate the alert message
      const alertMessage = getByText(
        'We can use the suggested address we found. Or, you can go back to edit the address you entered.',
      );
      expect(alertMessage).to.exist;

      // Validate correct buttons are getting displayed
      expectButtons(container, [
        { text: 'Use suggested address', type: 'submit' },
        { text: 'Go back to edit', type: 'button' },
      ]);
    });
  });
});
