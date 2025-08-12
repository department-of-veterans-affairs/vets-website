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
        [mappingTypes.BRANCH_COMPONENT]: {
          [militaryBranchTypes.ARMY]: {
            [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
          },
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
        [mappingTypes.BRANCH_COMPONENT]: {
          [militaryBranchTypes.ARMY]: {
            [militaryBranchComponentTypes.ACTIVE_DUTY]: false,
          },
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
        [mappingTypes.BRANCH_COMPONENT]: {
          [militaryBranchTypes.ARMY]: {
            [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
            [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
          },
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
        [mappingTypes.BRANCH_COMPONENT]: {
          [militaryBranchTypes.ARMY]: {
            [militaryBranchComponentTypes.ACTIVE_DUTY]: false,
            [militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE]: true,
          },
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
        [mappingTypes.BRANCH_COMPONENT]: {
          [militaryBranchTypes.ARMY]: {
            [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
          },
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
        [mappingTypes.BRANCH_COMPONENT]: {
          [militaryBranchTypes.ARMY]: {
            [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
          },
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
        [mappingTypes.BRANCH_COMPONENT]: {
          [militaryBranchTypes.ARMY]: {
            [militaryBranchComponentTypes.ACTIVE_DUTY]: true,
          },
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('GI Bill Benefits - GIB', () => {
    it('should return true with correct criteria', () => {
      const benefit = getBenefitById('GIB');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.UNDERSTAND]: true,
          [goalTypes.SCHOOL]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.HONORABLE]: true,
          [characterOfDischargeTypes.STILL_SERVING]: true,
          [blankType.BLANK]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return false with incorrect disharge', () => {
      const benefit = getBenefitById('GIB');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.UNDERSTAND]: true,
          [goalTypes.SCHOOL]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.BAD_CONDUCT]: true,
          [characterOfDischargeTypes.DISHONORABLE]: true,
          [characterOfDischargeTypes.NOT_SURE]: true,
          [characterOfDischargeTypes.UNCHARACTERIZED]: true,
          [characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL]: true,
          [characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('GIB');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.CAREER]: true,
          [goalTypes.FINANCIAL]: true,
          [goalTypes.HEALTH]: true,
          [goalTypes.PLAN]: true,
          [goalTypes.RETIREMENT]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('DOD SkillBridge program - SBP', () => {
    it('should return true with correct criteria', () => {
      const benefit = getBenefitById('SBP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.UNDERSTAND]: true,
          [goalTypes.RETIREMENT]: true,
          [goalTypes.CAREER]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.HONORABLE]: true,
          [characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL]: true,
          [characterOfDischargeTypes.STILL_SERVING]: true,
          [blankType.BLANK]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return false with incorrect discharge', () => {
      const benefit = getBenefitById('SBP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.UNDERSTAND]: true,
          [goalTypes.RETIREMENT]: true,
          [goalTypes.CAREER]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.BAD_CONDUCT]: true,
          [characterOfDischargeTypes.DISHONORABLE]: true,
          [characterOfDischargeTypes.NOT_SURE]: true,
          [characterOfDischargeTypes.UNCHARACTERIZED]: true,
          [characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('SBP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.HEALTH]: true,
          [goalTypes.PLAN]: true,
          [goalTypes.SCHOOL]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false if not still serving', () => {
      const benefit = getBenefitById('SBP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.HEALTH]: true,
          [goalTypes.PLAN]: true,
          [goalTypes.SCHOOL]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: false,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe("Veterans' Preference in federal hiring - FHV", () => {
    it('should return true with correct criteria', () => {
      const benefit = getBenefitById('FHV');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.CAREER]: true,
          [goalTypes.RETIREMENT]: true,
          [goalTypes.UNDERSTAND]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.HONORABLE]: true,
          [characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL]: true,
          [characterOfDischargeTypes.STILL_SERVING]: true,
          [blankType.BLANK]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return false with incorrect discharge', () => {
      const benefit = getBenefitById('FHV');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.UNDERSTAND]: true,
          [goalTypes.RETIREMENT]: true,
          [goalTypes.CAREER]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.BAD_CONDUCT]: true,
          [characterOfDischargeTypes.DISHONORABLE]: true,
          [characterOfDischargeTypes.NOT_SURE]: true,
          [characterOfDischargeTypes.UNCHARACTERIZED]: true,
          [characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('FHV');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.HEALTH]: true,
          [goalTypes.PLAN]: true,
          [goalTypes.SCHOOL]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
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
    it('should return true with correct criteria', () => {
      const benefit = getBenefitById('TAP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.RETIREMENT]: true,
          [goalTypes.UNDERSTAND]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('TAP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.HEALTH]: true,
          [goalTypes.PLAN]: true,
          [goalTypes.SCHOOL]: true,
          [goalTypes.CAREER]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: true,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false if not still serving', () => {
      const benefit = getBenefitById('TAP');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.CAREER]: true,
          [goalTypes.UNDERSTAND]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: false,
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Veteran Readiness and Employment (Chapter 31) - VRE', () => {
    it('should return true with correct criteria', () => {
      const benefit = getBenefitById('VRE');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.UNDERSTAND]: true,
          [goalTypes.CAREER]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.HONORABLE]: true,
          [characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL]: true,
          [characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS]: true,
          [characterOfDischargeTypes.UNCHARACTERIZED]: true,
          [characterOfDischargeTypes.BAD_CONDUCT]: true,
          [characterOfDischargeTypes.STILL_SERVING]: true,
          [blankType.BLANK]: true,
        },
        [mappingTypes.DISABILITY_RATING]: {
          [disabilityTypes.APPLIED_AND_RECEIVED]: true,
          [disabilityTypes.STARTED]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });

    it('should return false with incorrect discharge', () => {
      const benefit = getBenefitById('VRE');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.UNDERSTAND]: true,
          [goalTypes.CAREER]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: true,
        [mappingTypes.CHARACTER_OF_DISCHARGE]: {
          [characterOfDischargeTypes.DISHONORABLE]: true,
        },
        [mappingTypes.DISABILITY_RATING]: {
          [disabilityTypes.APPLIED_AND_RECEIVED]: true,
          [disabilityTypes.STARTED]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with incorrect goals', () => {
      const benefit = getBenefitById('VRE');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.FINANCIAL]: true,
          [goalTypes.HEALTH]: true,
          [goalTypes.PLAN]: true,
          [goalTypes.SCHOOL]: true,
          [goalTypes.RETIREMENT]: true,
        },
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
        [mappingTypes.DISABILITY_RATING]: {
          [disabilityTypes.APPLIED_AND_RECEIVED]: true,
          [disabilityTypes.STARTED]: true,
        },
      };
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });

    it('should return false with wrong disibility rating', () => {
      const benefit = getBenefitById('VRE');
      const formData = {
        [mappingTypes.GOALS]: {
          [goalTypes.UNDERSTAND]: true,
          [goalTypes.CAREER]: true,
        },
        [mappingTypes.CURRENTLY_SERVING]: false,
        [mappingTypes.CHARACTER_OF_DISCHARGE]:
          characterOfDischargeTypes.HONORABLE,
        [mappingTypes.DISABILITY_RATING]: {
          [disabilityTypes.DENIED]: true,
          [disabilityTypes.NOT_APPLIED]: true,
        },
      };

      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.false;
    });
  });

  describe('Support for your Veteran-owned small business - VSC', () => {
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
          [goalTypes.RETIREMENT]: true,
          [goalTypes.SCHOOL]: true,
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
 *
 * DHS
 *
 * VAP -- wait
 */
