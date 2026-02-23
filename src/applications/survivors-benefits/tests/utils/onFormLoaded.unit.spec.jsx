import { expect } from 'chai';
import sinon from 'sinon';
import { onFormLoaded } from '../../utils/onFormLoaded';

describe('validateInternationalPhoneNumbers', () => {
  const router = { push: sinon.spy() };
  it('should transform formData properly with title case', () => {
    const formData = {
      claimantPhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '5551113333',
        IsValid: true,
        Error: null,
        Touched: true,
        Required: true,
      },
    };
    onFormLoaded({ formData, router, returnUrl: '/test' });
    expect(router.push.calledWith('/test')).to.be.true;
    expect(formData).to.deep.equal({
      claimantPhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '5551113333',
        IsValid: true,
        Error: null,
        Touched: true,
        Required: true,
        _isValid: true,
        _error: null,
        _touched: true,
        _required: true,
      },
    });
  });

  it('should transform formData properly with lowercase', () => {
    const formData = {
      claimantPhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '5551113333',
        isValid: true,
        error: null,
        touched: true,
        required: true,
      },
    };
    onFormLoaded({ formData, router, returnUrl: '/test' });
    expect(router.push.calledWith('/test')).to.be.true;
    expect(formData).to.deep.equal({
      claimantPhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '5551113333',
        isValid: true,
        error: null,
        touched: true,
        required: true,
        _isValid: true,
        _error: null,
        _touched: true,
        _required: true,
      },
    });
  });

  it('should not change the data if contact does not exist', () => {
    const formData = {
      claimantPhone: {
        callingCode: 1,
        countryCode: 'US',
        // contact is missing
        IsValid: true,
        Error: null,
        Touched: true,
        Required: true,
      },
    };
    onFormLoaded({ formData, router, returnUrl: '/test' });
    expect(router.push.calledWith('/test')).to.be.true;
    expect(formData).to.deep.equal({
      claimantPhone: {
        callingCode: 1,
        countryCode: 'US',
        // contact is still missing
        IsValid: true,
        Error: null,
        Touched: true,
        Required: true,
      },
    });
  });

  it('should not change the data if claimant phone is not an object', () => {
    const formData = {
      claimantPhone: '555-111-3333',
    };
    onFormLoaded({ formData, router, returnUrl: '/test' });
    expect(router.push.calledWith('/test')).to.be.true;
    expect(formData).to.deep.equal({
      claimantPhone: '555-111-3333',
    });
  });
  it('should not change the data if claimant phone is undefined', () => {
    const formData = {};
    onFormLoaded({ formData, router, returnUrl: '/test' });
    expect(router.push.calledWith('/test')).to.be.true;
    expect(formData).to.deep.equal({});
  });
  it('should not change the data if claimant phone is correct', () => {
    const formData = {
      claimantPhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '5551113333',
        _isValid: true,
        _error: null,
        _touched: true,
        _required: true,
      },
    };
    onFormLoaded({ formData, router, returnUrl: '/test' });
    expect(router.push.calledWith('/test')).to.be.true;
    expect(formData).to.deep.equal({
      claimantPhone: {
        callingCode: 1,
        countryCode: 'US',
        contact: '5551113333',
        _isValid: true,
        _error: null,
        _touched: true,
        _required: true,
      },
    });
  });
});
