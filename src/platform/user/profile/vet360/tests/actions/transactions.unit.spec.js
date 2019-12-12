import {
  validateAddress,
  ADDRESS_VALIDATION_CONFIRM,
} from '../../actions/transactions';
import sinon from 'sinon';
import { expect } from 'chai';

import { mockApiRequest } from 'platform/testing/unit/helpers.js';

const route = 'foo';
const method = 'PUT';
const fieldName = { value: 'mailingAddress' };
const payload = {
  id: 123,
  addressLine1: '1493 Martin Luther King Rd',
  addressLine2: 'string',
  addressLine3: 'string',
  addressType: 'DOMESTIC',
  city: 'Fulton',
  countryName: 'United States',
  stateCode: 'NY',
  zipCode: '97062',
  addressPou: 'CORRESPONDENCE',
};
const analyticsSectionName = 'bar';

describe('validateAddress', () => {
  it('verify return data', () => {
    const dispatch = sinon.spy();
    const mockReturn = {
      addresses: [
        {
          address: {
            addressLine1: '400 N 65th St',
            addressType: 'DOMESTIC',
            city: 'Seattle',
            countryName: 'USA',
            countryCodeIso3: 'USA',
            countyCode: '53033',
            countyName: 'King',
            stateCode: 'WA',
            zipCode: '98103',
            zipCodeSuffix: '5252',
          },
          addressMetaData: {
            confidenceScore: 100.0,
            addressType: 'Domestic',
            deliveryPointValidation: 'UNDELIVERABLE',
          },
        },
        {
          address: {
            addressLine1: '400 NW 65th St',
            addressType: 'DOMESTIC',
            city: 'Seattle',
            countryName: 'USA',
            countryCodeIso3: 'USA',
            countyCode: '53033',
            countyName: 'King',
            stateCode: 'WA',
            zipCode: '98117',
            zipCodeSuffix: '5026',
          },
          addressMetaData: {
            confidenceScore: 100.0,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
        {
          address: {
            addressLine1: '400 NW 65th St',
            addressType: 'DOMESTIC',
            city: 'Seattle',
            countryName: 'USA',
            countryCodeIso3: 'USA',
            countyCode: '53033',
            countyName: 'King',
            stateCode: 'WA',
            zipCode: '98117',
            zipCodeSuffix: '5026',
          },
          addressMetaData: {
            confidenceScore: 100.0,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
        {
          address: {
            addressLine1: '400 NE 65th St',
            addressType: 'DOMESTIC',
            city: 'Seattle',
            countryName: 'USA',
            countryCodeIso3: 'USA',
            countyCode: '53033',
            countyName: 'King',
            stateCode: 'WA',
            zipCode: '98115',
            zipCodeSuffix: '6463',
          },
          addressMetaData: {
            confidenceScore: 98.0,
            addressType: 'Domestic',
            deliveryPointValidation:
              'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
        },
      ],
      validationKey: 178464079,
    };
    mockApiRequest(mockReturn);
    return validateAddress(
      route,
      method,
      fieldName,
      payload,
      analyticsSectionName,
    )(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        ADDRESS_VALIDATION_CONFIRM,
      );
      expect(dispatch.firstCall.args[0].suggestedAddresses).to.deep.equal([
        {
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'UNDELIVERABLE',
          },
          addressLine1: '400 N 65th St',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'USA',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98103',
          zipCodeSuffix: '5252',
          type: 'DOMESTIC',
          addressPou: 'RESIDENCE/CHOICE',
        },
        {
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
          addressLine1: '400 NW 65th St',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'USA',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98117',
          zipCodeSuffix: '5026',
          type: 'DOMESTIC',
          addressPou: 'RESIDENCE/CHOICE',
        },
        {
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
          addressLine1: '400 NW 65th Street',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'USA',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98117',
          zipCodeSuffix: '5026',
          type: 'DOMESTIC',
          addressPou: 'RESIDENCE/CHOICE',
        },
        {
          addressMetaData: {
            confidenceScore: 98,
            addressType: 'Domestic',
            deliveryPointValidation:
              'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
          addressLine1: '400 NE 65th St',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'USA',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98115',
          zipCodeSuffix: '6463',
          type: 'DOMESTIC',
          addressPou: 'RESIDENCE/CHOICE',
        },
      ]);
    });
  });
});
