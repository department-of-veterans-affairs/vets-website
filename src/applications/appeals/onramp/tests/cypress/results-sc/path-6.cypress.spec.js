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
} = SHORT_NAME_MAP;
const { RESULTS_SC } = RESULTS_NAME_MAP;

// Results SC: Supplemental Claim recommended
// 1.1 - Yes
// 1.2 - Yes
// 1.3 - No
// 2.0 - HLR
// 2.H.1 - Yes
describe('Decision Reviews Onramp', () => {
  describe('Results SC (path 6)', () => {
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
      h.selectRadio(Q_2_H_1_EXISTING_BOARD_APPEAL, 0);
      h.clickContinue();

      // RESULTS
      h.verifyUrl(ROUTES.RESULTS);
      h.verifyDrResultsHeader(RESULTS_SC);
      h.checkOverviewPanel([c.TITLE_SC]);
      h.checkGoodFitCards([
        {
          type: c.CARD_SC,
          content: [
            c.CARD_REVIEW_HLR,
            c.CARD_NOT_CONTESTED,
            c.CARD_SUBMITTED_BOARD_APPEAL,
          ],
        },
      ]);
      h.checkNotGoodFitCards([
        {
          type: c.CARD_HLR,
          content: [c.CARD_HLR_NOT_AVAILABLE],
        },
        {
          type: c.CARD_BOARD_DIRECT,
          content: [c.CARD_RECEIVED_BOARD_DECISION],
        },
        {
          type: c.CARD_BOARD_EVIDENCE,
          content: [c.CARD_RECEIVED_BOARD_DECISION],
        },
        {
          type: c.CARD_BOARD_HEARING,
          content: [c.CARD_RECEIVED_BOARD_DECISION],
        },
      ]);
      h.verifyOutsideDROptionNotPresent();
      cy.go('back');

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
