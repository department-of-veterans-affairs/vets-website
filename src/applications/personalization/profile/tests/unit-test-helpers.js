import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import profile from '@@profile/reducers';
import connectedApps from '@@profile/components/connected-apps/reducers/connectedApps';

export function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

/**
 * A custom React Testing Library render function that allows for easy rendering
 * of Profile-related components. This helper sets up the reducers used by the
 * Profile application, as shown in the profile entry file
 * src/applications/personalization/profile/profile-entry.jsx
 */
export function renderWithProfileReducers(
  ui,
  { initialState = {}, reducers = {}, ...renderOptions } = {},
) {
  return renderInReduxProvider(ui, {
    reducers: { ...profile, connectedApps, ...reducers },
    initialState,
    ...renderOptions,
  });
}

// Creates a good baseline value for the user.profile.vapContactInfo part of Redux
export function getBasicContactInfoState() {
  return {
    email: {
      createdAt: '2020-07-30T23:38:04.000+00:00',
      emailAddress: 'me@me.com',
      effectiveEndDate: null,
      effectiveStartDate: '2020-07-30T23:38:03.000+00:00',
      id: 115097,
      sourceDate: '2020-07-30T23:38:03.000+00:00',
      sourceSystemUser: null,
      transactionId: '604abf55-422b-4f51-b33d-9fb38b4daad1',
      updatedAt: '2020-07-30T23:38:04.000+00:00',
      vet360Id: '1273780',
    },
    residentialAddress: {
      addressLine1: '34 Blanchard Rd',
      addressLine2: null,
      addressLine3: null,
      addressPou: 'RESIDENCE/CHOICE',
      addressType: 'DOMESTIC',
      city: 'Shirley Mills',
      countryName: 'United States',
      countryCodeIso2: 'US',
      countryCodeIso3: 'USA',
      countryCodeFips: null,
      countyCode: '23021',
      countyName: 'Piscataquis County',
      createdAt: '2020-07-25T00:32:10.000+00:00',
      effectiveEndDate: null,
      effectiveStartDate: '2020-07-25T00:32:09.000+00:00',
      id: 185731,
      internationalPostalCode: null,
      province: null,
      sourceDate: '2020-07-25T00:32:09.000+00:00',
      sourceSystemUser: null,
      stateCode: 'ME',
      transactionId: '6bde244e-a92f-421f-a7dc-923fc85f4f5f',
      updatedAt: '2020-07-25T00:32:10.000+00:00',
      validationKey: null,
      vet360Id: '1273780',
      zipCode: '04485',
      zipCodeSuffix: '4413',
    },
    mailingAddress: {
      addressLine1: '8210 Doby Ln',
      addressLine2: null,
      addressLine3: null,
      addressPou: 'CORRESPONDENCE',
      addressType: 'DOMESTIC',
      city: 'Pasadena',
      countryName: 'United States',
      countryCodeIso2: 'US',
      countryCodeIso3: 'USA',
      countryCodeFips: null,
      countyCode: '24003',
      countyName: 'Anne Arundel County',
      createdAt: '2020-05-30T03:57:20.000+00:00',
      effectiveEndDate: null,
      effectiveStartDate: '2020-07-25T00:31:00.000+00:00',
      id: 173917,
      internationalPostalCode: null,
      province: null,
      sourceDate: '2020-07-25T00:31:00.000+00:00',
      sourceSystemUser: null,
      stateCode: 'MD',
      transactionId: '2ad2aef3-101a-4bc9-b7dc-2e7ce772c215',
      updatedAt: '2020-07-25T00:31:02.000+00:00',
      validationKey: null,
      vet360Id: '1273780',
      zipCode: '21122',
      zipCodeSuffix: '6706',
    },
    mobilePhone: {
      areaCode: '555',
      countryCode: '1',
      createdAt: '2020-07-25T00:34:24.000+00:00',
      extension: null,
      effectiveEndDate: null,
      effectiveStartDate: '2020-07-25T00:34:24.000+00:00',
      id: 155102,
      isInternational: false,
      isTextable: null,
      isTextPermitted: null,
      isTty: null,
      isVoicemailable: null,
      phoneNumber: '5555559',
      phoneType: 'MOBILE',
      sourceDate: '2020-07-25T00:34:24.000+00:00',
      sourceSystemUser: null,
      transactionId: '77ad4f31-2d1a-4aaa-a259-7f0cc8fb0357',
      updatedAt: '2020-07-25T00:34:24.000+00:00',
      vet360Id: '1273780',
    },
    homePhone: {
      areaCode: '804',
      countryCode: '1',
      createdAt: '2020-07-25T00:33:15.000+00:00',
      extension: '17747',
      effectiveEndDate: null,
      effectiveStartDate: '2020-07-25T00:33:14.000+00:00',
      id: 155101,
      isInternational: false,
      isTextable: null,
      isTextPermitted: null,
      isTty: null,
      isVoicemailable: null,
      phoneNumber: '2055544',
      phoneType: 'HOME',
      sourceDate: '2020-07-25T00:33:14.000+00:00',
      sourceSystemUser: null,
      transactionId: 'a7299f8e-1646-40f5-988d-61d0480c01dc',
      updatedAt: '2020-07-25T00:33:15.000+00:00',
      vet360Id: '1273780',
    },
    workPhone: {
      areaCode: '214',
      countryCode: '1',
      createdAt: '2020-07-25T00:33:51.000+00:00',
      extension: null,
      effectiveEndDate: null,
      effectiveStartDate: '2020-07-25T00:33:51.000+00:00',
      id: 155103,
      isInternational: false,
      isTextable: null,
      isTextPermitted: null,
      isTty: null,
      isVoicemailable: null,
      phoneNumber: '7182112',
      phoneType: 'WORK',
      sourceDate: '2020-07-25T00:33:51.000+00:00',
      sourceSystemUser: null,
      transactionId: 'b98371ec-bfd5-4724-89ee-3ea3c48dac81',
      updatedAt: '2020-07-25T00:33:51.000+00:00',
      vet360Id: '1273780',
    },
    temporaryPhone: null,
    faxNumber: null,
    textPermission: null,
  };
}

export function createBasicInitialState() {
  return {
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {
        get() {},
      },
      dismissedDowntimeWarnings: [],
    },
    vaProfile: {
      personalInformation: {
        gender: 'M',
        birthDate: '1986-05-06',
      },
    },
    user: {
      profile: {
        vapContactInfo: getBasicContactInfoState(),
        services: ['vet360'],
      },
    },
  };
}
