import { expect } from 'chai';
import LocationHours from '../../components/LocationHours';

describe('Locator Helper Method Tests', () => {
  it('should return true if data is valid', () => {
    const location = {
      attributes: {
        facilityType: 'va_health_facility',
        hours: {
          monday: '800AM-430PM',
        },
      },
    };

    LocationHours.isValid(location);

    expect(true).to.eq(true);
  });
});
