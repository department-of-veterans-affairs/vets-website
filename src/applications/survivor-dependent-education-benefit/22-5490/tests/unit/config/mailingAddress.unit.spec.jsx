import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../config/form';

const mailingAddressPage =
  formConfig.chapters.contactInformationChapter.pages.mailingAddress;

const getUpdateSchema = () =>
  mailingAddressPage.uiSchema.mailingAddressInput.address['ui:options']
    .updateSchema;

const getCustomValidateAddress = () =>
  mailingAddressPage.uiSchema.mailingAddressInput.address['ui:validations'][0];

const baseAddressSchema = {
  required: ['street', 'city', 'postalCode'],
  properties: {
    country: { type: 'string' },
    street: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    postalCode: { type: 'string' },
  },
};

describe('22-5490 mailingAddress updateSchema', () => {
  const updateSchema = getUpdateSchema();

  it('should include state as required for USA', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: false,
        address: { country: 'USA' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.required).to.include('state');
  });

  it('should include state as required for CAN', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: false,
        address: { country: 'CAN' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.required).to.include('state');
  });

  it('should include state as required for MEX', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: false,
        address: { country: 'MEX' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.required).to.include('state');
  });

  it('should not include state as required for other countries', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: false,
        address: { country: 'GBR' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.required).to.not.include('state');
  });

  it('should return Province title for CAN', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: false,
        address: { country: 'CAN' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.properties.state.title).to.equal('Province');
    expect(result.properties.state.enum).to.be.an('array').that.is.not.empty;
  });

  it('should return State title for MEX', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: false,
        address: { country: 'MEX' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.properties.state.title).to.equal('State');
    expect(result.properties.state.enum).to.be.an('array').that.is.not.empty;
  });

  it('should return USA state enum for USA', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: false,
        address: { country: 'USA' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.properties.state.enum).to.include('CA');
    expect(result.properties.state.enum).to.include('NY');
  });

  it('should return AE/AA/AP for military base', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: true,
        address: { country: 'USA' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.properties.state.enum).to.deep.equal(['AE', 'AA', 'AP']);
    expect(result.properties.state.title).to.equal('AE/AA/AP');
  });

  it('should return generic State/County/Province title for other countries', () => {
    const formData = {
      mailingAddressInput: {
        livesOnMilitaryBase: false,
        address: { country: 'GBR' },
      },
    };
    const result = updateSchema(formData, { ...baseAddressSchema });
    expect(result.properties.state.title).to.equal('State/County/Province');
    expect(result.properties.state.enum).to.be.undefined;
  });
});

describe('22-5490 customValidateAddress', () => {
  const customValidateAddress = getCustomValidateAddress();
  let errors;

  beforeEach(() => {
    errors = {
      state: { addError: sinon.spy() },
      postalCode: { addError: sinon.spy() },
    };
  });

  describe('military zip code validation', () => {
    it('should accept valid AE zip code (09xxx)', () => {
      const addressData = { state: 'AE', postalCode: '09123', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.called).to.be.false;
    });

    it('should accept valid AA zip code (340xx)', () => {
      const addressData = { state: 'AA', postalCode: '34012', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.called).to.be.false;
    });

    it('should accept valid AP zip code (96[2-6]xx)', () => {
      const addressData = { state: 'AP', postalCode: '96234', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.called).to.be.false;
    });

    it('should reject invalid AE zip code', () => {
      const addressData = { state: 'AE', postalCode: '12345', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.calledOnce).to.be.true;
      expect(errors.postalCode.addError.firstCall.args[0]).to.contain(
        'valid zip code for AE',
      );
    });

    it('should reject invalid AA zip code', () => {
      const addressData = { state: 'AA', postalCode: '12345', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.calledOnce).to.be.true;
    });

    it('should reject invalid AP zip code', () => {
      const addressData = { state: 'AP', postalCode: '12345', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.calledOnce).to.be.true;
    });

    it('should reject AP zip code outside 962-966 range', () => {
      const addressData = { state: 'AP', postalCode: '96700', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.calledOnce).to.be.true;
    });

    it('should not validate military zip when state is not military', () => {
      const addressData = { state: 'CA', postalCode: '90210', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.called).to.be.false;
    });

    it('should not validate military zip when postalCode is empty', () => {
      const addressData = { state: 'AE', postalCode: '', country: 'USA' };
      customValidateAddress(errors, addressData, {}, { required: [] });
      expect(errors.postalCode.addError.called).to.be.false;
    });
  });

  describe('state required for CAN and MEX', () => {
    it('should require state for CAN', () => {
      const addressData = {
        country: 'CAN',
        state: undefined,
        postalCode: 'K1A0B1',
      };
      customValidateAddress(errors, addressData, {}, { required: ['state'] });
      expect(errors.state.addError.calledOnce).to.be.true;
    });

    it('should require state for MEX', () => {
      const addressData = {
        country: 'MEX',
        state: undefined,
        postalCode: '01000',
      };
      customValidateAddress(errors, addressData, {}, { required: ['state'] });
      expect(errors.state.addError.calledOnce).to.be.true;
    });
  });
});
