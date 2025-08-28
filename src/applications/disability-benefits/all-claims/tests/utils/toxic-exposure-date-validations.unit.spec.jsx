import { expect } from 'chai';
import sinon from 'sinon';
import {
  validateToxicExposureAdditionalExposuresDates,
  validateToxicExposureGulfWar1990Dates,
  validateToxicExposureGulfWar2001Dates,
  validateToxicExposureHerbicideDates,
} from '../../utils/validations';

describe('Toxic Exposure Date Validations', () => {
  describe('validateToxicExposureGulfWar1990Dates', () => {
    let errors;

    beforeEach(() => {
      errors = {
        startDate: {
          addError: sinon.spy(),
        },
        endDate: {
          addError: sinon.spy(),
        },
      };
    });

    it('should add error when startDate is missing but location is selected', () => {
      const fieldData = {
        startDate: undefined,
        endDate: '1991-12-31',
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.startDate.addError.firstCall.args[0]).to.include(
        'Enter a service date that includes the month, day, and year',
      );
    });

    it('should add error when endDate is missing but location is selected', () => {
      const fieldData = {
        startDate: '1991-01-01',
        endDate: undefined,
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      expect(errors.endDate.addError.called).to.be.true;
      expect(errors.endDate.addError.firstCall.args[0]).to.include(
        'Enter a service date that includes the month, day, and year',
      );
    });

    it('should add error when both dates are missing', () => {
      const fieldData = {
        startDate: undefined,
        endDate: undefined,
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
    });

    it('should add error when dates have partial values (XX-01-1991)', () => {
      const fieldData = {
        startDate: 'XX-01-1991',
        endDate: '1991-XX-31',
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
      // Partial dates trigger validation errors
      expect(errors.endDate.addError.firstCall.args[0]).to.include(
        'Enter a service',
      );
    });

    it('should add error when endDate is before startDate', () => {
      const fieldData = {
        startDate: '1991-12-31',
        endDate: '1991-01-01',
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      // The validation should add an error to startDate for invalid range
      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.startDate.addError.firstCall.args[0]).to.include(
        'earlier than your end date',
      );
    });

    it('should add error when endDate is before August 2, 1990', () => {
      const fieldData = {
        startDate: '1990-01-01',
        endDate: '1990-08-01',
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      expect(errors.endDate.addError.called).to.be.true;
      expect(errors.endDate.addError.firstCall.args[0]).to.include(
        'Enter a service end date after August 2, 1990',
      );
    });

    it('should not add errors when dates are valid and complete', () => {
      const fieldData = {
        startDate: '1991-01-01',
        endDate: '1991-12-31',
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.false;
      expect(errors.endDate.addError.called).to.be.false;
    });

    it('should add error when startDate and endDate are the same', () => {
      const fieldData = {
        startDate: '1991-06-15',
        endDate: '1991-06-15',
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      // Same dates trigger validation error since isValidDateRange uses isBefore
      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.startDate.addError.firstCall.args[0]).to.include(
        'earlier than your end date',
      );
    });
  });

  describe('validateToxicExposureGulfWar2001Dates', () => {
    let errors;

    beforeEach(() => {
      errors = {
        startDate: {
          addError: sinon.spy(),
        },
        endDate: {
          addError: sinon.spy(),
        },
      };
    });

    it('should add error when startDate is missing', () => {
      const fieldData = {
        startDate: undefined,
        endDate: '2002-12-31',
      };

      validateToxicExposureGulfWar2001Dates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
    });

    it('should add error when endDate is missing', () => {
      const fieldData = {
        startDate: '2002-01-01',
        endDate: undefined,
      };

      validateToxicExposureGulfWar2001Dates(errors, fieldData);

      expect(errors.endDate.addError.called).to.be.true;
    });

    it('should add error when endDate is before September 11, 2001', () => {
      const fieldData = {
        startDate: '2001-01-01',
        endDate: '2001-09-10',
      };

      validateToxicExposureGulfWar2001Dates(errors, fieldData);

      expect(errors.endDate.addError.called).to.be.true;
      expect(errors.endDate.addError.firstCall.args[0]).to.include(
        'Enter a service end date after September 11, 2001',
      );
    });

    it('should add error when dates are partial', () => {
      const fieldData = {
        startDate: '2002-XX-01',
        endDate: 'XXXX-12-31',
      };

      validateToxicExposureGulfWar2001Dates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
    });

    it('should not add errors for valid dates after 9/11', () => {
      const fieldData = {
        startDate: '2001-09-12',
        endDate: '2002-12-31',
      };

      validateToxicExposureGulfWar2001Dates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.false;
      expect(errors.endDate.addError.called).to.be.false;
    });
  });

  describe('validateToxicExposureHerbicideDates', () => {
    let errors;

    beforeEach(() => {
      errors = {
        startDate: {
          addError: sinon.spy(),
        },
        endDate: {
          addError: sinon.spy(),
        },
      };
    });

    it('should add error when startDate is missing', () => {
      const fieldData = {
        startDate: undefined,
        endDate: '1970-12-31',
      };

      validateToxicExposureHerbicideDates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
    });

    it('should add error when endDate is missing', () => {
      const fieldData = {
        startDate: '1968-01-01',
        endDate: undefined,
      };

      validateToxicExposureHerbicideDates(errors, fieldData);

      expect(errors.endDate.addError.called).to.be.true;
    });

    it('should add error when dates are in wrong order', () => {
      const fieldData = {
        startDate: '1970-12-31',
        endDate: '1968-01-01',
      };

      validateToxicExposureHerbicideDates(errors, fieldData);

      // Error is added to startDate for invalid range
      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.startDate.addError.firstCall.args[0]).to.include(
        'earlier than your end date',
      );
    });

    it('should not add errors for valid date range', () => {
      const fieldData = {
        startDate: '1968-01-01',
        endDate: '1970-12-31',
      };

      validateToxicExposureHerbicideDates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.false;
      expect(errors.endDate.addError.called).to.be.false;
    });
  });

  describe('validateToxicExposureAdditionalExposuresDates', () => {
    let errors;

    beforeEach(() => {
      errors = {
        startDate: {
          addError: sinon.spy(),
        },
        endDate: {
          addError: sinon.spy(),
        },
      };
    });

    it('should add error when dates are missing', () => {
      const fieldData = {
        startDate: undefined,
        endDate: undefined,
      };

      validateToxicExposureAdditionalExposuresDates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
    });

    it('should add error for partial dates', () => {
      const fieldData = {
        startDate: 'XXXX-06-15',
        endDate: '1985-XX-XX',
      };

      validateToxicExposureAdditionalExposuresDates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
    });

    it('should not add errors for valid dates', () => {
      const fieldData = {
        startDate: '1980-01-01',
        endDate: '1985-12-31',
      };

      validateToxicExposureAdditionalExposuresDates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.false;
      expect(errors.endDate.addError.called).to.be.false;
    });
  });

  describe('Edge cases for all toxic exposure date validations', () => {
    let errors;

    beforeEach(() => {
      errors = {
        startDate: {
          addError: sinon.spy(),
        },
        endDate: {
          addError: sinon.spy(),
        },
      };
    });

    it('should handle empty string dates', () => {
      const fieldData = {
        startDate: '',
        endDate: '',
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
    });

    it('should handle null dates', () => {
      const fieldData = {
        startDate: null,
        endDate: null,
      };

      validateToxicExposureHerbicideDates(errors, fieldData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
    });

    it('should handle invalid date formats', () => {
      const fieldData = {
        startDate: 'not-a-date',
        endDate: '31-12-1991',
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      // With validateDateFormat added, invalid dates are now explicitly caught
      // Both dates are invalid formats and should have errors
      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
      expect(errors.startDate.addError.firstCall.args[0]).to.include(
        'Enter a valid date',
      );
      expect(errors.endDate.addError.firstCall.args[0]).to.include(
        'Enter a valid date',
      );
    });

    it('should handle future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const fieldData = {
        startDate: '1991-01-01',
        endDate: futureDateStr,
      };

      validateToxicExposureGulfWar1990Dates(errors, fieldData);

      // Future end date should now properly trigger error after fix
      expect(errors.endDate.addError.called).to.be.true;
      expect(errors.endDate.addError.firstCall.args[0]).to.include(
        'no later than today',
      );
    });
  });

  describe('Integration scenario - User selects location without dates', () => {
    it('should require both dates when Gulf War 1990 location is selected', () => {
      const errors = {
        startDate: { addError: sinon.spy() },
        endDate: { addError: sinon.spy() },
      };

      // Simulate user selecting Bahrain but not entering dates
      const formData = {
        toxicExposure: {
          gulfWar1990: {
            bahrain: true,
          },
          gulfWar1990Details: {
            bahrain: {
              startDate: undefined,
              endDate: undefined,
            },
          },
        },
      };

      // Extract the date data for validation
      const dateData = formData.toxicExposure.gulfWar1990Details.bahrain;
      validateToxicExposureGulfWar1990Dates(errors, dateData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
      expect(errors.startDate.addError.firstCall.args[0]).to.include(
        'Enter a service date that includes the month, day, and year',
      );
      expect(errors.endDate.addError.firstCall.args[0]).to.include(
        'Enter a service date that includes the month, day, and year',
      );
    });

    it('should require both dates when herbicide location is selected', () => {
      const errors = {
        startDate: { addError: sinon.spy() },
        endDate: { addError: sinon.spy() },
      };

      // Simulate user selecting Vietnam but only entering start date
      const formData = {
        toxicExposure: {
          herbicide: {
            vietnam: true,
          },
          herbicideDetails: {
            vietnam: {
              startDate: '1968-06-01',
              endDate: undefined,
            },
          },
        },
      };

      const dateData = formData.toxicExposure.herbicideDetails.vietnam;
      validateToxicExposureHerbicideDates(errors, dateData);

      expect(errors.startDate.addError.called).to.be.false; // Has valid start date
      expect(errors.endDate.addError.called).to.be.true; // Missing end date
    });

    it('should require complete dates when additional exposure is selected', () => {
      const errors = {
        startDate: { addError: sinon.spy() },
        endDate: { addError: sinon.spy() },
      };

      // Simulate user selecting asbestos with partial dates
      const formData = {
        toxicExposure: {
          additionalExposures: {
            asbestos: true,
          },
          additionalExposuresDetails: {
            asbestos: {
              startDate: '1980-XX-XX',
              endDate: '1985-06-XX',
            },
          },
        },
      };

      const dateData =
        formData.toxicExposure.additionalExposuresDetails.asbestos;
      validateToxicExposureAdditionalExposuresDates(errors, dateData);

      expect(errors.startDate.addError.called).to.be.true;
      expect(errors.endDate.addError.called).to.be.true;
    });
  });
});
