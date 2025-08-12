import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_3_CLAIM_CONTESTED,
  Q_1_3A_FEWER_60_DAYS,
  Q_2_H_2_NEW_EVIDENCE,
  Q_2_H_2B_JUDGE_HEARING,
} = SHORT_NAME_MAP;

// Results Board Appeal: Hearing Request recommended
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - Yes
// 1.3A - Yes
// 2.H.2 - No
// 2.H.2B - Yes
describe('Decision Reviews Onramp', () => {
  describe('Results Board (path 1)', () => {
    it('navigates through the flow forward and backward successfully', () => {
      cy.visit(h.ROOT);

      // INTRODUCTION
      h.verifyUrl(ROUTES.INTRODUCTION);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      // Q_1_1_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_1_CLAIM_DECISION);
      h.selectRadio(Q_1_1_CLAIM_DECISION, 0);
      h.clickContinue();

      // Q_1_2_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_2_CLAIM_DECISION);
      h.selectRadio(Q_1_2_CLAIM_DECISION, 0);
      h.clickContinue();

      // Q_1_3_CLAIM_CONTESTED
      h.verifyUrl(ROUTES.Q_1_3_CLAIM_CONTESTED);
      h.selectRadio(Q_1_3_CLAIM_CONTESTED, 0);
      h.clickContinue();

      // Q_1_3A_FEWER_60_DAYS
      h.verifyUrl(ROUTES.Q_1_3A_FEWER_60_DAYS);
      h.selectRadio(Q_1_3A_FEWER_60_DAYS, 0);
      h.clickContinue();

      // Q_2_H_2_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_H_2_NEW_EVIDENCE);
      h.selectRadio(Q_2_H_2_NEW_EVIDENCE, 1);
      h.clickContinue();

      // Q_2_H_2B_JUDGE_HEARING
      h.verifyUrl(ROUTES.Q_2_H_2B_JUDGE_HEARING);
      h.selectRadio(Q_2_H_2B_JUDGE_HEARING, 0);
      h.clickContinue();

      // TODO - Add results page check here

      // Q_2_H_2B_JUDGE_HEARING
      h.verifyUrl(ROUTES.Q_2_H_2B_JUDGE_HEARING);
      h.clickBack();

      // Q_2_H_2_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_H_2_NEW_EVIDENCE);
      h.clickBack();

      // Q_1_3A_FEWER_60_DAYS
      h.verifyUrl(ROUTES.Q_1_3A_FEWER_60_DAYS);
      h.clickBack();

      // Q_1_3_CLAIM_CONTESTED
      h.verifyUrl(ROUTES.Q_1_3_CLAIM_CONTESTED);
      h.clickBack();

      // Q_1_2_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_2_CLAIM_DECISION);
      h.clickBack();

      // Q_1_1_CLAIM_DECISION
      h.verifyUrl(ROUTES.Q_1_1_CLAIM_DECISION);
      h.clickBack();

      // INTRODUCTION
      h.verifyUrl(ROUTES.INTRODUCTION);
    });
  });
});
