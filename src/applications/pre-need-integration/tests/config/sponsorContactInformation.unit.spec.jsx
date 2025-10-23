import { expect } from 'chai';
import sinon from 'sinon';
import {
  uiSchema,
  isRequired,
} from '../../config/pages/sponsorContactInformation';
import * as helpers from '../../utils/helpers';

describe('isRequired', () => {
  it('should return true if street is defined', () => {
    const formData = {
      application: { veteran: { address: { street: '123 Cowabunga St' } } },
    };
    expect(isRequired(formData)).to.be.true;
  });

  it('should return true if street2 is defined', () => {
    const formData = {
      application: { veteran: { address: { street2: 'Apt 404' } } },
    };
    expect(isRequired(formData)).to.be.true;
  });

  it('should return true if city is defined', () => {
    const formData = {
      application: { veteran: { address: { city: 'Gotham' } } },
    };
    expect(isRequired(formData)).to.be.true;
  });

  it('should return true if state is defined', () => {
    const formData = { application: { veteran: { address: { state: 'TN' } } } };
    expect(isRequired(formData)).to.be.true;
  });

  it('should return true if postalCode is defined', () => {
    const formData = {
      application: { veteran: { address: { postalCode: '62704' } } },
    };
    expect(isRequired(formData)).to.be.true;
  });

  it('should return false if no address fields are defined', () => {
    const formData = { application: { veteran: { address: {} } } };
    expect(isRequired(formData)).to.be.false;
  });

  it('should return false if application is undefined', () => {
    const formData = {};
    expect(isRequired(formData)).to.be.false;
  });
});

describe('uiSchema', () => {
  let sponsorMailingAddressHasStateStub;

  beforeEach(() => {
    sponsorMailingAddressHasStateStub = sinon.stub(
      helpers,
      'sponsorMailingAddressHasState',
    );
  });

  afterEach(() => {
    sponsorMailingAddressHasStateStub.restore();
  });

  it('should hide state field if sponsorMailingAddressHasState returns false', () => {
    sponsorMailingAddressHasStateStub.returns(false);
    const formData = {
      application: { veteran: { address: { country: 'USA' } } },
    };
    const { hideIf } = uiSchema.application.veteran.address.state['ui:options'];
    expect(hideIf(formData)).to.be.true;
  });

  it('should show state field if sponsorMailingAddressHasState returns true', () => {
    sponsorMailingAddressHasStateStub.returns(true);
    const formData = {
      application: { veteran: { address: { country: 'USA' } } },
    };
    const { hideIf } = uiSchema.application.veteran.address.state['ui:options'];
    expect(hideIf(formData)).to.be.false;
  });
});
