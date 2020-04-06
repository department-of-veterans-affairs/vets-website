import { isValidCentralMailPostalCode } from '../../address/validations';

describe('Forms address validations:', () => {
  describe('isValidCentralMailPostalCode', () => {
    it('should return valid on non-USA addresses', () => {
      expect(
        isValidCentralMailPostalCode({
          country: 'CAN',
          postalCode: '234444',
        }),
      ).toBe(true);
    });
    it('should return valid on five digit USA zips', () => {
      expect(
        isValidCentralMailPostalCode({
          country: 'USA',
          postalCode: '23444',
        }),
      ).toBe(true);
    });
    it('should return valid on nine digit USA zips', () => {
      expect(
        isValidCentralMailPostalCode({
          country: 'USA',
          postalCode: '23444-1233',
        }),
      ).toBe(true);
    });
    it('should return invalid on unformatted nine digit USA zips', () => {
      expect(
        isValidCentralMailPostalCode({
          country: 'USA',
          postalCode: '234441233',
        }),
      ).toBe(false);
    });
  });
});
