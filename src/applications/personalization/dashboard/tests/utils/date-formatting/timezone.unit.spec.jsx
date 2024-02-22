import { expect } from 'chai';
import {
  stripDST,
  getVATimeZone,
  getCCTimeZone,
  getTimezoneByFacilityId,
  getTimezoneAbbrByFacilityId,
  getTimezoneNameFromAbbr,
  getUserTimezone,
  getUserTimezoneAbbr,
} from '../../../utils/date-formatting/timezone';

describe('stripDST function', () => {
  it('should remove the middle letter of timezone abbrevations', () => {
    expect(stripDST('EST')).to.equal('ET');
    expect(stripDST('PDT')).to.equal('PT');
  });

  it('should return original abbreviation if it is already stripped', () => {
    expect(stripDST('ET')).to.equal('ET');
    expect(stripDST('PT')).to.equal('PT');
  });
});

describe('getVATimeZone function', () => {
  it('should search for facility ID and return the timezone abbreviation', () => {
    expect(getVATimeZone('585')).to.equal('CT');
  });

  it('should search for a nonexistent facility ID and return null', () => {
    expect(getVATimeZone('11')).to.equal(null);
  });
});

describe('getCCTimeZone function', () => {
  const appointment = {
    id: '123',
    type: 'cc_appointments',
    attributes: {
      timeZone: '-06:00 MDT',
    },
  };

  it('should return the timezone abbreviation of an CC appointment object', () => {
    expect(getCCTimeZone(appointment)).to.equal('MT');
  });
});

describe('getTimezoneByFacilityId function', () => {
  it('should search for facility ID and return the timezone', () => {
    expect(getTimezoneByFacilityId('585')).to.equal('America/Chicago');
  });

  it('should search for a nonexistent facility ID and return null', () => {
    expect(getTimezoneByFacilityId('')).to.equal(null);
  });

  it('should search for a facility ID with extra characters at end, trim them, and return matching timezone', () => {
    expect(getTimezoneByFacilityId('436ZZZZZZ')).to.equal('America/Denver');
  });
});

describe('getTimezoneAbbrByFacilityId function', () => {
  it('should search for facility ID and return the timezone abbreviation', () => {
    expect(getTimezoneAbbrByFacilityId('585')).to.equal('CT');
  });

  it('should search for a nonexistent facility ID and return null', () => {
    expect(getTimezoneAbbrByFacilityId('')).to.equal(null);
  });
});

describe('getTimezoneNameFromAbbr function', () => {
  it('should return full name of a timezone abbreviation', () => {
    expect(getTimezoneNameFromAbbr('PT')).to.equal('America/Los_Angeles');
  });

  it('should return abbreviation if no match', () => {
    expect(getTimezoneNameFromAbbr('HKT')).to.equal('HKT');
  });
});

describe('getUserTimezone function', () => {
  const yourTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  it("should return user's timezone", () => {
    expect(getUserTimezone()).to.equal(yourTz);
  });
});

describe('getUserTimezoneAbbr function', () => {
  const yourTzAbbr = new Date()
    .toLocaleTimeString('en-us', { timeZoneName: 'short' })
    .split(' ')[2];

  it("should return user's timezone", () => {
    expect(getUserTimezoneAbbr()).to.equal(yourTzAbbr);
  });
});
