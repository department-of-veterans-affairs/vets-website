import redirectToClaimTypePage from '../../migrations/01-require-claim-type';
import upgradeHasSeparationPay from '../../migrations/03-upgrade-hasSeparationPay';
import formConfig from '../../config/form';

describe('526 v2 migrations', () => {
  describe('01-require-claim-type', () => {
    test('should change the URL to /claim-type', () => {
      const savedData = {
        formData: {},
        metadata: {
          returnUrl: '/some-other-page',
        },
      };
      const migratedData = redirectToClaimTypePage(savedData);
      expect(migratedData.metadata.returnUrl).toBe('/claim-type');
    });
    test('should not change the URL if still on the veteran info page', () => {
      const savedData = {
        formData: {},
        metadata: {
          returnUrl: '/veteran-information',
        },
      };
      const migratedData = redirectToClaimTypePage(savedData);
      expect(migratedData.metadata.returnUrl).toBe('/veteran-information');
    });
    test('should not modify anything except the returnUrl', () => {
      const savedData = {
        formData: { foo: 'bar' },
        metadata: {
          returnUrl: '/some-other-page',
        },
      };
      const migratedData = redirectToClaimTypePage(savedData);
      expect(migratedData.formData).toBe(savedData.formData);
    });
    // Sanity check
    test('/claim-type should be a valid url', () => {
      expect(formConfig.chapters.veteranDetails.pages.claimType.path).toBe(
        'claim-type',
      );
    });
  });
  describe('02-upgrade-separationPay', () => {
    test('should migrate view:hasSeparationPay to hasSeparationPay', () => {
      const savedData = {
        'view:hasSeparationPay': true,
      };
      const migratedData = upgradeHasSeparationPay(savedData);
      expect(migratedData['view:hasSeparationPay']).toBeUndefined();
      expect(savedData['view:hasSeparationPay']).toBe(true);
      expect(migratedData.hasSeparationPay).toBe(true);
    });
  });
});
