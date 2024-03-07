import sinon from 'sinon';
import { expect } from 'chai';
import {
  resetAddressValidation,
  validateAddress,
  updateValidationKeyAndSave,
  ADDRESS_VALIDATION_CONFIRM,
  ADDRESS_VALIDATION_INITIALIZE,
  ADDRESS_VALIDATION_RESET,
  ADDRESS_VALIDATION_UPDATE,
} from '../../actions/transactions';

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

describe('resetAddressValidation', () => {
  it('creates the correct action', () => {
    const action = resetAddressValidation();
    expect(action).to.deep.equal({ type: ADDRESS_VALIDATION_RESET });
  });
});

describe('validateAddress', () => {
  it.skip('verify return data', () => {
    const dispatch = sinon.spy();
    return validateAddress(
      route,
      method,
      fieldName,
      payload,
      analyticsSectionName,
    )(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        ADDRESS_VALIDATION_INITIALIZE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        ADDRESS_VALIDATION_CONFIRM,
      );
      expect(dispatch.secondCall.args[0].suggestedAddresses).to.deep.equal([
        {
          addressMetaData: {
            confidenceScore: 100,
            addressType: 'Domestic',
            deliveryPointValidation: 'UNDELIVERABLE',
          },
          addressLine1: '400 N 65th St',
          addressType: 'DOMESTIC',
          city: 'Seattle',
          countryName: 'United States',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98103',
          zipCodeSuffix: '5252',
          type: 'DOMESTIC',
          addressPou: 'RESIDENCE/CHOICE',
          id: 123,
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
          countryName: 'United States',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98117',
          zipCodeSuffix: '5026',
          type: 'DOMESTIC',
          addressPou: 'RESIDENCE/CHOICE',
          id: 123,
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
          countryName: 'United States',
          countryCodeIso3: 'USA',
          countyCode: '53033',
          countyName: 'King',
          stateCode: 'WA',
          zipCode: '98115',
          zipCodeSuffix: '6463',
          type: 'DOMESTIC',
          addressPou: 'RESIDENCE/CHOICE',
          id: 123,
        },
      ]);
    });
  });
});

describe('updateValidationKeyAndSave', () => {
  it.skip('verify return data', () => {
    const dispatch = sinon.spy();
    return updateValidationKeyAndSave(
      route,
      method,
      fieldName,
      payload,
      analyticsSectionName,
    )(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        ADDRESS_VALIDATION_UPDATE,
      );
    });
  });
});
