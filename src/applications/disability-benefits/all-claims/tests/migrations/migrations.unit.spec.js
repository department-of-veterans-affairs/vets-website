import { expect } from 'chai';

import redirectToClaimTypePage from '../../migrations/01-require-claim-type';
import upgradeHasSeparationPay from '../../migrations/03-upgrade-hasSeparationPay';
import truncateOtherHomelessHousing from '../../migrations/04-truncate-otherHomelessHousing';
import truncateOtherAtRiskHousing from '../../migrations/05-truncate-otherAtRiskHousing';
import fixTreatedDisabilityNamesKey from '../../migrations/06-fix-treatedDisabilityNames';
import mapServiceBranches from '../../migrations/07-map-service-branches';
import reorderHousingIllnessRemoveFdc from '../../migrations/08-paper-sync';
import addDisabilitiesRedirect from '../../migrations/09-addDisabilities-redirect';

import formConfig from '../../config/form';
import { MAX_HOUSING_STRING_LENGTH } from '../../constants';
import trimToxicExposureDates from '../../migrations/10-toxic-exposure-dates';

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

  describe('09-addDisabilities-redirect', () => {
    it('should direct users to new-disabilities/add', () => {
      const savedData = {
        metadata: {
          returnUrl: '/new-disabilities-revised/add',
        },
      };
      const migratedData = addDisabilitiesRedirect(savedData);
      expect(migratedData.metadata.returnUrl).to.equal('/new-disabilities/add');
    });

    it('should continue if return URL is different page in form', () => {
      const savedData = {
        metadata: {
          returnUrl: '/new-disabilities/follow-up',
        },
      };
      const migratedData = addDisabilitiesRedirect(savedData);
      expect(migratedData.metadata.returnUrl).to.equal(
        '/new-disabilities/follow-up',
      );
    });
  });

  describe('10-toxic-exposure-dates', () => {
    it('should trim toxic exposure dates', () => {
      const savedData = {
        formData: {
          toxicExposure: {
            conditions: {
              asthma: true,
              heartattackmyocardialinfarction: true,
            },
            gulfWar1990: {
              afghanistan: true,
              iraq: true,
              airspace: true,
            },
            gulfWar1990Details: {
              afghanistan: {
                startDate: '1990-01-01',
                endDate: '1990-12-02',
                'view:notSure': true,
              },
              iraq: {
                startDate: '1991-02-XX',
                endDate: '1992-XX-XX',
              },
            },
            gulfWar2001: {
              yemen: true,
              airspace: false,
            },
            gulfWar2001Details: {
              yemen: {
                startDate: '2002-01-31',
              },
            },
            herbicide: {
              c123: true,
              guam: true,
              laos: true,
            },
            herbicideDetails: {
              c123: {
                endDate: '1966-02-21',
              },
              laos: {
                startDate: '1965-01-01',
              },
            },
            otherHerbicideLocations: {
              description: 'Test location 1',
              endDate: '1969-01-10',
              startDate: '1968-01-11',
            },
            otherExposuresDetails: {
              radiation: {
                endDate: '2005-05-10',
              },
              mos: {
                startDate: '2001-01-20',
              },
            },
            specifyOtherExposures: {
              startDate: '2000-03-15',
              endDate: '2001-03-15',
              description:
                'Test substance 1, Test Substance 2, Test Substance 3',
            },
            otherExposures: {
              asbestos: true,
              mos: true,
              radiation: true,
              notsure: true,
            },
          },
        },
        metadata: {
          version: 9,
          returnUrl: '/supporting-evidence/orientation',
        },
      };

      const migratedData = trimToxicExposureDates(savedData);
      expect(migratedData.formData.toxicExposure).to.deep.equal({
        conditions: {
          asthma: true,
          heartattackmyocardialinfarction: true,
        },
        gulfWar1990: {
          afghanistan: true,
          iraq: true,
          airspace: true,
        },
        gulfWar1990Details: {
          afghanistan: {
            startDate: '1990-01',
            endDate: '1990-12',
            'view:notSure': true,
          },
          iraq: {
            startDate: '1991-02',
            endDate: '1992-XX',
          },
        },
        gulfWar2001: {
          yemen: true,
          airspace: false,
        },
        gulfWar2001Details: {
          yemen: {
            startDate: '2002-01',
          },
        },
        herbicide: {
          c123: true,
          guam: true,
          laos: true,
        },
        herbicideDetails: {
          c123: {
            endDate: '1966-02',
          },
          laos: {
            startDate: '1965-01',
          },
        },
        otherHerbicideLocations: {
          description: 'Test location 1',
          endDate: '1969-01',
          startDate: '1968-01',
        },
        otherExposuresDetails: {
          radiation: {
            endDate: '2005-05',
          },
          mos: {
            startDate: '2001-01',
          },
        },
        specifyOtherExposures: {
          startDate: '2000-03',
          endDate: '2001-03',
          description: 'Test substance 1, Test Substance 2, Test Substance 3',
        },
        otherExposures: {
          asbestos: true,
          mos: true,
          radiation: true,
          notsure: true,
        },
      });
      expect(migratedData.metadata.returnUrl).to.deep.equal(
        '/supporting-evidence/orientation',
      );
    });

    it('should not modify an empty toxic exposure object', () => {
      const savedData = {
        formData: {
          toxicExposure: {
            conditions: {},
            gulfWar1990: {},
            gulfWar1990Details: {
              afghanistan: {},
              bahrain: {},
              egypt: {},
              iraq: {},
              israel: {},
              jordan: {},
              kuwait: {},
              neutralzone: {},
              oman: {},
              qatar: {},
              saudiarabia: {},
              somalia: {},
              syria: {},
              uae: {},
              turkey: {},
              waters: {},
              airspace: {},
            },
            'view:gulfWar1990AdditionalInfo': {},
            gulfWar2001: {},
            gulfWar2001Details: {
              djibouti: {},
              lebanon: {},
              uzbekistan: {},
              yemen: {},
              airspace: {},
            },
            'view:gulfWar2001AdditionalInfo': {},
            herbicide: {},
            otherHerbicideLocations: {},
            herbicideDetails: {
              cambodia: {},
              guam: {},
              koreandemilitarizedzone: {},
              johnston: {},
              laos: {},
              c123: {},
              thailand: {},
              vietnam: {},
            },
            'view:herbicideAdditionalInfo': {},
            otherExposures: {},
            specifyOtherExposures: {},
            otherExposuresDetails: {
              asbestos: {},
              chemical: {},
              water: {},
              mos: {},
              mustardgas: {},
              radiation: {},
            },
            'view:otherExposuresAdditionalInfo': {},
            'view:additionalExposuresAdditionalInfo': {},
          },
        },
        metadata: {
          version: 9,
          returnUrl: '/test-page',
        },
      };

      const migratedData = trimToxicExposureDates(savedData);
      expect(migratedData).to.deep.equal(savedData);
    });
  });
});
