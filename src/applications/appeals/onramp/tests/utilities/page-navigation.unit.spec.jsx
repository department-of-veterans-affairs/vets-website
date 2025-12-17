import { expect } from 'chai';
import sinon from 'sinon-v20';
import { navigateForward, pushToRoute } from '../../utilities/page-navigation';
import { ALL_QUESTIONS, ALL_RESULTS, ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../constants/results-data-map';

const { CFI, HLR, INIT, NO, SC, YES } = RESPONSES;
const { RESULTS_2_H_2B_1 } = RESULTS_NAME_MAP;

const {
  Q_1_2_CLAIM_DECISION,
  Q_1_2B_LAW_POLICY_CHANGE,
  Q_1_3A_FEWER_60_DAYS,
  Q_2_0_CLAIM_TYPE,
  Q_2_IS_1A_LAW_POLICY_CHANGE,
  Q_2_H_2_NEW_EVIDENCE,
  Q_2_H_2A_JUDGE_HEARING,
  Q_2_H_2B_JUDGE_HEARING,
} = SHORT_NAME_MAP;

describe('page navigation utilities', () => {
  const sandbox = sinon.createSandbox();
  const pushSpy = sandbox.spy();
  const updateResultsPageSpy = sandbox.spy();
  let consoleErrorStub;

  const router = {
    push: pushSpy,
  };

  beforeEach(() => {
    pushSpy.resetHistory();
    updateResultsPageSpy.resetHistory();
    consoleErrorStub = sandbox.stub(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('pushToRoute', () => {
    it('should navigate to the given route', () => {
      pushToRoute('INTRODUCTION', router);
      expect(router.push.firstCall.calledWith(ROUTES.INTRODUCTION)).to.be.true;
    });

    it('should not navigate to an undefined route, and log an error', () => {
      pushToRoute('NON_EXISTENT_ROUTE', router);
      expect(router.push.called).to.be.false;
      expect(consoleErrorStub.calledWith('Unable to determine page to display'))
        .to.be.true;
    });
  });

  describe('navigateForward', () => {
    it('should navigate to the route for Q_1_2C_NEW_EVIDENCE for the correct form responses', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: NO,
        Q_1_2A_CONDITION_WORSENED: NO,
        Q_1_2B_LAW_POLICY_CHANGE: NO,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_1_2B_LAW_POLICY_CHANGE,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_1_2C_NEW_EVIDENCE)).to.be
        .true;
    });

    it('should navigate to the route for Q_2_H_2_NEW_EVIDENCE for the correct form responses (path #1)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_IS_1_SERVICE_CONNECTED: NO,
        Q_2_0_CLAIM_TYPE: HLR,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_2_0_CLAIM_TYPE,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_H_2_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_H_2_NEW_EVIDENCE for the correct form responses (path #2)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: YES,
        Q_1_3A_FEWER_60_DAYS: YES,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_1_3A_FEWER_60_DAYS,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_H_2_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_H_2A_JUDGE_HEARING for the correct form responses (path #1)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: YES,
        Q_1_3A_FEWER_60_DAYS: YES,
        Q_2_H_2_NEW_EVIDENCE: YES,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_2_H_2_NEW_EVIDENCE,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_H_2A_JUDGE_HEARING)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_H_2A_JUDGE_HEARING for the correct form responses (path #2)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: HLR,
        Q_2_H_1_EXISTING_BOARD_APPEAL: NO,
        Q_2_H_2_NEW_EVIDENCE: YES,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_2_H_2_NEW_EVIDENCE,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_H_2A_JUDGE_HEARING)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_IS_1B_NEW_EVIDENCE for the correct form responses (path #1)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: INIT,
        Q_2_IS_1_SERVICE_CONNECTED: YES,
        Q_2_IS_2_CONDITION_WORSENED: NO,
        Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_2_IS_1A_LAW_POLICY_CHANGE,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_IS_1B_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_IS_1B_NEW_EVIDENCE for the correct form responses (path #2)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: SC,
        Q_2_IS_1_SERVICE_CONNECTED: NO,
        Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_2_IS_1A_LAW_POLICY_CHANGE,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_IS_1B_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should navigate to the route for Q_2_IS_1B_NEW_EVIDENCE for the correct form responses (path #3)', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: CFI,
        Q_2_IS_1_SERVICE_CONNECTED: YES,
        Q_2_IS_2_CONDITION_WORSENED: NO,
        Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_2_IS_1A_LAW_POLICY_CHANGE,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(router.push.firstCall.calledWith(ROUTES.Q_2_IS_1B_NEW_EVIDENCE)).to
        .be.true;
    });

    it('should NOT navigate to the route for Q_2_IS_1_SERVICE_CONNECTED for the incorrect form responses', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: HLR,
      };

      navigateForward(
        ALL_QUESTIONS,
        ALL_RESULTS,
        Q_2_0_CLAIM_TYPE,
        formResponses,
        router,
        updateResultsPageSpy,
      );

      expect(
        router.push.firstCall.calledWith(ROUTES.Q_2_IS_1_SERVICE_CONNECTED),
      ).to.be.false;
    });

    describe('results pages', () => {
      describe('when the display conditions are met', () => {
        it('should navigate to the route for RESULTS and set the correct results page in the store', () => {
          const formResponses = {
            Q_1_1_CLAIM_DECISION: YES,
            Q_1_2_CLAIM_DECISION: YES,
            Q_1_3_CLAIM_CONTESTED: NO,
            Q_2_IS_1_SERVICE_CONNECTED: NO,
            Q_2_0_CLAIM_TYPE: HLR,
            Q_2_H_2_NEW_EVIDENCE: YES,
            Q_2_H_2A_JUDGE_HEARING: YES,
          };

          navigateForward(
            ALL_QUESTIONS,
            ALL_RESULTS,
            Q_2_H_2A_JUDGE_HEARING,
            formResponses,
            router,
            updateResultsPageSpy,
          );

          expect(router.push.firstCall.calledWith(ROUTES.RESULTS_DR)).to.be
            .true;
          expect(updateResultsPageSpy.firstCall.args[0]).to.equal(
            RESULTS_2_H_2B_1,
          );
        });
      });

      describe('when the end of the question flow is reached but the results page is not found', () => {
        it('should not navigate to a results page or set a results page in the store, and should log an error', () => {
          // Note that one of the form responses is missing from this set to force a no-match
          const formResponses = {
            Q_1_1_CLAIM_DECISION: YES,
            Q_1_3_CLAIM_CONTESTED: NO,
            Q_2_0_CLAIM_TYPE: HLR,
            Q_2_H_1_EXISTING_BOARD_APPEAL: NO,
            Q_2_H_2_NEW_EVIDENCE: NO,
            Q_2_H_2B_JUDGE_HEARING: NO,
          };

          navigateForward(
            ALL_QUESTIONS,
            ALL_RESULTS,
            Q_2_H_2B_JUDGE_HEARING,
            formResponses,
            router,
            updateResultsPageSpy,
          );

          expect(router.push.called).to.be.false;
          expect(
            consoleErrorStub.calledWith('Unable to determine results page'),
          ).to.be.true;
        });
      });

      describe('when the display conditions are NOT met', () => {
        it('should not navigate to a results page or set a results page in the store', () => {
          const formResponses = {
            Q_1_1_CLAIM_DECISION: YES,
            Q_1_2_CLAIM_DECISION: NO,
          };

          navigateForward(
            ALL_QUESTIONS,
            ALL_RESULTS,
            Q_1_2_CLAIM_DECISION,
            formResponses,
            router,
            updateResultsPageSpy,
          );

          expect(router.push.firstCall.calledWith(ROUTES.RESULTS)).to.be.false;
          expect(updateResultsPageSpy.called).to.be.false;
        });
      });
    });
  });
});
