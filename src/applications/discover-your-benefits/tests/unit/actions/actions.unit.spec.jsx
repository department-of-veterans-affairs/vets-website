import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from '../../../reducers/actions';
import { mockFormData } from '../mocks/mockFormData';
import {
  BENEFITS_LIST,
  anyType,
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

  describe('checkSingleResponse', () => {
    it('returns true if mapping is not in condition', () => {
      const benefit = { mappings: {} };
      const formData = {};
      const result = actions.checkSingleResponse(
        benefit,
        formData,
        'NON_EXISTING_MAPPING',
      );
      expect(result).to.be.true;
    });

    it('returns true if mapping type is any', () => {
      const benefit = {
        mappings: {
          GOALS: [anyType.ANY],
        },
      };
      const formData = {};
      const result = actions.checkSingleResponse(
        benefit,
        formData,
        mappingTypes.GOALS,
      );
      expect(result).to.be.true;
    });

    it('returns false if has not served over 4 monnths under title 10', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]:
          timeServedTypes.UP_TO_3_MONTHS,
      };
      const result = actions.checkSingleResponse(
        benefit,
        formData,
        mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE,
      );
      expect(result).to.be.false;
    });

    it('returns false if has not served over 4 monnths of active duty', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.LENGTH_OF_SERVICE]: timeServedTypes.UP_TO_3_MONTHS,
      };
      const result = actions.checkSingleResponse(
        benefit,
        formData,
        mappingTypes.LENGTH_OF_SERVICE,
      );
      expect(result).to.be.false;
    });

    it('returns true if served over 4 monnths under title 10', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]:
          timeServedTypes.UP_TO_6_MONTHS,
      };
      const result = actions.checkSingleResponse(
        benefit,
        formData,
        mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE,
      );
      expect(result).to.be.true;
    });

    it('returns true served over 4 monnths of active duty', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.LENGTH_OF_SERVICE]: timeServedTypes.UP_TO_6_MONTHS,
      };
      const result = actions.checkSingleResponse(
        benefit,
        formData,
        mappingTypes.LENGTH_OF_SERVICE,
      );
      expect(result).to.be.true;
    });
  });

  describe('mapBenefitFromFormInputData', () => {
    it('returns true if benefit passes mapping conditions', () => {
      const benefit = {
        mappings: {
          [mappingTypes.GOALS]: [anyType.ANY],
        },
      };
      const formData = {};
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('returns false if has not served enough time', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.GOALS]: goalTypes.RETIREMENT,
        [mappingTypes.LENGTH_OF_SERVICE]: timeServedTypes.UP_TO_3_MONTHS,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]:
          timeServedTypes.UP_TO_3_MONTHS,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.UNCHARACTERIZED,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('returns true if has served over 4 months under title 10', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.GOALS]: goalTypes.RETIREMENT,
        [mappingTypes.LENGTH_OF_SERVICE]: timeServedTypes.UP_TO_3_MONTHS,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]:
          timeServedTypes.UP_TO_6_MONTHS,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.UNCHARACTERIZED,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: false,
        },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('returns true if has served over 4 months of active duty', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.GOALS]: goalTypes.RETIREMENT,
        [mappingTypes.LENGTH_OF_SERVICE]: timeServedTypes.UP_TO_6_MONTHS,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.UNCHARACTERIZED,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('returns true if has served over 4 months of active duty and title 10', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.GOALS]: goalTypes.RETIREMENT,
        [mappingTypes.LENGTH_OF_SERVICE]: timeServedTypes.UP_TO_6_MONTHS,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]:
          timeServedTypes.UP_TO_6_MONTHS,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.UNCHARACTERIZED,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
        },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('returns false if has not served in active duty or title 10', () => {
      const benefit = getBenefitById('COE');
      const formData = {
        [mappingTypes.GOALS]: goalTypes.RETIREMENT,
        [mappingTypes.LENGTH_OF_SERVICE]: timeServedTypes.UP_TO_6_MONTHS,
        [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]:
          timeServedTypes.UP_TO_6_MONTHS,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.UNCHARACTERIZED,
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: false,
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
        },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: false,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should pass even if only EXPECTED_SEPARATION is set', () => {
      const benefit = getBenefitById('ECC');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.SCHOOL]: true,
          [goalTypes.CAREER]: true,
        },
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.EXPECTED_SEPARATION]:
          expectedSeparationTypes.UP_TO_3_MONTHS,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should pass even if only SEPARATION is set', () => {
      const benefit = getBenefitById('ECC');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.SCHOOL]: true,
          [goalTypes.CAREER]: true,
        },
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.SEPARATION]: {
          [separationTypes.UP_TO_6_MONTHS]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should fail if EXPECTED_SEPERATION and SEPERATION are not set', () => {
      const benefit = getBenefitById('ECC');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.SCHOOL]: true,
          [goalTypes.CAREER]: true,
        },
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('GI Bill Benefits - GIB', () => {
    const validGoals = [goalTypes.UNDERSTAND, goalTypes.SCHOOL];
    const invalidGoals = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = Object.values(characterOfDischargeTypes).filter(
      discharge => !validDischarge.some(discharge2 => discharge2 === discharge),
    );
    it('should return true with valid goals', () => {
      const benefit = getBenefitById('GIB');
      validGoals.forEach(goal => {
        const formData = {
          [mappingTypes.GOALS]: { [goal]: true },
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return true with valid discharge', () => {
      const benefit = getBenefitById('GIB');
      validDischarge.forEach(discharge => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CHARACTER_OF_DISCHARGE]: { [discharge]: true },
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect disharge', () => {
      const benefit = getBenefitById('GIB');
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('GIB');
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('DOD SkillBridge program - SBP', () => {
    const validGoals = [
      goalTypes.RETIREMENT,
      goalTypes.CAREER,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = Object.values(characterOfDischargeTypes).filter(
      discharge => !validDischarge.some(discharge2 => discharge2 === discharge),
    );

    it('should return true with correct goals', () => {
      const benefit = getBenefitById('SBP');
      validGoals.forEach(goal => {
        const formData = {
          [mappingTypes.GOALS]: { [goal]: true },
          [mappingTypes.CURRENTLY_SERVING]: true,
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return true with correct discharge', () => {
      const benefit = getBenefitById('SBP');
      validDischarge.forEach(discharge => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CURRENTLY_SERVING]: true,
          [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect discharge', () => {
      const benefit = getBenefitById('SBP');
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('SBP');
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false if not still serving', () => {
      const benefit = getBenefitById('SBP');
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CURRENTLY_SERVING]: false,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe("Veterans' Preference in federal hiring - FHV", () => {
    const validGoals = [
      goalTypes.RETIREMENT,
      goalTypes.CAREER,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = Object.values(characterOfDischargeTypes).filter(
      discharge => !validDischarge.some(discharge2 => discharge2 === discharge),
    );

    it('should return true with correct goals', () => {
      const benefit = getBenefitById('FHV');
      validGoals.forEach(goal => {
        const formData = {
          [mappingTypes.GOALS]: { [goal]: true },
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return true with correct discharge', () => {
      const benefit = getBenefitById('FHV');
      validDischarge.forEach(discharge => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect discharge', () => {
      const benefit = getBenefitById('FHV');
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('FHV');
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Support for your Veteran-owned small business - SVC', () => {
    it('should return true with correct criteria', () => {
      const benefit = getBenefitById('SVC');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.CAREER]: true,
          [goalTypes.UNDERSTAND]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('SVC');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.HEALTH]: true,
          [goalTypes.PLAN]: true,
          [goalTypes.SCHOOL]: true,
          [goalTypes.RETIREMENT]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Transition Assistance Program - TAP', () => {
    const validGoals = [goalTypes.RETIREMENT, goalTypes.UNDERSTAND];
    const invalidGoals = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );

    it('should return true with correct goals', () => {
      const benefit = getBenefitById('TAP');
      validGoals.forEach(goal => {
        const formData = {
          [mappingTypes.GOALS]: { [goal]: true },
          [mappingTypes.CURRENTLY_SERVING]: true,
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('TAP');
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false if not still serving', () => {
      const benefit = getBenefitById('TAP');
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CURRENTLY_SERVING]: false,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Veteran Readiness and Employment (Chapter 31) - VRE', () => {
    const validGoals = [goalTypes.CAREER, goalTypes.UNDERSTAND];
    const invalidGoals = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.STILL_SERVING,
      characterOfDischargeTypes.BAD_CONDUCT,
      blankType.BLANK,
    ];
    const invalidDischarge = Object.values(characterOfDischargeTypes).filter(
      discharge => !validDischarge.some(discharge2 => discharge2 === discharge),
    );

    const validDisabilityRating = [
      disabilityTypes.APPLIED_AND_RECEIVED,
      disabilityTypes.STARTED,
    ];
    const invalidDisabilityRating = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );

    it('should return true with correct goals', () => {
      const benefit = getBenefitById('VRE');
      validGoals.forEach(goal => {
        const formData = {
          [mappingTypes.GOALS]: { [goal]: true },
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
          [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return true with correct discharge', () => {
      const benefit = getBenefitById('VRE');
      validDischarge.forEach(discharge => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
          [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return true with correct disability rating', () => {
      const benefit = getBenefitById('VRE');
      validDisabilityRating.forEach(rating => {
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
      const benefit = getBenefitById('VRE');
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('VRE');
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        [mappingTypes.DISABILITY_RATING]: formatData(validDisabilityRating),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with wrong disibility rating', () => {
      const benefit = getBenefitById('VRE');
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
    const validGoals = [
      goalTypes.SCHOOL,
      goalTypes.CAREER,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.STILL_SERVING,
      blankType.BLANK,
    ];
    const invalidDischarge = Object.values(characterOfDischargeTypes).filter(
      discharge => !validDischarge.some(discharge2 => discharge2 === discharge),
    );

    it('should return true with correct goals', () => {
      const benefit = getBenefitById('VSC');
      validGoals.forEach(goal => {
        const formData = {
          [mappingTypes.GOALS]: { [goal]: true },
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return true with correct discharge', () => {
      const benefit = getBenefitById('VSC');
      validDischarge.forEach(discharge => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('VSC');
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const benefit = getBenefitById('VSC');
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Disability housing grant - DHS', () => {
    const validGoals = [
      goalTypes.FINANCIAL,
      goalTypes.RETIREMENT,
      goalTypes.UNDERSTAND,
    ];
    const invalidGoals = Object.values(goalTypes).filter(
      goal => !validGoals.some(goal2 => goal2 === goal),
    );
    const validDischarge = [
      characterOfDischargeTypes.HONORABLE,
      characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
      characterOfDischargeTypes.BAD_CONDUCT,
      characterOfDischargeTypes.UNCHARACTERIZED,
      characterOfDischargeTypes.NOT_SURE,
      characterOfDischargeTypes.STILL_SERVING,
    ];
    const invalidDischarge = Object.values(characterOfDischargeTypes).filter(
      discharge => !validDischarge.some(discharge2 => discharge2 === discharge),
    );

    it('should return true with correct goals', () => {
      const benefit = getBenefitById('DHS');
      validGoals.forEach(goal => {
        const formData = {
          [mappingTypes.GOALS]: { [goal]: true },
          [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return true with correct discharge', () => {
      const benefit = getBenefitById('DHS');
      validDischarge.forEach(discharge => {
        const formData = {
          [mappingTypes.GOALS]: formatData(validGoals),
          [mappingTypes.CHARACTER_OF_DISCHARGE]: discharge,
        };
        const result = actions.mapBenefitFromFormInputData(benefit, formData);
        expect(result).to.be.true;
      });
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('DHS');
      const formData = {
        [mappingTypes.GOALS]: formatData(invalidGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(validDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const benefit = getBenefitById('DHS');
      const formData = {
        [mappingTypes.GOALS]: formatData(validGoals),
        [mappingTypes.CHARACTER_OF_DISCHARGE]: formatData(invalidDischarge),
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Veterans Pension - VAP', () => {
    it('should return true with active duty service', () => {
      const benefit = getBenefitById('VAP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.RETIREMENT]: true,
          [goalTypes.UNDERSTAND]: true,
        },
        [mappingTypes.LENGTH_OF_SERVICE]: {
          [timeServedTypes.UP_TO_6_MONTHS]: true,
          [timeServedTypes.UP_TO_1_YEAR]: true,
          [timeServedTypes.UP_TO_2_YEARS]: true,
          [timeServedTypes.UP_TO_3_YEARS]: true,
          [timeServedTypes.OVER_3_YEARS]: true,
        },
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.HONORABLE]: true,
          [characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL]: true,
          [characterOfDischargeTypes.BAD_CONDUCT]: true,
          [characterOfDischargeTypes.UNCHARACTERIZED]: true,
          [characterOfDischargeTypes.NOT_SURE]: true,
          [characterOfDischargeTypes.STILL_SERVING]: true,
          [blankType.BLANK]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return true with Title Ten active duty', () => {
      const benefit = getBenefitById('VAP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.RETIREMENT]: true,
          [goalTypes.UNDERSTAND]: true,
        },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.HONORABLE]: true,
          [characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL]: true,
          [characterOfDischargeTypes.BAD_CONDUCT]: true,
          [characterOfDischargeTypes.UNCHARACTERIZED]: true,
          [characterOfDischargeTypes.NOT_SURE]: true,
          [characterOfDischargeTypes.STILL_SERVING]: true,
          [blankType.BLANK]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return false with only National Guard and Reserve service', () => {
      const benefit = getBenefitById('VAP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.RETIREMENT]: true,
          [goalTypes.UNDERSTAND]: true,
        },
        [militaryBranchTypes.ARMY]: {
          [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
          [militaryBranchComponentTypes.RESERVE_SERVICE]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.HONORABLE]: true,
          [characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL]: true,
          [characterOfDischargeTypes.BAD_CONDUCT]: true,
          [characterOfDischargeTypes.UNCHARACTERIZED]: true,
          [characterOfDischargeTypes.NOT_SURE]: true,
          [characterOfDischargeTypes.STILL_SERVING]: true,
          [blankType.BLANK]: false,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('VAP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.HEALTH]: true,
          [goalTypes.PLAN]: true,
          [goalTypes.SCHOOL]: true,
          [goalTypes.CAREER]: true,
        },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect discharge', () => {
      const benefit = getBenefitById('VAP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.RETIREMENT]: true,
          [goalTypes.UNDERSTAND]: true,
        },
        [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.DISHONORABLE]: true,
          [characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });
});

/**
 * GIB
 * SBP
 * FHV
 * SVC
 * TAP
 * VRE
 * VSC
 * DHS
 *
 * VAP -- wait
 */
