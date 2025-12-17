import * as h from './helpers';
import { ROUTES } from '../../constants';
import { SHORT_NAME_MAP } from '../../constants/question-data-map';
import {
  QUESTION_STANDARD_ERROR,
  QUESTION_DECISION_TYPE_ERROR,
} from '../../components/RadioQuestion';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_2_CLAIM_DECISION,
  Q_1_3_CLAIM_CONTESTED,
  Q_2_IS_1_SERVICE_CONNECTED,
  Q_2_0_CLAIM_TYPE,
  Q_2_H_2_NEW_EVIDENCE,
  Q_2_H_2A_JUDGE_HEARING,
} = SHORT_NAME_MAP;

describe('Decision Reviews Onramp', () => {
  describe('Form validation', () => {
    const checkPageErrorHandling = (
      shortName,
      responseIndex, // 0 for yes, 1 for no, etc.
      isClaimType = false,
    ) => {
      h.verifyUrl(ROUTES[shortName]);
      h.verifyFormErrorDoesNotExist(shortName);

      const errorText = isClaimType
        ? QUESTION_DECISION_TYPE_ERROR
        : QUESTION_STANDARD_ERROR;

      // Force error state
      h.clickContinue();
      h.checkFormAlertText(shortName, `Error${errorText}`);

      // Click radio to clear error state and validate
      h.selectRadio(shortName, responseIndex);
      h.verifyFormErrorDoesNotExist(shortName);

      h.clickContinue();
    };

    it('displays the correct error text when no response is selected', () => {
      cy.visit(h.ROOT);

      // INTRODUCTION
      h.verifyUrl(ROUTES.INTRODUCTION);
      cy.injectAxeThenAxeCheck();
      h.clickStart();

      checkPageErrorHandling(Q_1_1_CLAIM_DECISION, 0);
      checkPageErrorHandling(Q_1_2_CLAIM_DECISION, 0);
      checkPageErrorHandling(Q_1_3_CLAIM_CONTESTED, 1);
      checkPageErrorHandling(Q_2_IS_1_SERVICE_CONNECTED, 1);
      checkPageErrorHandling(Q_2_0_CLAIM_TYPE, 3, true);
      checkPageErrorHandling(Q_2_H_2_NEW_EVIDENCE, 0);
      checkPageErrorHandling(Q_2_H_2A_JUDGE_HEARING, 0);
    });
  });
});
