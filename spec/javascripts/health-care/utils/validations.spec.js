import { isValidSSN } from '../../../../_health-care/_js/utils/validations.js';

describe('Validations unit tests', () => {
  it('accepts ssns of the right one including "invalid" test ones', () => {
    expect(isValidSSN('111-22-1234')).to.be.true;

    // SSNs have certain invalid versions. These are useful for tests so not
    // the validation should return TRUE for them.
    //
    // For information on invalid values see:
    //   https://secure.ssa.gov/poms.nsf/lnx/0110201035
    expect(isValidSSN('000-22-1234')).to.be.true;
    expect(isValidSSN('666-22-1234')).to.be.true;
    expect(isValidSSN('900-22-1234')).to.be.true;
    expect(isValidSSN('111-00-1234')).to.be.true;
    expect(isValidSSN('111-22-0000')).to.be.true;
  });

  it('rejects invalid ssn format', () => {
    // Disallow empty.
    expect(isValidSSN('')).to.be.false;

    // Invalid characters.
    expect(isValidSSN('111-22-1%34')).to.be.false;
    expect(isValidSSN('111-22-1A34')).to.be.false;
    expect(isValidSSN('hi mom')).to.be.false;

    // No leading or trailing spaces.
    expect(isValidSSN('111-22-1A34 ')).to.be.false;
    expect(isValidSSN(' 111-22-1234')).to.be.false;

    // Dashes are required.
    expect(isValidSSN('111221234')).to.be.false;

    // Too few numbers is invalid.
    expect(isValidSSN('111-22-123')).to.be.false;
  });
});
