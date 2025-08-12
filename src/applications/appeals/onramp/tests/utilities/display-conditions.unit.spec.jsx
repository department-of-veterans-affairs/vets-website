import { expect } from 'chai';
import { displayConditionsMet } from '../../utilities/display-conditions';
import { RESPONSES } from '../../constants/question-data-map';

const { HLR, INIT, NO, SC, YES } = RESPONSES;

describe('display conditions utilities', () => {
  describe('displayConditionsMet', () => {
    describe('for a question with no display conditions', () => {
      it('should return true', () => {
        expect(displayConditionsMet({}, {})).to.be.true;
      });
    });

    describe('unmet display conditions', () => {
      it('should return false for a standard question', () => {
        const formResponses = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: NO,
          Q_1_2A_CONDITION_WORSENED: NO,
          Q_1_2B_LAW_POLICY_CHANGE: YES,
        };

        const displayConditions = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: NO,
          Q_1_2A_CONDITION_WORSENED: NO,
          Q_1_2B_LAW_POLICY_CHANGE: NO,
        };

        expect(displayConditionsMet(formResponses, displayConditions)).to.be
          .false;
      });

      it('should return false for a ONE_OF question', () => {
        const formResponses = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: YES,
          Q_1_3_CLAIM_CONTESTED: NO,
          Q_2_0_CLAIM_TYPE: SC,
          Q_2_IS_1_SERVICE_CONNECTED: YES,
          Q_2_IS_2_CONDITION_WORSENED: YES,
        };

        const displayConditions = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: YES,
          Q_1_3_CLAIM_CONTESTED: NO,
          Q_2_0_CLAIM_TYPE: [INIT, SC],
          ONE_OF: {
            Q_2_IS_1_SERVICE_CONNECTED: NO,
            Q_2_IS_2_CONDITION_WORSENED: NO,
          },
        };

        expect(displayConditionsMet(formResponses, displayConditions)).to.be
          .false;
      });
    });

    describe('met display conditions', () => {
      it('should return true for a standard question', () => {
        const formResponses = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: YES,
          Q_1_3_CLAIM_CONTESTED: NO,
          Q_2_0_CLAIM_TYPE: HLR,
          Q_2_H_1_EXISTING_BOARD_APPEAL: NO,
          Q_2_H_2_NEW_EVIDENCE: YES,
        };

        const displayConditions = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: YES,
          Q_2_H_2_NEW_EVIDENCE: YES,
        };

        expect(displayConditionsMet(formResponses, displayConditions)).to.be
          .true;
      });

      it('should return true for a ONE_OF question', () => {
        const formResponses = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: YES,
          Q_1_3_CLAIM_CONTESTED: NO,
          Q_2_0_CLAIM_TYPE: INIT,
          Q_2_IS_1_SERVICE_CONNECTED: NO,
          Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
        };

        const displayConditions = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: YES,
          Q_1_3_CLAIM_CONTESTED: NO,
          Q_2_0_CLAIM_TYPE: [INIT, SC],
          Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
          ONE_OF: {
            Q_2_IS_1_SERVICE_CONNECTED: NO,
            Q_2_IS_2_CONDITION_WORSENED: NO,
          },
        };

        expect(displayConditionsMet(formResponses, displayConditions)).to.be
          .true;
      });
    });
  });
});
