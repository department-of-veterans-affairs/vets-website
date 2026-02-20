import { expect } from 'chai';
import sinon from 'sinon';
import { onFormLoaded } from '../../../config/onFormLoaded';

describe('validateInternationalPhoneNumbers', () => {
  const router = { push: sinon.spy() };
  it('should transform formData properly with title case', () => {
    const formData = {
      primaryPhone: {
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
      primaryPhone: {
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
      primaryPhone: {
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
      primaryPhone: {
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
      primaryPhone: {
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
      primaryPhone: {
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

  it('should not change the data if primary phone is not an object', () => {
    const formData = {
      primaryPhone: '555-111-3333',
    };
    onFormLoaded({ formData, router, returnUrl: '/test' });
    expect(router.push.calledWith('/test')).to.be.true;
    expect(formData).to.deep.equal({
      primaryPhone: '555-111-3333',
    });
  });
  it('should not change the data if primary phone is undefined', () => {
    const formData = {};
    onFormLoaded({ formData, router, returnUrl: '/test' });
    expect(router.push.calledWith('/test')).to.be.true;
    expect(formData).to.deep.equal({});
  });
  it('should not change the data if primary phone is correct', () => {
    const formData = {
      primaryPhone: {
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
      primaryPhone: {
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
