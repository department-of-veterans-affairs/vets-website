import { expect } from 'chai';
import sinon from 'sinon';
import { navigateForward, pushToRoute } from '../../utilities/page-navigation';
import { ALL_QUESTIONS, ROUTES } from '../../constants';
import { SHORT_NAME_MAP } from '../../constants/question-data-map';

const {
  Q_1_2B_LAW_POLICY_CHANGE,
  Q_1_3A_FEWER_60_DAYS,
  Q_2_0_CLAIM_TYPE,
  Q_2_IS_1A_LAW_POLICY_CHANGE,
  Q_2_H_1_EXISTING_BOARD_APPEAL,
  Q_2_H_2_NEW_EVIDENCE,
} = SHORT_NAME_MAP;
const pushSpy = sinon.spy();

const router = {
  push: pushSpy,
};

beforeEach(() => {
  pushSpy.reset();
});

describe('page navigation utilities', () => {
  describe('pushToRoute', () => {
    it('should navigate to the given route', () => {
      pushToRoute('INTRODUCTION', router);
      expect(router.push.firstCall.calledWith(ROUTES.INTRODUCTION)).to.be.true;
    });

    it('should not navigate to an undefined route', () => {
      pushToRoute('NON_EXISTENT_ROUTE', router);
      expect(router.push.called).to.be.false;
    });
  });

  describe('navigateForward', () => {
    it('should navigate to the route for Q_1_2C_NEW_EVIDENCE for the correct form responses', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: 'Yes',
        Q_1_2_CLAIM_DECISION: 'No',
        Q_1_2A_CONDITION_WORSENED: 'No',
        Q_1_2B_LAW_POLICY_CHANGE: 'No',
      };

      navigateForward(
        ALL_QUESTIONS,
        Q_1_2B_LAW_POLICY_CHANGE,
        formResponses,
        router,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_1_2C_NEW_EVIDENCE)).to.be
        .true;
    });

    it('should navigate to the route for Q_2_H_2_NEW_EVIDENCE for the correct form responses (path #1)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: 'Yes',
        Q_1_2_CLAIM_DECISION: 'Yes',
        Q_1_3_CLAIM_CONTESTED: 'No',
        Q_2_0_CLAIM_TYPE: 'HLR',
        Q_2_H_1_EXISTING_BOARD_APPEAL: 'No',
      };

      navigateForward(
        ALL_QUESTIONS,
        Q_2_H_1_EXISTING_BOARD_APPEAL,
        formResponses,
        router,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_H_2_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_H_2_NEW_EVIDENCE for the correct form responses (path #2)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: 'Yes',
        Q_1_2_CLAIM_DECISION: 'Yes',
        Q_1_3_CLAIM_CONTESTED: 'Yes',
        Q_1_3A_FEWER_60_DAYS: 'Yes',
      };

      navigateForward(
        ALL_QUESTIONS,
        Q_1_3A_FEWER_60_DAYS,
        formResponses,
        router,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_H_2_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_H_2A_JUDGE_HEARING for the correct form responses (path #1)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: 'Yes',
        Q_1_2_CLAIM_DECISION: 'Yes',
        Q_1_3_CLAIM_CONTESTED: 'Yes',
        Q_1_3A_FEWER_60_DAYS: 'Yes',
        Q_2_H_2_NEW_EVIDENCE: 'Yes',
      };

      navigateForward(
        ALL_QUESTIONS,
        Q_2_H_2_NEW_EVIDENCE,
        formResponses,
        router,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_H_2A_JUDGE_HEARING)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_H_2A_JUDGE_HEARING for the correct form responses (path #2)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: 'Yes',
        Q_1_2_CLAIM_DECISION: 'Yes',
        Q_1_3_CLAIM_CONTESTED: 'No',
        Q_2_0_CLAIM_TYPE: 'Higher-Level Review decision',
        Q_2_H_1_EXISTING_BOARD_APPEAL: 'No',
        Q_2_H_2_NEW_EVIDENCE: 'Yes',
      };

      navigateForward(
        ALL_QUESTIONS,
        Q_2_H_2_NEW_EVIDENCE,
        formResponses,
        router,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_H_2A_JUDGE_HEARING)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_IS_1B_NEW_EVIDENCE for the correct form responses (path #1)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: 'Yes',
        Q_1_2_CLAIM_DECISION: 'Yes',
        Q_1_3_CLAIM_CONTESTED: 'No',
        Q_2_0_CLAIM_TYPE: 'Initial claim or claim for increase',
        Q_2_IS_1_SERVICE_CONNECTED: 'Yes',
        Q_2_IS_2_CONDITION_WORSENED: 'No',
        Q_2_IS_1A_LAW_POLICY_CHANGE: 'No',
      };

      navigateForward(
        ALL_QUESTIONS,
        Q_2_IS_1A_LAW_POLICY_CHANGE,
        formResponses,
        router,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_IS_1B_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_IS_1B_NEW_EVIDENCE for the correct form responses (path #2)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: 'Yes',
        Q_1_2_CLAIM_DECISION: 'Yes',
        Q_1_3_CLAIM_CONTESTED: 'No',
        Q_2_0_CLAIM_TYPE: 'Supplemental claim',
        Q_2_IS_1_SERVICE_CONNECTED: 'No',
        Q_2_IS_1A_LAW_POLICY_CHANGE: 'No',
      };

      navigateForward(
        ALL_QUESTIONS,
        Q_2_IS_1A_LAW_POLICY_CHANGE,
        formResponses,
        router,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_IS_1B_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should NOT navigate to the route for Q_2_IS_1_SERVICE_CONNECTED for the incorrect form responses', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: 'Yes',
        Q_1_2_CLAIM_DECISION: 'Yes',
        Q_1_3_CLAIM_CONTESTED: 'No',
        Q_2_0_CLAIM_TYPE: 'Higher-Level Review decision',
      };

      navigateForward(ALL_QUESTIONS, Q_2_0_CLAIM_TYPE, formResponses, router);

      expect(
        router.push.firstCall.calledWith(ROUTES.Q_2_IS_1_SERVICE_CONNECTED),
      ).to.be.false;
    });
  });
});
