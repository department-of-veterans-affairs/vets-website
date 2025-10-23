import { expect } from 'chai';
import { formIs2122 } from '../../utilities/helpers';

describe('formIs2122', () => {
  it('should return true if rep.attributes.individualType is "veteran_service_officer"', () => {
    const rep = {
      type: 'individual',
      attributes: { individualType: 'veteran_service_officer' },
    };
    expect(formIs2122(rep)).to.be.true;
  });

  it('should return true if rep.attributes.individualType is "representative"', () => {
    const rep = {
      type: 'individual',
      attributes: { individualType: 'representative' },
    };
    expect(formIs2122(rep)).to.be.true;
  });

  it('should return true if rep.type is "organization"', () => {
    const rep = { type: 'organization' };
    expect(formIs2122(rep)).to.be.true;
  });

  it('should return false if rep.type is not "representative" or "organization"', () => {
    const rep = { type: 'other' };
    expect(formIs2122(rep)).to.be.false;
  });

  it('should return false if rep is null', () => {
    const rep = null;
    expect(formIs2122(rep)).to.be.false;
  });

  it('should return false if rep is undefined', () => {
    const rep = undefined;
    expect(formIs2122(rep)).to.be.false;
  });

  it('should return false if rep.type is missing', () => {
    const rep = {};
    expect(formIs2122(rep)).to.be.false;
  });
});
