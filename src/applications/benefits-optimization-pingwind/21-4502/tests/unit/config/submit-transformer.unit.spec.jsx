import { expect } from 'chai';
import sinon from 'sinon';
import transformForSubmit from '../../../config/submit-transformer';
import * as sharedTransformForSubmit from '../../../../shared/config/submit-transformer';

describe('21-4502 submit transformer', () => {
  const formConfig = { formId: '21-4502', chapters: {} };
  let sharedTransformStub;

  const runTransform = data => {
    sharedTransformStub.callsFake((config, formArg) =>
      JSON.stringify({
        ...formArg.data,
        formNumber: config.formId,
      }),
    );

    const transformedResult = transformForSubmit(formConfig, { data });
    const transformed = JSON.parse(transformedResult);

    expect(transformed.formNumber).to.equal('21-4502');
    expect(transformed.automobile_adaptive_claim).to.exist;
    expect(transformed.automobile_adaptive_claim.form).to.be.a('string');

    return JSON.parse(transformed.automobile_adaptive_claim.form);
  };

  before(() => {
    global.window = global.window || {};
  });

  beforeEach(() => {
    sharedTransformStub = sinon.stub(sharedTransformForSubmit, 'default');
  });

  afterEach(() => {
    sharedTransformStub.restore();
  });

  it('includes formNumber and automobile_adaptive_claim wrapper', () => {
    sharedTransformStub.callsFake((config, formArg) =>
      JSON.stringify({
        ...formArg.data,
        formNumber: config.formId,
      }),
    );

    const result = transformForSubmit(formConfig, { data: {} });
    const parsed = JSON.parse(result);

    expect(parsed.formNumber).to.equal('21-4502');
    expect(parsed.automobile_adaptive_claim).to.exist;
    expect(parsed.automobile_adaptive_claim.form).to.be.a('string');
  });

  it('formats veteran and application payload', () => {
    const payload = runTransform({
      veteran: {
        fullName: { first: 'Jane', middle: 'M', last: 'Doe' },
        ssn: '123456789',
        dateOfBirth: '1985-03-15',
        vaFileNumber: '12345678',
        veteranServiceNumber: '987654',
        address: {
          street: '123 Main St',
          street2: 'Apt 2',
          city: 'Springfield',
          state: 'VA',
          postalCode: '22150',
          country: 'US',
        },
        homePhone: { contact: '5551234567', countryCode: 'US' },
        email: 'jane@example.com',
      },
      applicationInfo: {
        branchOfService: 'army',
        activeDutyStatus: false,
        conveyanceType: 'automobile',
        previouslyAppliedConveyance: false,
        appliedDisabilityCompensation: true,
      },
      certifyLicensing: true,
      certifyNoPriorGrant: true,
    });

    expect(payload.veteranFullName).to.eql({
      first: 'Jane',
      middle: 'M',
      last: 'Doe',
    });
    expect(payload.veteranSocialSecurityNumber).to.equal('123456789');
    expect(payload.dateOfBirth).to.equal('1985-03-15');
    expect(payload.vaFileNumber).to.equal('12345678');
    expect(payload.veteranServiceNumber).to.equal('987654');
    expect(payload.veteranAddress).to.eql({
      street: '123 Main St',
      street2: 'Apt 2',
      city: 'Springfield',
      state: 'VA',
      postalCode: '22150',
      country: 'US',
    });
    expect(payload.email).to.equal('jane@example.com');
    expect(payload.branchOfService).to.equal('army');
    expect(payload.activeDutyStatus).to.equal(false);
    expect(payload.conveyanceType).to.equal('automobile');
    expect(payload.previouslyAppliedConveyance).to.equal(false);
    expect(payload.appliedDisabilityCompensation).to.equal(true);
    expect(payload.certifyLicensing).to.equal(true);
    expect(payload.certifyNoPriorGrant).to.equal(true);
  });

  it('prunes empty and whitespace-only values', () => {
    const payload = runTransform({
      veteran: {
        fullName: { first: 'Joe', middle: '', last: 'Smith' },
        ssn: '111223333',
        dateOfBirth: '1990-01-01',
        vaFileNumber: '   ',
        address: {
          street: '456 Oak Ave',
          city: 'Portland',
          state: 'OR',
          postalCode: '97201',
          country: 'US',
        },
        homePhone: { contact: '5035551234' },
      },
      applicationInfo: {
        branchOfService: 'navy',
        activeDutyStatus: false,
        conveyanceType: 'van',
        previouslyAppliedConveyance: false,
        appliedDisabilityCompensation: false,
      },
      certifyLicensing: true,
      certifyNoPriorGrant: true,
    });

    expect(payload.veteranFullName).to.exist;
    expect(payload.vaFileNumber).to.be.undefined;
    expect(payload.veteranAddress).to.exist;
    expect(payload.veteranAddress.street2).to.be.undefined;
  });

  it('includes optional vehicle receipt when provided', () => {
    const payload = runTransform({
      veteran: {
        fullName: { first: 'A', last: 'B' },
        ssn: '111223333',
        dateOfBirth: '1980-05-05',
        address: {
          street: '1 St',
          city: 'City',
          state: 'ST',
          postalCode: '00000',
          country: 'US',
        },
        homePhone: { contact: '5550000000' },
      },
      applicationInfo: {
        branchOfService: 'airForce',
        activeDutyStatus: false,
        conveyanceType: 'truck',
        previouslyAppliedConveyance: true,
        appliedDisabilityCompensation: true,
      },
      certifyLicensing: true,
      certifyNoPriorGrant: true,
      vehicleReceipt: {
        make: 'Toyota',
        model: 'Camry',
        year: '2023',
        vin: '1HGBH41JXMN109186',
        purchasePrice: '28000',
        dateOfSale: '2023-06-01',
        sellerName: 'Dealer Inc',
        hasDriversLicense: true,
      },
    });

    expect(payload.vehicleMake).to.equal('Toyota');
    expect(payload.vehicleModel).to.equal('Camry');
    expect(payload.vehicleYear).to.equal('2023');
    expect(payload.vehicleVin).to.equal('1HGBH41JXMN109186');
    expect(payload.purchasePrice).to.equal('28000');
    expect(payload.dateOfSale).to.equal('2023-06-01');
    expect(payload.sellerName).to.equal('Dealer Inc');
    expect(payload.hasDriversLicense).to.equal(true);
  });
});
