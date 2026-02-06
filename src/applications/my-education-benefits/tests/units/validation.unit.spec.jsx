import { expect } from 'chai';
import sinon from 'sinon';
import { validateMilitaryBaseConsistency } from '../../utils/validation';

describe('validateMilitaryBaseConsistency', () => {
  let errors;

  beforeEach(() => {
    errors = {
      address: {
        city: { addError: sinon.spy() },
        state: { addError: sinon.spy() },
        country: { addError: sinon.spy() },
      },
    };
  });

  it('returns early when address data is missing', () => {
    const mailingAddressData = { livesOnMilitaryBase: false, address: null };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.called).to.be.false;
  });

  it('shows error when military address used without military base checkbox', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: false,
      address: { city: 'APO', state: 'AE', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.calledOnce).to.be.true;
    expect(errors.address.state.addError.calledOnce).to.be.true;

    // Verify the error message content
    expect(errors.address.city.addError.firstCall.args[0]).to.contain(
      "Military addresses require the 'I live on a United States military base outside of the Country' checkbox to be selected.",
    );
    expect(errors.address.state.addError.firstCall.args[0]).to.contain(
      "Military addresses require the 'I live on a United States military base outside of the Country' checkbox to be selected.",
    );
  });

  it('shows error when civilian address used with military base checkbox', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: true,
      address: { city: 'Austin', state: 'TX', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.calledOnce).to.be.true;
    expect(errors.address.state.addError.calledOnce).to.be.true;
  });

  it('shows error when non-USA country used with military base checkbox', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: true,
      address: { city: 'APO', state: 'AE', country: 'CAN' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.country.addError.calledOnce).to.be.true;
  });

  it('passes validation for correct military address', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: true,
      address: { city: 'APO', state: 'AE', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.called).to.be.false;
    expect(errors.address.state.addError.called).to.be.false;
  });

  it('passes validation for correct civilian address', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: false,
      address: { city: 'Austin', state: 'TX', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.called).to.be.false;
    expect(errors.address.state.addError.called).to.be.false;
  });

  it('includes DPO option in error message', () => {
    const mailingAddressData = {
      livesOnMilitaryBase: true,
      address: { city: 'Austin', state: 'TX', country: 'USA' },
    };
    validateMilitaryBaseConsistency(errors, mailingAddressData, {});
    expect(errors.address.city.addError.calledOnce).to.be.true;
    expect(errors.address.city.addError.firstCall.args[0]).to.contain('or DPO');
  });

  it('validates all military postal and state codes correctly', () => {
    const militaryCities = ['APO', 'FPO', 'DPO'];
    const militaryStates = ['AE', 'AA', 'AP'];

    militaryCities.forEach(city => {
      const mailingAddressData = {
        livesOnMilitaryBase: false,
        address: { city, state: 'NY', country: 'USA' },
      };
      const testErrors = {
        address: {
          city: { addError: sinon.spy() },
          state: { addError: sinon.spy() },
        },
      };
      validateMilitaryBaseConsistency(testErrors, mailingAddressData, {});
      expect(testErrors.address.city.addError.calledOnce).to.be.true;
      expect(testErrors.address.city.addError.firstCall.args[0]).to.contain(
        "Military addresses require the 'I live on a United States military base outside of the Country' checkbox to be selected.",
      );
    });

    militaryStates.forEach(state => {
      const mailingAddressData = {
        livesOnMilitaryBase: false,
        address: { city: 'Austin', state, country: 'USA' },
      };
      const testErrors = {
        address: {
          city: { addError: sinon.spy() },
          state: { addError: sinon.spy() },
        },
      };
      validateMilitaryBaseConsistency(testErrors, mailingAddressData, {});
      expect(testErrors.address.state.addError.calledOnce).to.be.true;
      expect(testErrors.address.state.addError.firstCall.args[0]).to.contain(
        "Military addresses require the 'I live on a United States military base outside of the Country' checkbox to be selected.",
      );
    });
  });
});
