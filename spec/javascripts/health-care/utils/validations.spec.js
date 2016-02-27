import Validations from '../../../../_health-care/_js/_utils/validations.js';

describe('Validations unit tests', () => {
  it('accepts ssns of the right one including "invalid" test ones', () => {
    expect(Validations.isValidSSN('111-22-1234')).to.be.true;

    // SSNs have certain invalid versions. These are useful for tests so not
    // the validation should return TRUE for them.
    //
    // For information on invalid values see:
    //   https://secure.ssa.gov/poms.nsf/lnx/0110201035
    expect(Validations.isValidSSN('000-22-1234')).to.be.true;
    expect(Validations.isValidSSN('666-22-1234')).to.be.true;
    expect(Validations.isValidSSN('900-22-1234')).to.be.true;
    expect(Validations.isValidSSN('111-00-1234')).to.be.true;
    expect(Validations.isValidSSN('111-22-0000')).to.be.true;
  });

  it('rejects invalid ssn format', () => {
    // Disallow empty.
    expect(Validations.isValidSSN('')).to.be.false;

    // Invalid characters.
    expect(Validations.isValidSSN('111-22-1%34')).to.be.false;
    expect(Validations.isValidSSN('111-22-1A34')).to.be.false;
    expect(Validations.isValidSSN('hi mom')).to.be.false;

    // No leading or trailing spaces.
    expect(Validations.isValidSSN('111-22-1A34 ')).to.be.false;
    expect(Validations.isValidSSN(' 111-22-1234')).to.be.false;
  });
});
