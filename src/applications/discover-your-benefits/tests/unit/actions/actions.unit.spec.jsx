import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from '../../../reducers/actions';
import { mockFormData } from '../mocks/mockFormData';
import {
  BENEFITS_LIST,
  mappingTypes,
  characterOfDischargeTypes,
  timeServedTypes,
  goalTypes,
  expectedSeparationTypes,
  separationTypes,
  militaryBranchTypes,
  militaryBranchComponentTypes,
  blankType,
  disabilityTypes,
} from '../../../constants/benefits';

const getBenefitById = id => {
  for (let i = 0; i < BENEFITS_LIST.length; i++) {
    if (BENEFITS_LIST[i].id === id) {
      return BENEFITS_LIST[i];
    }
  }
  return {};
};

const formatData = list => {
  const result = {};
  list.forEach(item => {
    result[item] = true;
  });
  return result;
};

const getInvalidMappingValues = (validMappingValues, allMappings) => {
  return Object.values(allMappings).filter(
    value1 => !validMappingValues.some(value2 => value2 === value1),
  );
};

describe('actions', () => {
  describe('getResults', () => {
    it('returns valid response when formData is passed', async () => {
      const dispatch = sinon.spy();
      actions
        .getResults(mockFormData)(dispatch)
        .then(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            'FETCH_RESULTS_STARTED',
          );

          expect(dispatch.secondCall.args[0].type).to.equal(
            'FETCH_RESULTS_SUCCESS',
          );

          const expectedResults = BENEFITS_LIST.filter(b =>
            ['GIB', 'FHV', 'SVC', 'VSC'].includes(b.id),
          );
          expect(dispatch.secondCall.args[0].payload).to.equal(expectedResults);
        });
    });
  });

  describe('displayResults', () => {
    it('dispatches FETCH_RESULTS_STARTED and FETCH_RESULTS_SUCCESS with valid benefit ids', async () => {
      const dispatch = sinon.spy();
      await actions.displayResults(['GIB', 'SBP'])(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal('FETCH_RESULTS_STARTED');
      expect(dispatch.secondCall.args[0].type).to.equal(
        'FETCH_RESULTS_SUCCESS',
      );

      const expectedResults = BENEFITS_LIST.filter(b =>
        ['GIB', 'SBP'].includes(b.id),
      );
      expect(dispatch.secondCall.args[0].payload).to.eql(expectedResults);
    });

    it('dispatches FETCH_RESULTS_FAILURE when an error occurs during displayResults', async () => {
      const dispatch = sinon.spy();
      const invalidIds = null;

      await actions
        .displayResults(invalidIds)(dispatch)
        .catch(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            'FETCH_RESULTS_STARTED',
          );
          expect(dispatch.secondCall.args[0].type).to.equal(
            'FETCH_RESULTS_FAILURE',
          );
          expect(dispatch.secondCall.args[0].error).to.exist;
        });
    });
  });

  describe('GI Bill Benefits - GIB', () => {
    const benefit = getBenefitById('GIB');
    const validGoals = [goalTypes.UNDERSTAND, goalTypes.SCHOOL];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: { [discharge]: true },
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect disharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('DOD SkillBridge program - SBP', () => {
    const benefit = getBenefitById('SBP');
    const validGoals = [
      goalTypes.RETIREMENT,
      goalTypes.CAREER,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false if not still serving', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CURRENTLY_SERVING]: false,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Educational and career counseling (Chapter 36) - ECC', () => {
    const benefit = getBenefitById('ECC');
    const validGoals = [
      goalTypes.SCHOOL,
      goalTypes.CAREER,
      goalTypes.RETIREMENT,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validExpectedSeperation = [
      expectedSeparationTypes.UP_TO_3_MONTHS,
      expectedSeparationTypes.MORE_THAN_3_MONTHS_LESS_THAN_6_MONTHS,
    ];
    const invalidExpectedSeperation = getInvalidMappingValues(
      validExpectedSeperation,
      expectedSeparationTypes,
    );
    const validSeperation = [
      separationTypes.UP_TO_3_MONTHS,
      separationTypes.UP_TO_6_MONTHS,
      separationTypes.UP_TO_1_YEAR,
    ];
    const invalidSeperation = getInvalidMappingValues(
      validSeperation,
      separationTypes,
    );
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.SEPARATION]: formatData(validSeperation),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.EXPECTED_SEPARATION]: formatData(validExpectedSeperation),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validSeperation.forEach(seperation => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.SEPARATION]: seperation,
        [mappingTypes.EXPECTED_SEPARATION]: formatData(
          invalidExpectedSeperation,
        ),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with valid seperation: ${seperation}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validExpectedSeperation.forEach(seperation => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.SEPARATION]: formatData(invalidSeperation),
        [mappingTypes.EXPECTED_SEPARATION]: seperation,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with valid expected seperation: ${seperation}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.SEPARATION]: formatData(validSeperation),
        [mappingTypes.EXPECTED_SEPARATION]: formatData(validSeperation),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.SEPARATION]: formatData(validSeperation),
        [mappingTypes.EXPECTED_SEPARATION]: formatData(validSeperation),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect seperation', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.SEPARATION]: formatData(invalidSeperation),
        [mappingTypes.EXPECTED_SEPARATION]: formatData(invalidSeperation),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with no title ten or acticve duty', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: false,
        [mappingTypes.SEPARATION]: formatData(validSeperation),
        [mappingTypes.EXPECTED_SEPARATION]: formatData(validSeperation),
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: false,
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
          [militaryBranchComponentTypes.RESERVE_SERVICE]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe("Veterans' Preference in federal hiring - FHV", () => {
    const benefit = getBenefitById('FHV');
    const validGoals = [
      goalTypes.RETIREMENT,
      goalTypes.CAREER,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Support for your Veteran-owned small business - SVC', () => {
    const benefit = getBenefitById('SVC');
    const validGoals = [goalTypes.CAREER, goalTypes.UNDERSTAND];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Transition Assistance Program - TAP', () => {
    const benefit = getBenefitById('TAP');
    const validGoals = [goalTypes.RETIREMENT, goalTypes.UNDERSTAND];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false if not still serving', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CURRENTLY_SERVING]: false,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Veteran Readiness and Employment (Chapter 31) - VRE', () => {
    const benefit = getBenefitById('VRE');
    const validGoals = [goalTypes.CAREER, goalTypes.UNDERSTAND];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.STILL_SERVING,
      characterOfDischargeTypes.BAD_CONDUCT,
      blankType.BLANK,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    const validDisabilityRating = [
      disabilityTypes.APPLIED_AND_RECEIVED,
      disabilityTypes.STARTED,
    ];
    const invalidDisabilityRating = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDisabilityRating.forEach(rating => {
      it('should return true with correct disability rating', () => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
          [mappingTypes.DISABILITY_RATING]: rating,
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with wrong disibility rating', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(invalidDisabilityRating),
      };

      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('VetSuccess on Campus (VSOC) - VSC', () => {
    const benefit = getBenefitById('VSC');
    const validGoals = [
      goalTypes.SCHOOL,
      goalTypes.CAREER,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Disability housing grant - DHS', () => {
    const benefit = getBenefitById('DHS');
    const validGoals = [
      goalTypes.FINANCIAL,
      goalTypes.RETIREMENT,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Veterans Pension - VAP', () => {
    const benefit = getBenefitById('VAP');
    const validGoals = [
      goalTypes.FINANCIAL,
      goalTypes.RETIREMENT,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );
    const validLengthOfService = [
      timeServedTypes.FOUR_MONTHS_TO_3_YEARS,
      timeServedTypes.THREE_YEARS_TO_10_YEARS,
      timeServedTypes.TEN_YEARS_TO_20_YEARS,
      timeServedTypes.OVER_20_YEARS,
    ];
    const invalidLengthOfService = getInvalidMappingValues(
      validLengthOfService,
      timeServedTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validLengthOfService.forEach(service => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.LENGTH_OF_SERVICE]: service,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with active duty and length of service: ${service}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return true with Title Ten active duty', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    invalidLengthOfService.forEach(service => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.LENGTH_OF_SERVICE]: service,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return false with length of service: ${service}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.false;
      });
    });

    it('should return false with only National Guard and Reserve service', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
          [militaryBranchComponentTypes.RESERVE_SERVICE]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('VA mental health services - MHC', () => {
    const benefit = getBenefitById('MHC');
    const validGoals = [goalTypes.HEALTH, goalTypes.UNDERSTAND];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Foreign Medical Program - FMP', () => {
    const benefit = getBenefitById('FMP');
    const validGoals = [goalTypes.HEALTH, goalTypes.UNDERSTAND];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );
    const validDisabilityRating = [
      disabilityTypes.APPLIED_AND_RECEIVED,
      disabilityTypes.STARTED,
    ];
    const invalidDisabilityRating = getInvalidMappingValues(
      validDisabilityRating,
      disabilityTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDisabilityRating.forEach(rating => {
      it('should return true with correct disability rating', () => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
          [mappingTypes.DISABILITY_RATING]: rating,
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect disbility rating', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(invalidDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe("'Veterans' Group Life Insurance - VGLI", () => {
    const benefit = getBenefitById('VGL');
    const validGoals = [
      goalTypes.RETIREMENT,
      goalTypes.UNDERSTAND,
      goalTypes.PLAN,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validSeperation = [
      separationTypes.UP_TO_3_MONTHS,
      separationTypes.UP_TO_6_MONTHS,
      separationTypes.UP_TO_1_YEAR,
      separationTypes.UP_TO_2_YEARS,
    ];
    const invalidSeperation = getInvalidMappingValues(
      validSeperation,
      separationTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.SEPARATION]: formatData(validSeperation),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validSeperation.forEach(seperation => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.SEPARATION]: seperation,
      };
      it(`should return true with seperation: ${seperation}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.SEPARATION]: formatData(validSeperation),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect seperation', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.SEPARATION]: formatData(invalidSeperation),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Veterans Affairs Life Insurance (VALife) - VAL', () => {
    const benefit = getBenefitById('VAL');
    const validGoals = [
      goalTypes.RETIREMENT,
      goalTypes.UNDERSTAND,
      goalTypes.PLAN,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );
    const validDisabilityRating = [
      disabilityTypes.APPLIED_AND_RECEIVED,
      disabilityTypes.STARTED,
    ];
    const invalidDisabilityRating = getInvalidMappingValues(
      validDisabilityRating,
      disabilityTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDisabilityRating.forEach(rating => {
      it('should return true with correct disability rating', () => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
          [mappingTypes.DISABILITY_RATING]: rating,
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect disbility rating', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(invalidDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Disability compensation - DIS', () => {
    const benefit = getBenefitById('DIS');
    const validGoals = [
      goalTypes.FINANCIAL,
      goalTypes.RETIREMENT,
      goalTypes.HEALTH,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('VA health care - VAH', () => {
    const benefit = getBenefitById('VAH');
    const validGoals = [
      goalTypes.RETIREMENT,
      goalTypes.HEALTH,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with no title ten and no active duty', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.BRANCH_COMPONENT.TITLE_TEN_ACTIVE_DUTY]: false,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
          [militaryBranchComponentTypes.RESERVE_SERVICE]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('VA-backed home loans - COE', () => {
    const benefit = getBenefitById('COE');
    const validGoals = [goalTypes.RETIREMENT, goalTypes.UNDERSTAND];
    const validLengthOfService = [
      timeServedTypes.FOUR_MONTHS_TO_3_YEARS,
      timeServedTypes.THREE_YEARS_TO_10_YEARS,
      timeServedTypes.TEN_YEARS_TO_20_YEARS,
      timeServedTypes.OVER_20_YEARS,
    ];
    const invalidLengthOfService = getInvalidMappingValues(
      validLengthOfService,
      timeServedTypes,
    );
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.LENGTH_OF_SERVICE]: formatData(validLengthOfService),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: formatData(
          validLengthOfService,
        ),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validLengthOfService.forEach(service => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: service,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with title ten length of service: ${service}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validLengthOfService.forEach(service => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.LENGTH_OF_SERVICE]: service,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      it(`should return true with length of service: ${service}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: formatData(
          validLengthOfService,
        ),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: formatData(
          validLengthOfService,
        ),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect length of service', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: formatData(
          invalidLengthOfService,
        ),
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.LENGTH_OF_SERVICE]: formatData(invalidLengthOfService),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with no title ten or acticve duty', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: false,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: formatData(
          validLengthOfService,
        ),
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: false,
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
          [militaryBranchComponentTypes.RESERVE_SERVICE]: true,
        },
        [mappingTypes.LENGTH_OF_SERVICE]: formatData(validLengthOfService),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('VA national cemetery burial - BUR', () => {
    const benefit = getBenefitById('BUR');
    const validGoals = [goalTypes.UNDERSTAND, goalTypes.PLAN];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with no title ten and no active duty', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.BRANCH_COMPONENT.TITLE_TEN_ACTIVE_DUTY]: false,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
          [militaryBranchComponentTypes.RESERVE_SERVICE]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Transfer your GI Bill benefits - TGI', () => {
    const benefit = getBenefitById('TGI');
    const validGoals = [goalTypes.SCHOOL, goalTypes.UNDERSTAND];
    const invalidGoals = getInvalidMappingValues(validGoals, goalTypes);
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(
      validDischarge,
      characterOfDischargeTypes,
    );

    validGoals.forEach(goal => {
      const formData = {
        [mappingTypes.GOALS]: { [goal]: true },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      it(`should return true with goal: ${goal}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false if not still serving', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.CURRENTLY_SERVING]: false,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Apply for a discharge upgrade - DCU', () => {
    const benefit = getBenefitById('DCU');
    const validDischarge = [
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.DISHONORABLE,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = getInvalidMappingValues(validDischarge, goalTypes);
    validDischarge.forEach(discharge => {
      const formData = {
        [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
      };
      it(`should return true with discharge: ${discharge}`, () => {
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect discharge', () => {
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe("State Veterans' Benefits - SVB", () => {
    const benefit = getBenefitById('SVB');
    const formData = {};
    it('should return true with any input', () => {
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });
  });

  // describe('Employment Navigator & Partnership Program - ENPP', () => {
  //   const benefit = getBenefitById('ENPP');
  //   const validGoal = [
  //     goalTypes.RETIREMENT,
  //     goalTypes.CAREER,
  //     goalTypes.UNDERSTAND,
  //     goalTypes.PLAN,
  //   ];
  //   const invalidGoal = getInvalidMappingValues(validGoal, goalTypes);
  //   const validSeparation = [
  //     separationTypes.UP_TO_3_MONTHS,
  //     separationTypes.UP_TO_6_MONTHS,
  //     separationTypes.UP_TO_1_YEAR,
  //   ];
  //   const invalidSeparation = getInvalidMappingValues(
  //     validSeparation,
  //     separationTypes,
  //   );

  //   validGoal.forEach(goal => {
  //     const formData = {
  //       [mappingTypes.GOALS]: goal,
  //       [mappingTypes.SEPARATION]: formatData(validSeparation),
  //     };
  //     it(`should return true with goal: ${goal}`, () => {
  //       const result = actions.mapBenefitFromFormInputData(benefit, formData);
  //       expect(result).to.be.true;
  //     });
  //   });
  //
  //   validSeparation.forEach(separation => {
  //     const formData = {
  //       [mappingTypes.GOALS]: formatData(validGoal),
  //       [mappingTypes.SEPARATION]: separation,
  //     };
  //     it(`should return true with separation: ${separation}`, () => {
  //       const result = actions.mapBenefitFromFormInputData(benefit, formData);
  //       expect(result).to.be.true;
  //     });
  //   });

  //   it(`should return false with incorrect goals`, () => {
  //     const formData = {
  //       [mappingTypes.GOALS]: formatData(invalidGoal),
  //       [mappingTypes.SEPARATION]: formatData(validSeparation),
  //     };
  //     const result = actions.mapBenefitFromFormInputData(benefit, formData);
  //     expect(result).to.be.false;
  //   });

  //   it(`should return false with incorrect separation`, () => {
  //     const formData = {
  //       [mappingTypes.GOALS]: formatData(validGoal),
  //       [mappingTypes.SEPARATION]: formatData(invalidSeparation),
  //     };
  //     const result = actions.mapBenefitFromFormInputData(benefit, formData);
  //     expect(result).to.be.false;
  //   });
  // });
});
