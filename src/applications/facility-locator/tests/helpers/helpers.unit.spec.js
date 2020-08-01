import { expect } from 'chai';
import {
  areBoundsEqual,
  formatOperatingHours,
  validateIdString,
  isVADomain,
} from '../../utils/helpers';

describe('Locator Helper Method Tests', () => {
  describe('areBoundsEqual Tests', () => {
    it('Should handle valid input', () => {
      const bbox1 = [-78.19, 38.14, -76.69, 39.64];
      const bbox2 = [-78.19, 38.14, -76.69, 39.64];

      const result = areBoundsEqual(bbox1, bbox2);

      expect(result).to.eql(true);
    });

    it('Should handle unequal input', () => {
      const bbox1 = [-78.19, 38.14, -76.69, 39.64];
      const bbox2 = [-76.69, 39.64, -78.19, 38.14];

      const result = areBoundsEqual(bbox1, bbox2);

      expect(result).to.eql(false);
    });

    it('Should handle null/missing input', () => {
      // Both Inputs Invalid
      let bbox1 = [-78.128];
      let bbox2 = [];
      let result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // First Input Invalid
      bbox1 = [-76.69];
      bbox2 = [-76.69, 39.64, -78.19, 38.14];
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // Second Input Invalid
      bbox1 = [-76.69, 39.64, -78.19, 38.14];
      bbox2 = [-76.69];
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // First Input null
      bbox1 = null;
      bbox2 = [-76.69, 39.64, -78.19, 38.14];
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // Second Input null
      bbox1 = [-76.69, 39.64, -78.19, 38.14];
      bbox2 = null;
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // First Input undefined
      bbox1 = undefined;
      bbox2 = [-76.69, 39.64, -78.19, 38.14];
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // Second Input undefined
      bbox1 = [-76.69, 39.64, -78.19, 38.14];
      bbox2 = undefined;
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);
    });
  });
});

