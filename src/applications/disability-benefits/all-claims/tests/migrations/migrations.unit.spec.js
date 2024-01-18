import { expect } from 'chai';

import redirectToClaimTypePage from '../../migrations/01-require-claim-type';
import upgradeHasSeparationPay from '../../migrations/03-upgrade-hasSeparationPay';
import truncateOtherHomelessHousing from '../../migrations/04-truncate-otherHomelessHousing';
import truncateOtherAtRiskHousing from '../../migrations/05-truncate-otherAtRiskHousing';
import fixTreatedDisabilityNamesKey from '../../migrations/06-fix-treatedDisabilityNames';
import mapServiceBranches from '../../migrations/07-map-service-branches';
import reorderHousingIllnessRemoveFdc from '../../migrations/08-paper-sync';

import formConfig from '../../config/form';
import { MAX_HOUSING_STRING_LENGTH } from '../../constants';

describe('526 v2 migrations', () => {
  const longString = (offset = 10) =>
    '-'.repeat(MAX_HOUSING_STRING_LENGTH + offset);

  describe('01-require-claim-type', () => {
    it('should change the URL to /claim-type', () => {
      const savedData = {
        formData: {},
        metadata: {
          returnUrl: '/some-other-page',
        },
      };
      const migratedData = redirectToClaimTypePage(savedData);
      expect(migratedData.metadata.returnUrl).to.equal('/claim-type');
    });
    it('should not change the URL if still on the veteran info page', () => {
      const savedData = {
        formData: {},
        metadata: {
          returnUrl: '/veteran-information',
        },
      };
      const migratedData = redirectToClaimTypePage(savedData);
      expect(migratedData.metadata.returnUrl).to.equal('/veteran-information');
    });
    it('should not modify anything except the returnUrl', () => {
      const savedData = {
        formData: { foo: 'bar' },
        metadata: {
          returnUrl: '/some-other-page',
        },
      };
      const migratedData = redirectToClaimTypePage(savedData);
      expect(migratedData.formData).to.equal(savedData.formData);
    });
    // Sanity check
    it('/claim-type should be a valid url', () => {
      expect(formConfig.chapters.disabilities.pages.claimType.path).to.equal(
        'claim-type',
      );
    });
  });

  describe('03-upgrade-separationPay', () => {
    it('should migrate view:hasSeparationPay to hasSeparationPay', () => {
      const savedData = {
        formData: { 'view:hasSeparationPay': true, test: true },
        metadata: { version: 1 },
      };
      const migratedData = upgradeHasSeparationPay(savedData);
      expect(migratedData.formData['view:hasSeparationPay']).to.be.undefined;
      expect(savedData).to.deep.equal({
        formData: { 'view:hasSeparationPay': true, test: true },
        metadata: { version: 1 },
      });
      expect(migratedData.formData.hasSeparationPay).to.be.true;
    });
  });

  describe('04-truncate-otherHomelessHousing', () => {
    it('should migrate by truncating otherHomelessHousing', () => {
      const savedData = {
        formData: {
          otherHomelessHousing: longString(),
          test: true,
        },
        metadata: { version: 1 },
      };
      const migratedData = truncateOtherHomelessHousing(savedData);
      expect(savedData).to.deep.equal({
        formData: {
          otherHomelessHousing: longString(),
          test: true,
        },
        metadata: { version: 1 },
      });
      expect(migratedData).to.deep.equal({
        formData: {
          otherHomelessHousing: longString(0),
          test: true,
        },
        metadata: { version: 1 },
      });
    });
  });

  describe('05-truncate-otherAtRiskHousing', () => {
    it('should migrate by truncating otherAtRiskHousing', () => {
      const savedData = {
        formData: {
          otherAtRiskHousing: longString(),
          test: true,
        },
        metadata: { version: 1 },
      };
      const migratedData = truncateOtherAtRiskHousing(savedData);
      expect(savedData).to.deep.equal({
        formData: {
          otherAtRiskHousing: longString(),
          test: true,
        },
        metadata: { version: 1 },
      });
      expect(migratedData).to.deep.equal({
        formData: {
          otherAtRiskHousing: longString(0),
          test: true,
        },
        metadata: { version: 1 },
      });
    });
  });

  describe('06-fix-treatedDisabilityNames', () => {
    it('should migrate treatedDisabilityNames & powDisabilities', () => {
      const savedData = {
        formData: {
          vaTreatmentFacilities: [
            {
              treatedDisabilityNames: {
                'diabetes mellitus 0': true,
                'diabetes mellitus 1': true,
                'myocardial infarction (mi)': true,
              },
            },
            {
              treatedDisabilityNames: {
                'asthma 123': true,
                'phlebitis (456)': true,
                'knee replacement': true,
              },
            },
          ],
          'view:isPow': {
            powDisabilities: {
              'knee replacement': true,
              'myocardial infarction (mi)': true,
            },
          },
        },
        metadata: { version: 1 },
      };
      const migratedData = fixTreatedDisabilityNamesKey(savedData);
      expect(migratedData).to.deep.equal({
        formData: {
          vaTreatmentFacilities: [
            {
              treatedDisabilityNames: {
                diabetesmellitus0: true,
                diabetesmellitus1: true,
                myocardialinfarctionmi: true,
              },
            },
            {
              treatedDisabilityNames: {
                asthma123: true,
                phlebitis456: true,
                kneereplacement: true,
              },
            },
          ],
          'view:isPow': {
            powDisabilities: {
              kneereplacement: true,
              myocardialinfarctionmi: true,
            },
          },
        },
        metadata: { version: 1 },
      });
    });
  });

  describe('07-map-service-branches', () => {
    const getData = periods => ({
      formData: {
        serviceInformation: {
          servicePeriods: [
            {
              serviceBranch: periods[0],
              dateRange: { from: '2000-01-01', to: '2001-01-01' },
            },
            {
              serviceBranch: periods[1],
              dateRange: { from: '2001-02-01', to: '2002-01-01' },
            },
            {
              serviceBranch: periods[2],
              dateRange: { from: '2000-01-01' },
            },
          ],
          'view:militaryHistoryNote': {
            type: 'object',
            properties: {},
          },
        },
      },
      metadata: { version: 1 },
    });
    it('should migrate reserves for Air Force, Army and Coast Guard', () => {
      const list = {
        'Air Force Reserve': 'Air Force Reserves',
        'Army Reserve': 'Army Reserves',
        'Coast Guard Reserve': 'Coast Guard Reserves',
      };
      const migratedData = mapServiceBranches(getData(Object.keys(list)));
      expect(migratedData).to.deep.equal(getData(Object.values(list)));
    });
    it('should migrate reserves for Marine Corps and Navy, but not modify Army', () => {
      const list = {
        'Marine Corps Reserve': 'Marine Corps Reserves',
        Army: 'Army',
        'Navy Reserve': 'Navy Reserves',
      };
      const migratedData = mapServiceBranches(getData(Object.keys(list)));
      expect(migratedData).to.deep.equal(getData(Object.values(list)));
    });
    it('should migrate NOAA, but not PHS or Navy', () => {
      const list = {
        'Public Health Service': 'Public Health Service',
        NOAA: 'National Oceanic & Atmospheric Administration',
        Navy: 'Navy',
      };
      const migratedData = mapServiceBranches(getData(Object.keys(list)));
      expect(migratedData).to.deep.equal(getData(Object.values(list)));
    });
  });

  describe('08-paper-sync', () => {
    it('should not change returnUrl if user left off on the veteran info page', () => {
      const savedData = {
        formData: {},
        metadata: {
          version: 8,
          returnUrl: '/veteran-information',
        },
      };
      const migratedData = reorderHousingIllnessRemoveFdc(savedData);
      expect(migratedData.metadata.returnUrl).to.deep.equal(
        '/veteran-information',
      );
    });

    it('should not change returnUrl if user left off on the contact info page', () => {
      const savedData = {
        formData: {},
        metadata: {
          version: 8,
          returnUrl: '/contact-information',
        },
      };
      const migratedData = reorderHousingIllnessRemoveFdc(savedData);
      expect(migratedData.metadata.returnUrl).to.deep.equal(
        '/contact-information',
      );
    });

    it('should change returnUrl to housing-situation when user could potentially skip it', () => {
      const savedData = {
        formData: {},
        metadata: {
          version: 8,
          returnUrl: '/claim-type',
        },
      };

      const migratedData = reorderHousingIllnessRemoveFdc(savedData);

      expect(migratedData.metadata.returnUrl).to.deep.equal(
        '/housing-situation',
      );
    });

    it('should change returnUrl to terminally-ill when user could potentially skip it', () => {
      const savedData = {
        formData: {
          homelessOrAtRisk: 'homeless',
        },
        metadata: {
          version: 8,
          returnUrl: '/housing-situation',
        },
      };

      const migratedData = reorderHousingIllnessRemoveFdc(savedData);

      expect(migratedData.metadata.returnUrl).to.deep.equal('/terminally-ill');
    });

    it('should change returnUrl to review and submit if on the fdc page', () => {
      const savedData = {
        formData: {
          isTerminallyIll: false,
          homelessOrAtRisk: 'no',
        },
        metadata: {
          version: 8,
          returnUrl: '/fully-developed-claim',
        },
      };

      const migratedData = reorderHousingIllnessRemoveFdc(savedData);

      expect(migratedData.metadata.returnUrl).to.deep.equal(
        '/review-and-submit',
      );
    });
  });
});
