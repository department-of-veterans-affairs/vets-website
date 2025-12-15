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
      overrideValidationKey: 1234,
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
function expectVaButtons(container, expectedButtons) {
  const vaButtons = container.querySelectorAll('va-button');
  expect(vaButtons.length).to.equal(expectedButtons.length);
  expectedButtons.forEach((expectedButton, index) => {
    const vaButton = vaButtons[index];
    expect(vaButton).to.have.attribute('text', expectedButton.text);
    if (expectedButton.submit) {
      expect(vaButton).to.have.attribute('submit', expectedButton.submit);
    }
    if (expectedButton.dataTestId) {
      expect(vaButton).to.have.attribute(
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

    expectVaButtons(container, [
      {
        submit: 'prevent',
        text: 'Use address you entered',
        dataTestId: 'confirm-address-button',
      },
      { text: 'Edit' },
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
          overrideValidationKey: 1234,
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

    const { getAllByTestId } = render(
      <Provider store={getStore(newData)}>
        <AddressValidationView />
      </Provider>,
    );

    const labels = getAllByTestId('va-radio-label');
    expect(labels[1]).to.have.attribute('label', 'Suggested address:');
  });

  it('renders two primary va-button components with correct text when no overrideValidationKey and suggestedAddress are present', () => {
    const newData = {
      vapService: {
        ...baseData.vapService,
        addressValidation: {
          ...baseData.vapService.addressValidation,
          confirmedSuggestions: [],
          suggestedAddresses: [],
          overrideValidationKey: null,
        },
      },
    };

    const { container } = render(
      <Provider store={getStore(newData)}>
        <AddressValidationView />
      </Provider>,
    );

    expectVaButtons(container, [{ text: 'Edit' }, { text: 'Edit' }]);
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
          overrideValidationKey: null,
        },
      },
    };

    const { container } = render(
      <Provider store={getStore(newData)}>
        <AddressValidationView />
      </Provider>,
    );

    expectVaButtons(container, [{ text: 'Edit' }]);
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
          overrideValidationKey: null,
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

    expectVaButtons(container, [
      {
        submit: 'prevent',
        text: 'Use suggested address',
        dataTestId: 'confirm-address-button',
      },
      { text: 'Edit' },
    ]);
  });

  describe('AddressValidationView with TWO suggestions', () => {
    it('renders correct labels, buttons, and 2 radio buttons for suggested addresses when overrideValidationKey is null', async () => {
      const newData = {
        vapService: {
          ...baseData.vapService,
          addressValidation: {
            ...baseData.vapService.addressValidation,
            overrideValidationKey: null,
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

      const { container, getAllByTestId } = render(
        <Provider store={getStore(newData)}>
          <AddressValidationView />
        </Provider>,
      );

      const labels = getAllByTestId('va-radio-label');
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

      expectVaButtons(container, [
        {
          submit: 'prevent',
          text: 'Use address you entered',
          dataTestId: 'confirm-address-button',
        },
        { text: 'Edit' },
      ]);
    });

    it('renders 3 radio buttons when overrideValidationKey is present', () => {
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
            overrideValidationKey: 1234,
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

    it('renders the alert with the correct headline and message for NO overrideValidationKey and NO suggestedAddresses', () => {
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
            overrideValidationKey: null,
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
      expectVaButtons(container, [{ text: 'Edit' }, { text: 'Edit' }]);
    });

    it('renders the alert with the correct headline and message for NO overrideValidationKey and has suggestedAddresses', () => {
      const newData = {
        featureToggles: { profileShowNoValidationKeyAddressAlert: true },
        isNoValidationKeyAlertEnabled: true,
        vapService: {
          ...baseData.vapService,
          addressValidation: {
            ...baseData.vapService.addressValidation,
            overrideValidationKey: null,
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
      expectVaButtons(container, [
        { text: 'Use suggested address', submit: 'prevent' },
        { text: 'Edit' },
      ]);
    });
  });
});
