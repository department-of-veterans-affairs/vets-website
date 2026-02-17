/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
/* eslint-disable you-dont-need-momentjs/add */
/* eslint-disable you-dont-need-momentjs/subtract */
/* eslint-disable you-dont-need-momentjs/format */

import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { productSpecificDates } from '../../../utils/dates/product-specific';

describe('Disability benefits 526EZ -- Product-specific date utilities', () => {
  describe('PTSD utilities', () => {
    describe('validateIncidentDate', () => {
      it('should add error for invalid date', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.ptsd.validateIncidentDate(errors, 'invalid');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'valid incident date',
        );
      });

      it('should add error for future date', () => {
        const errors = { addError: sinon.spy() };
        // Use a date that's definitely in the future
        const futureDate = moment().add(1, 'year').format('YYYY-MM-DD');
        productSpecificDates.ptsd.validateIncidentDate(errors, futureDate);
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'cannot be in the future',
        );
      });

      it('should add error if date is not within service periods', () => {
        const errors = { addError: sinon.spy() };
        const servicePeriods = [
          { dateRange: { from: '2020-01-01', to: '2021-12-31' } },
          { dateRange: { from: '2022-06-01', to: '2023-05-31' } },
        ];
        productSpecificDates.ptsd.validateIncidentDate(
          errors,
          '2022-01-15',
          servicePeriods,
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'within a service period',
        );
      });

      it('should not add error for valid date within service', () => {
        const errors = { addError: sinon.spy() };
        const servicePeriods = [
          { dateRange: { from: '2020-01-01', to: '2021-12-31' } },
        ];
        productSpecificDates.ptsd.validateIncidentDate(
          errors,
          '2020-06-15',
          servicePeriods,
        );
        expect(errors.addError.called).to.be.false;
      });

      it('should not check service periods if none provided', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.ptsd.validateIncidentDate(
          errors,
          '2020-01-01',
          [],
        );
        expect(errors.addError.called).to.be.false;
      });
    });

    describe('formatIncidentDateRange', () => {
      it('should format single incident date', () => {
        const incident = { incidentDate: '2020-06-15' };
        expect(
          productSpecificDates.ptsd.formatIncidentDateRange(incident),
        ).to.equal('June 2020');
      });

      it('should format date range with both dates', () => {
        const incident = {
          incidentDateRange: {
            from: '2020-01-01',
            to: '2020-12-31',
          },
        };
        expect(
          productSpecificDates.ptsd.formatIncidentDateRange(incident),
        ).to.equal('January 2020 to December 2020');
      });

      it('should format partial date ranges', () => {
        const fromOnly = {
          incidentDateRange: { from: '2020-01-01' },
        };
        expect(
          productSpecificDates.ptsd.formatIncidentDateRange(fromOnly),
        ).to.equal('From January 2020');

        const toOnly = {
          incidentDateRange: { to: '2020-12-31' },
        };
        expect(
          productSpecificDates.ptsd.formatIncidentDateRange(toOnly),
        ).to.equal('Until December 2020');
      });

      it('should handle missing or invalid data', () => {
        expect(
          productSpecificDates.ptsd.formatIncidentDateRange(null),
        ).to.equal('Unknown');
        expect(productSpecificDates.ptsd.formatIncidentDateRange({})).to.equal(
          'Unknown',
        );
        expect(
          productSpecificDates.ptsd.formatIncidentDateRange({
            incidentDate: 'invalid',
          }),
        ).to.equal('Unknown');
      });
    });
  });

  describe('Toxic Exposure utilities', () => {
    describe('validateGulfWarDates', () => {
      it('should add error for invalid dates', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.toxicExposure.validateGulfWarDates(
          errors,
          { from: 'invalid', to: '2020-01-01' },
          '1990',
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'valid service dates',
        );
      });

      it('should validate 1990 Gulf War period overlap', () => {
        const errors = { addError: sinon.spy() };
        // Service dates that don't overlap with Gulf War 1990-1991
        productSpecificDates.toxicExposure.validateGulfWarDates(
          errors,
          { from: '1992-01-01', to: '1993-01-01' },
          '1990',
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'Aug 2, 1990 - Jul 31, 1991',
        );
      });

      it('should accept valid 1990 Gulf War period overlap', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.toxicExposure.validateGulfWarDates(
          errors,
          { from: '1990-01-01', to: '1991-12-31' },
          '1990',
        );
        expect(errors.addError.called).to.be.false;
      });

      it('should validate post 9/11 service dates', () => {
        const errors = { addError: sinon.spy() };
        // Service dates before 9/11
        productSpecificDates.toxicExposure.validateGulfWarDates(
          errors,
          { from: '2000-01-01', to: '2001-09-10' },
          '2001',
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'September 11, 2001',
        );
      });

      it('should accept valid post 9/11 service dates', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.toxicExposure.validateGulfWarDates(
          errors,
          { from: '2001-09-11', to: '2003-01-01' },
          '2001',
        );
        expect(errors.addError.called).to.be.false;
      });
    });

    describe('formatExposurePeriod', () => {
      it('should format ongoing exposure', () => {
        const exposure = {
          startDate: '2020-01-01',
          ongoing: true,
        };
        expect(
          productSpecificDates.toxicExposure.formatExposurePeriod(exposure),
        ).to.equal('Jan 2020 - Present');
      });

      it('should format completed exposure period', () => {
        const exposure = {
          startDate: '2020-01-01',
          endDate: '2021-12-31',
        };
        expect(
          productSpecificDates.toxicExposure.formatExposurePeriod(exposure),
        ).to.equal('Jan 2020 - Dec 2021');
      });

      it('should format start date only', () => {
        const exposure = {
          startDate: '2020-01-01',
        };
        expect(
          productSpecificDates.toxicExposure.formatExposurePeriod(exposure),
        ).to.equal('Since Jan 2020');
      });

      it('should handle missing data', () => {
        expect(
          productSpecificDates.toxicExposure.formatExposurePeriod(null),
        ).to.equal('Unknown period');
        expect(
          productSpecificDates.toxicExposure.formatExposurePeriod({}),
        ).to.equal('Unknown period');
      });
    });
  });

  describe('Unemployability utilities', () => {
    describe('validateDisabilityDate', () => {
      it('should add error for missing disability date', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.unemployability.validateDisabilityDate(
          errors,
          null,
          '2020-01-01',
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'date you became too disabled',
        );
      });

      it('should add error for future date', () => {
        const errors = { addError: sinon.spy() };
        const futureDate = moment().add(1, 'day').format('YYYY-MM-DD');
        productSpecificDates.unemployability.validateDisabilityDate(
          errors,
          futureDate,
          '2020-01-01',
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'cannot be in the future',
        );
      });

      it('should add error if disability date is before last worked date', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.unemployability.validateDisabilityDate(
          errors,
          '2020-01-01',
          '2020-06-01',
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'after the last date you worked',
        );
      });

      it('should accept valid disability date', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.unemployability.validateDisabilityDate(
          errors,
          '2020-06-01',
          '2020-01-01',
        );
        expect(errors.addError.called).to.be.false;
      });
    });

    describe('calculateUnemploymentDuration', () => {
      it('should calculate months of unemployment', () => {
        // Test with dates relative to today
        const oneYearAgo = moment().subtract(1, 'year').format('YYYY-MM-DD');
        const sixMonthsAgo = moment()
          .subtract(6, 'months')
          .format('YYYY-MM-DD');
        expect(
          productSpecificDates.unemployability.calculateUnemploymentDuration(
            oneYearAgo,
          ),
        ).to.be.at.least(11); // Allow for rounding
        expect(
          productSpecificDates.unemployability.calculateUnemploymentDuration(
            sixMonthsAgo,
          ),
        ).to.be.at.least(5);
      });

      it('should handle invalid dates', () => {
        expect(
          productSpecificDates.unemployability.calculateUnemploymentDuration(
            null,
          ),
        ).to.equal(0);
        expect(
          productSpecificDates.unemployability.calculateUnemploymentDuration(
            'invalid',
          ),
        ).to.equal(0);
      });
    });
  });

  describe('Hospitalization utilities', () => {
    describe('validateHospitalizationDates', () => {
      it('should add error for missing admission date', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.hospitalization.validateHospitalizationDates(
          errors,
          {},
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('admission date');
      });

      it('should add error for future admission date', () => {
        const errors = { addError: sinon.spy() };
        const futureDate = moment().add(1, 'day').format('YYYY-MM-DD');
        productSpecificDates.hospitalization.validateHospitalizationDates(
          errors,
          {
            from: futureDate,
          },
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'cannot be in the future',
        );
      });

      it('should add error if discharge is before admission', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.hospitalization.validateHospitalizationDates(
          errors,
          {
            from: '2023-01-15',
            to: '2023-01-01',
          },
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'after admission date',
        );
      });

      it('should add error for unreasonably long stays', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.hospitalization.validateHospitalizationDates(
          errors,
          {
            from: '2020-01-01',
            to: '2023-01-01',
          },
        );
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'longer than 2 years',
        );
      });

      it('should accept valid hospitalization dates', () => {
        const errors = { addError: sinon.spy() };
        productSpecificDates.hospitalization.validateHospitalizationDates(
          errors,
          {
            from: '2023-01-01',
            to: '2023-01-15',
          },
        );
        expect(errors.addError.called).to.be.false;
      });
    });

    describe('formatHospitalizationPeriod', () => {
      it('should format ongoing hospitalization', () => {
        const hospitalization = { from: '2023-01-15' };
        expect(
          productSpecificDates.hospitalization.formatHospitalizationPeriod(
            hospitalization,
          ),
        ).to.equal('Admitted Jan 15, 2023 (ongoing)');
      });

      it('should format completed hospitalization with duration', () => {
        const hospitalization = {
          from: '2023-01-01',
          to: '2023-01-10',
        };
        expect(
          productSpecificDates.hospitalization.formatHospitalizationPeriod(
            hospitalization,
          ),
        ).to.equal('Jan 1, 2023 - Jan 10, 2023 (10 days)');
      });

      it('should handle single day hospitalization', () => {
        const hospitalization = {
          from: '2023-01-01',
          to: '2023-01-01',
        };
        expect(
          productSpecificDates.hospitalization.formatHospitalizationPeriod(
            hospitalization,
          ),
        ).to.equal('Jan 1, 2023 - Jan 1, 2023 (1 days)');
      });

      it('should handle missing data', () => {
        expect(
          productSpecificDates.hospitalization.formatHospitalizationPeriod(
            null,
          ),
        ).to.equal('Unknown');
        expect(
          productSpecificDates.hospitalization.formatHospitalizationPeriod({}),
        ).to.equal('Unknown');
      });
    });
  });

  describe('Evidence utilities', () => {
    describe('isEvidenceDateAcceptable', () => {
      it('should accept evidence within default 5 year range', () => {
        const threeYearsAgo = moment()
          .subtract(3, 'years')
          .format('YYYY-MM-DD');
        const fourYearsAgo = moment().subtract(4, 'years').format('YYYY-MM-DD');

        expect(
          productSpecificDates.evidence.isEvidenceDateAcceptable(threeYearsAgo),
        ).to.be.true;
        expect(
          productSpecificDates.evidence.isEvidenceDateAcceptable(fourYearsAgo),
        ).to.be.true;
      });

      it('should reject evidence older than 5 years', () => {
        const sixYearsAgo = moment().subtract(6, 'years').format('YYYY-MM-DD');
        const tenYearsAgo = moment().subtract(10, 'years').format('YYYY-MM-DD');

        expect(
          productSpecificDates.evidence.isEvidenceDateAcceptable(sixYearsAgo),
        ).to.be.false;
        expect(
          productSpecificDates.evidence.isEvidenceDateAcceptable(tenYearsAgo),
        ).to.be.false;
      });

      it('should accept custom max years', () => {
        const twoYearsAgo = moment().subtract(2, 'years').format('YYYY-MM-DD');
        const fourYearsAgo = moment().subtract(4, 'years').format('YYYY-MM-DD');

        expect(
          productSpecificDates.evidence.isEvidenceDateAcceptable(
            twoYearsAgo,
            3,
          ),
        ).to.be.true;
        expect(
          productSpecificDates.evidence.isEvidenceDateAcceptable(
            fourYearsAgo,
            3,
          ),
        ).to.be.false;
      });

      it('should handle invalid dates', () => {
        expect(productSpecificDates.evidence.isEvidenceDateAcceptable(null)).to
          .be.false;
        expect(
          productSpecificDates.evidence.isEvidenceDateAcceptable('invalid'),
        ).to.be.false;
      });
    });

    describe('formatTreatmentPeriod', () => {
      it('should format ongoing treatment', () => {
        const treatment = {
          from: '2020-01-01',
          ongoing: true,
        };
        expect(
          productSpecificDates.evidence.formatTreatmentPeriod(treatment),
        ).to.equal('Since January 2020');
      });

      it('should format treatment without end date', () => {
        const treatment = {
          from: '2020-01-01',
        };
        expect(
          productSpecificDates.evidence.formatTreatmentPeriod(treatment),
        ).to.equal('Since January 2020');
      });

      it('should format completed treatment period', () => {
        const treatment = {
          from: '2020-01-01',
          to: '2020-12-31',
        };
        expect(
          productSpecificDates.evidence.formatTreatmentPeriod(treatment),
        ).to.equal('Jan 2020 - Dec 2020');
      });

      it('should format same month treatment', () => {
        const treatment = {
          from: '2020-01-01',
          to: '2020-01-31',
        };
        expect(
          productSpecificDates.evidence.formatTreatmentPeriod(treatment),
        ).to.equal('January 2020');
      });

      it('should handle missing data', () => {
        expect(
          productSpecificDates.evidence.formatTreatmentPeriod(null),
        ).to.equal('Date unknown');
        expect(
          productSpecificDates.evidence.formatTreatmentPeriod({}),
        ).to.equal('Date unknown');
      });
    });
  });
});