describe('Validate ID Strings for Breadcrumb', () => {
  it('Should handle facility ID pattern letters_, letter, digits', () => {
    const result = validateIdString('/facility/abc_s1130', '/facility');
    expect(result.length).to.eql(1);
  });

  it('Should handle facility ID pattern letters_, digits, letters', () => {
    const result = validateIdString('/facility/abc_691GE', '/facility');
    expect(result.length).to.eql(1);
  });

  it('Should handle facility ID pattern letters_, digits', () => {
    const result = validateIdString('/facility/abc_827', '/facility');
    expect(result.length).to.eql(1);
  });

  it('Should handle provider ID pattern letters_, letter, digits', () => {
    const result = validateIdString('/provider/abc_s1130', '/provider');
    expect(result.length).to.eql(1);
  });

  it('Should handle provider ID pattern letters_, digits, letters', () => {
    const result = validateIdString('/provider/abc_691GE', '/provider');
    expect(result.length).to.eql(1);
  });

  it('Should handle provider ID pattern letters_, digits', () => {
    const result = validateIdString('/provider/abc_827', '/provider');
    expect(result.length).to.eql(1);
  });

  it('Should handle other facility designations', () => {
    const result = validateIdString('/hospital/abc_123', '/hospital');
    expect(result.length).to.eql(1);
  });

  it('Should not handle facility patterns with 0 characters before underscore', () => {
    const result = validateIdString('/facility/_abcdefghijklmno', '/facility');
    expect(result).to.eql(null);
  });

  it('Should not handle facility patterns with more than 15 characters before underscore', () => {
    const result = validateIdString(
      '/facility/abcdefghijklmno_abcdefghijklmnop',
      '/facility',
    );
    expect(result).to.eql(null);
  });

  it('Should not handle facility patterns with 0 characters after underscore', () => {
    const result = validateIdString('/facility/abc_', '/facility');
    expect(result).to.eql(null);
  });

  it('Should not handle facility patterns with more than 15 characters after underscore', () => {
    const result = validateIdString(
      '/facility/abc_abcdefghijklmnop',
      '/facility',
    );
    expect(result).to.eql(null);
  });

  it('Should not handle provider patterns with 0 characters before underscore', () => {
    const result = validateIdString('/provider/_abcdefghijklmno', '/provider');
    expect(result).to.eql(null);
  });

  it('Should not handle provider patterns with more than 15 characters before underscore', () => {
    const result = validateIdString(
      '/provider/abcdefghijklmno_abcdefghijklmnop',
      '/provider',
    );
    expect(result).to.eql(null);
  });

  it('Should not handle provider patterns with 0 characters after underscore', () => {
    const result = validateIdString('/provider/abc_', '/provider');
    expect(result).to.eql(null);
  });

  it('Should not handle provider patterns with more than 15 characters after underscore', () => {
    const result = validateIdString(
      '/provider/abc_abcdefghijklmnop',
      '/provider',
    );
    expect(result).to.eql(null);
  });

  it('Should not handle patterns without an underscore', () => {
    const result = validateIdString('/facility/abcdefg', '/facility');
    expect(result).to.eql(null);
  });

  it('Should not handle patterns without a type prefix', () => {
    const result = validateIdString('/abcdefg_abcdefg', '/');
    expect(result).to.eql(null);
  });

  it('formatOperatingHours should convert API hour (without colon) to a human readable hour', () => {
    const operatingHours = '800 AM - 430 PM';
    const expected = '8:00 a.m. - 4:30 p.m.';

    const result = formatOperatingHours(operatingHours);

    expect(result).to.eq(expected);
  });

  it('formatOperatingHours should convert API hour (with colon) to a human readable hour', () => {
    const operatingHours = '8:00AM-4:30PM';
    const expected = '8:00 a.m. - 4:30 p.m.';

    const result = formatOperatingHours(operatingHours);

    expect(result).to.eq(expected);
  });

  it('formatOperatingHours should return the original string a time is invalid', () => {
    const operatingHours = '8:00am-Sunset';
    const expected = '8:00 a.m. - Sunset';

    const result = formatOperatingHours(operatingHours);

    expect(result).to.eq(expected);
  });

  it('formatOperatingHours should return "Closed" if format is "-"', () => {
    const operatingHours = '-';
    const expected = 'Closed';

    const result = formatOperatingHours(operatingHours);

    expect(result).to.eq(expected);
  });

  it('formatOperatingHours should return "Closed" if format is "Closed"', () => {
    const operatingHours = 'Closed';
    const expected = 'Closed';

    const result = formatOperatingHours(operatingHours);

    expect(result).to.eq(expected);
  });

  it('formatOperatingHours should return "By Appointment Only" if format is "By Appointment Only"', () => {
    const operatingHours = 'By Appointment Only';
    const expected = 'By Appointment Only';

    const result = formatOperatingHours(operatingHours);

    expect(result).to.eq(expected);
  });

  it('formatOperatingHours should return "24/7" if format is "24/7"', () => {
    const operatingHours = '24/7';
    const expected = '24/7';

    const result = formatOperatingHours(operatingHours);

    expect(result).to.eq(expected);
  });

  it('formatOperatingHours should return "Sunrise - Sunset" if format is "Sunrise - Sunset"', () => {
    const operatingHours = 'Sunrise - Sunset';
    const expected = 'Sunrise - Sunset';

    const result = formatOperatingHours(operatingHours);

    expect(result).to.eq(expected);
  });

  it('isVADomain should return true if https://www.va.gov/pittsburgh-health-care/locations/beaver-county-va-clinic/ ', () => {
    const result = isVADomain(
      'https://www.va.gov/pittsburgh-health-care/locations/beaver-county-va-clinic/',
    );
    expect(result).to.eq(true);
  });

  it('isVADomain should return true if  https://www.va.gov/pittsburgh-health-care/locations/h-john-heinz-iii-department-of-veterans-affairs-medical-center/ ', () => {
    const result = isVADomain(
      'https://www.va.gov/pittsburgh-health-care/locations/h-john-heinz-iii-department-of-veterans-affairs-medical-center/',
    );
    expect(result).to.eq(true);
  });

  it('isVADomain should return true if  https://va.gov/pittsburgh-health-care/locations/h-john-heinz-iii-department-of-veterans-affairs-medical-center/ ', () => {
    const result = isVADomain(
      'https://va.gov/pittsburgh-health-care/locations/h-john-heinz-iii-department-of-veterans-affairs-medical-center/',
    );

    expect(result).to.eq(true);
  });

  it('isVADomain should return true if  http://www.va.gov/testing ', () => {
    const result = isVADomain('http://www.va.gov/testing');

    expect(result).to.eq(true);
  });

  it('isVADomain should return true if  http://staging.va.gov/pittsburgh-health-care/locations/h-john-heinz-iii-department-of-veterans-affairs-medical-center/ ', () => {
    const result = isVADomain(
      'http://staging.va.gov/pittsburgh-health-care/locations/h-john-heinz-iii-department-of-veterans-affairs-medical-center/',
    );

    expect(result).to.eq(true);
  });

  it('isVADomain should false true if  http://www.staging.va.gov/testing ', () => {
    const result = isVADomain('http://www.staging.va.gov/testing');

    expect(result).to.eq(false);
  });

  it('isVADomain should return false if  https://clinic.va.gov/clinic', () => {
    const result = isVADomain('https://clinic.va.gov/clinic');

    expect(result).to.eq(false);
  });

  it('isVADomain should return false if  https://www.clinic.va.gov/clinic', () => {
    const result = isVADomain('https://clinic.va.gov/clinic');

    expect(result).to.eq(false);
  });

  it('isVADomain should return false if  https://google.com/testing ', () => {
    const result = isVADomain('https://google.com/testing');

    expect(result).to.eq(false);
  });

  it('isVADomain should return false if  https://example.ex/testing ', () => {
    const result = isVADomain('https://example.ex/testing');
    expect(result).to.eq(false);
  });

  it('isVADomain should return false if http://some.com/va.gov ', () => {
    const result = isVADomain('http://some.com/va.gov');
    expect(result).to.eq(false);
  });
});
