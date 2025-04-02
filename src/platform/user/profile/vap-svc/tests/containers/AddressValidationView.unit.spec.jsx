import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import { createStore } from 'redux';
import AddressValidationView from '../../containers/AddressValidationView';

const baseData = {
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
      addressValidationError: '',
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
};
const getStore = data => createStore(() => data);
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
  it('renders VaAlert component and address elements in AddressValidationView component', async () => {
    const { getByRole, getByText, getByTestId } = render(
      <Provider store={getStore(baseData)}>
        <AddressValidationView />
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
      <Provider store={getStore(baseData)}>
        <AddressValidationView />
      </Provider>,
    );

    expectButtons(container, [
      {
        type: 'submit',
        text: 'Use address you entered',
        dataTestId: 'confirm-address-button',
      },
      { text: 'Edit address', type: 'button' },
    ]);
  });

  it('renders suggest address as label when only one suggested address is present', () => {
    const newData = {
      vapService: {
        ...baseData.vapService,
        fieldTransactionMap: {
          mailingAddress: {
            isPending: false,
          },
        },
        addressValidation: {
          ...baseData.vapService.addressValidation,
          validationKey: 1234,
          selectedAddressId: '0',
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
    };

    const { getAllByRole } = render(
      <Provider store={getStore(newData)}>
        <AddressValidationView />
      </Provider>,
    );

    const labels = getAllByRole('label');
    expect(labels[1]).to.have.attribute('label', 'Suggested address:');
  });

  it('renders two primary va-button components with correct text when no validationKey and suggestedAddress are present', () => {
    const newData = {
      vapService: {
        ...baseData.vapService,
        addressValidation: {
          ...baseData.vapService.addressValidation,
          confirmedSuggestions: [],
          suggestedAddresses: [],
          validationKey: null,
        },
      },
    };

    const { container } = render(
      <Provider store={getStore(newData)}>
        <AddressValidationView />
      </Provider>,
    );

    expectButtons(container, [
      { text: 'Edit Address', type: 'submit' },
      { text: 'Edit address', type: 'button' },
    ]);
  });

  it('does not render Go back to edit button while pending transaction', () => {
    const newData = {
      vapService: {
        ...baseData.vapService,
        fieldTransactionMap: {
          mailingAddress: {
            isPending: true,
          },
        },
        addressValidation: {
          ...baseData.vapService.addressValidation,
          validationKey: null,
        },
      },
    };

    const { container } = render(
      <Provider store={getStore(newData)}>
        <AddressValidationView />
      </Provider>,
    );

    expectButtons(container, [{ text: 'Edit Address', type: 'submit' }]);
  });

  it('renders "Use suggested address" button when a suggested address is selected', () => {
    const newData = {
      vapService: {
        ...baseData.vapService,
        fieldTransactionMap: {
          mailingAddress: {
            isPending: false,
          },
        },
        addressValidation: {
          ...baseData.vapService.addressValidation,
          validationKey: null,
          selectedAddressId: '0',
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
    };

    const { container } = render(
      <Provider store={getStore(newData)}>
        <AddressValidationView />
      </Provider>,
    );

    expectButtons(container, [
      {
        type: 'submit',
        text: 'Use suggested address',
        dataTestId: 'confirm-address-button',
      },
      { text: 'Edit address', type: 'button' },
    ]);
  });

  describe('AddressValidationView with TWO suggestions', () => {
    it('renders correct labels, buttons, and 2 radio buttons for suggested addresses when validationKey is null', async () => {
      const newData = {
        vapService: {
          ...baseData.vapService,
          addressValidation: {
            ...baseData.vapService.addressValidation,
            validationKey: null,
            selectedAddressId: '0',
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

      const { container, getAllByRole, getAllByTestId } = render(
        <Provider store={getStore(newData)}>
          <AddressValidationView />
        </Provider>,
      );

      const labels = getAllByRole('label');
      expect(labels[0]).to.have.attribute('label', 'Suggested addresses:');

      const radios = getAllByTestId('suggestedAddressOption');

      expect(radios.length).to.equal(2);

      expect(radios[0]).to.have.attribute('checked', 'true');
      expect(radios[1]).to.have.attribute('checked', 'false');

      expect(radios[0]).to.have.attribute(
        'label',
        '1600 Pennsylvania Ave NW\nWashington, DC 20500',
      );
      expect(radios[1]).to.have.attribute(
        'label',
        '1600 Pennsylvania Ave NW\nWashington, DC 20502',
      );

      expectButtons(container, [
        {
          type: 'submit',
          text: 'Use address you entered',
          dataTestId: 'confirm-address-button',
        },
        { text: 'Edit address', type: 'button' },
      ]);
    });

    it('renders 3 radio buttons when validationKey is present', () => {
      const newData = {
        vapService: {
          ...baseData.vapService,
          addressValidation: {
            ...baseData.vapService.addressValidation,
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
            validationKey: 1234,
          },
        },
      };
      const { getAllByTestId } = render(
        <Provider store={getStore(newData)}>
          <AddressValidationView />
        </Provider>,
      );
      const userEnteredAddressOption = getAllByTestId(
        'userEnteredAddressOption',
      );
      expect(userEnteredAddressOption.length).to.equal(1);
      const suggestedAddressOption = getAllByTestId('suggestedAddressOption');
      expect(suggestedAddressOption.length).to.equal(2);
    });

    it('renders the alert with the correct headline and message for NO validationKey and NO suggestedAddresses', () => {
      const newData = {
        featureToggles: {
          [TOGGLE_NAMES.profileShowNoValidationKeyAddressAlert]: true,
          profileShowNoValidationKeyAddressAlert: true,
        },
        isNoValidationKeyAlertEnabled: true,
        vapService: {
          ...baseData.vapService,
          addressValidation: {
            ...baseData.vapService.addressValidation,
            confirmedSuggestions: [],
            suggestedAddresses: [],
            validationKey: null,
          },
        },
      };
      const { container, getByRole, getByText } = render(
        <Provider store={getStore(newData)}>
          <AddressValidationView />
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
      expectButtons(container, [{ text: 'Edit address', type: 'button' }]);
    });

    it('renders the alert with the correct headline and message for NO validationKey and has suggestedAddresses', () => {
      const newData = {
        featureToggles: { profileShowNoValidationKeyAddressAlert: true },
        isNoValidationKeyAlertEnabled: true,
        vapService: {
          ...baseData.vapService,
          addressValidation: {
            ...baseData.vapService.addressValidation,
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
      };

      const { container, getByRole, getByText } = render(
        <Provider store={getStore(newData)}>
          <AddressValidationView />
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
        { text: 'Edit address', type: 'button' },
      ]);
    });
  });
});
