import * as h from '../helpers';
import { ROUTES } from '../../../constants';
import { SHORT_NAME_MAP } from '../../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../../constants/results-data-map';
import * as c from '../../../constants/results-content/dr-screens/card-content';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_3_CLAIM_CONTESTED,
  Q_2_0_CLAIM_TYPE,
  Q_2_H_1_EXISTING_BOARD_APPEAL,
  Q_2_H_2_NEW_EVIDENCE,
  Q_2_H_2A_JUDGE_HEARING,
} = SHORT_NAME_MAP;
const { RESULTS_BOARD_EVIDENCE } = RESULTS_NAME_MAP;

// Results Board Appeal: Evidence Submission recommended
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.0 - HLR
// 2.H.1 - No
// 2.H.2 - Yes
// 2.H.2A - No
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
      h.selectRadio(Q_1_3_CLAIM_CONTESTED, 1);
      h.clickContinue();

      // Q_2_0_CLAIM_TYPE
      h.verifyUrl(ROUTES.Q_2_0_CLAIM_TYPE);
      h.selectRadio(Q_2_0_CLAIM_TYPE, 2);
      h.clickContinue();

      // Q_2_H_1_EXISTING_BOARD_APPEAL
      h.verifyUrl(ROUTES.Q_2_H_1_EXISTING_BOARD_APPEAL);
      h.selectRadio(Q_2_H_1_EXISTING_BOARD_APPEAL, 1);
      h.clickContinue();

      // Q_2_H_2_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_H_2_NEW_EVIDENCE);
      h.selectRadio(Q_2_H_2_NEW_EVIDENCE, 0);
      h.clickContinue();

      // Q_2_H_2A_JUDGE_HEARING
      h.verifyUrl(ROUTES.Q_2_H_2A_JUDGE_HEARING);
      h.selectRadio(Q_2_H_2A_JUDGE_HEARING, 1);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_BOARD_EVIDENCE);
      h.checkOverviewPanel([c.TITLE_SC, c.TITLE_BOARD_EVIDENCE]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [
            c.CARD_REVIEW_HLR,
            c.CARD_NEW_EVIDENCE,
            c.CARD_NOT_CONTESTED,
          ],
        },
        {
          type: c.CARD_BOARD_EVIDENCE,
          content: [c.CARD_REVIEW_HLR, c.CARD_NEW_EVIDENCE, c.CARD_NO_HEARING],
        },
      ]);
      h.checkNotGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [c.CARD_HLR_NOT_AVAILABLE],
        },
        {
          type: c.CARD_BOARD_DIRECT,
          content: [], // Note that nothing currently shows up, we'll need further guidance on the logic from UX but it can wait for now
        },
        {
          type: c.CARD_BOARD_HEARING,
          content: [c.CARD_HEARING_NOT_DESIRED],
        },
      ]);
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

      // Q_2_H_2A_JUDGE_HEARING
      h.verifyUrl(ROUTES.Q_2_H_2A_JUDGE_HEARING);
      h.clickBack();

      // Q_2_H_2_NEW_EVIDENCE
      h.verifyUrl(ROUTES.Q_2_H_2_NEW_EVIDENCE);
      h.clickBack();

      // Q_2_H_1_EXISTING_BOARD_APPEAL
      h.verifyUrl(ROUTES.Q_2_H_1_EXISTING_BOARD_APPEAL);
      h.clickBack();

      // Q_2_0_CLAIM_TYPE
      h.verifyUrl(ROUTES.Q_2_0_CLAIM_TYPE);
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
