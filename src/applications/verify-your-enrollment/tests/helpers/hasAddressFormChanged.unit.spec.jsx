import { expect } from 'chai';
import { hasAddressFormChanged } from '../../helpers';

describe('hasAddressFormChanged', () => {
  const initialState = {
    addressLine1: undefined,
    addressLine2: undefined,
    addressLine3: undefined,
    addressLine4: undefined,
    city: undefined,
    countryCodeIso3: 'USA',
    internationalPostalCode: undefined,
    province: undefined,
    stateCode: '- Select -',
    'view:livesOnMilitaryBase': undefined,
    'view:livesOnMilitaryBaseInfo': {},
    zipCode: undefined,
  };

  it('should return false when the state has not changed', () => {
    const currentState = {
      ...initialState,
    };

    expect(hasAddressFormChanged(currentState)).to.be.false;
  });

  it('should return true when the state has changed', () => {
    const currentState = {
      ...initialState,
      addressLine1: '123 Main St',
    };

    expect(hasAddressFormChanged(currentState)).to.be.true;
  });

  it('should ignore "view:livesOnMilitaryBase" and "view:livesOnMilitaryBaseInfo" changes', () => {
    const currentState = {
      ...initialState,
      'view:livesOnMilitaryBase': true,
      'view:livesOnMilitaryBaseInfo': { someInfo: 'test' },
    };

    expect(hasAddressFormChanged(currentState)).to.be.false;
  });

  it('should return true when there are both ignored and non-ignored changes', () => {
    const currentState = {
      ...initialState,
      addressLine1: '123 Main St',
      'view:livesOnMilitaryBase': true,
      'view:livesOnMilitaryBaseInfo': { someInfo: 'test' },
    };

    expect(hasAddressFormChanged(currentState)).to.be.true;
  });

  it('should use initialState.stateCode if currentState.stateCode is undefined', () => {
    const currentState = {
      ...initialState,
      stateCode: undefined,
    };

    expect(hasAddressFormChanged(currentState)).to.be.false;
  });

  it('should return true if currentState.stateCode is different from initialState.stateCode', () => {
    const currentState = {
      ...initialState,
      stateCode: 'CA',
    };

    expect(hasAddressFormChanged(currentState)).to.be.true;
  });
});
