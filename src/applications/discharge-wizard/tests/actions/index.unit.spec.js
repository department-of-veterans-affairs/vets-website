import { expect } from 'chai';
import {
  DUW_UPDATE_FORM_STORE,
  DUW_VIEWED_INTRO_PAGE,
  DUW_UPDATE_SERVICE_BRANCH,
  DUW_UPDATE_DISCHARGE_YEAR,
  DUW_UPDATE_DISCHARGE_MONTH,
  DUW_UPDATE_REASON,
  DUW_UPDATE_DISCHARGE_TYPE,
  DUW_UPDATE_COURT_MARTIAL,
  DUW_UPDATE_INTENTION,
  DUW_UPDATE_PREV_APPLICATION,
  DUW_UPDATE_PREV_APPLICATION_TYPE,
  DUW_UPDATE_PREV_APPLICATION_YEAR,
  DUW_UPDATE_PRIOR_SERVICE,
  DUW_UPDATE_FAILURE_TO_EXHAUST,
  DUW_QUESTION_SELECTED_TO_EDIT,
  DUW_EDIT_MODE,
  DUW_QUESTION_FLOW_CHANGED,
  DUW_ANSWER_CHANGED,
  DUW_ROUTE_MAP,
} from '../../constants';
import { RESPONSES } from '../../constants/question-data-map';
import {
  updateFormStore,
  updateIntroPageViewed,
  updateEditMode,
  updateQuestionFlowChanged,
  updateAnswerChanged,
  updateQuestionSelectedToEdit,
  updateRouteMap,
  updateServiceBranch,
  updateDischargeYear,
  updateDischargeMonth,
  updateReason,
  updateCourtMartial,
  updateIntention,
  updateDischargeType,
  updatePrevApplication,
  updatePrevApplicationYear,
  updatePrevApplicationType,
  updatePriorService,
  updateFailureToExhaust,
} from '../../actions';

describe('Discharge Wizard Redux Actions', () => {
  describe('updateFormStore', () => {
    it('should return an action in the shape we expect', () => {
      const value = 'Army';
      const action = updateFormStore(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_FORM_STORE,
        payload: 'Army',
      });
    });
  });
  describe('updateIntroPageViewed', () => {
    it('should return an action for viewing the intro page', () => {
      const value = true;
      const action = updateIntroPageViewed(value);

      expect(action).to.be.deep.equal({
        type: DUW_VIEWED_INTRO_PAGE,
        payload: true,
      });
    });
  });
  describe('updateEditMode', () => {
    it('should return an action in the shape we expect', () => {
      const value = true;
      const action = updateEditMode(value);

      expect(action).to.be.deep.equal({
        type: DUW_EDIT_MODE,
        payload: true,
      });
    });
  });

  describe('updateQuestionFlowChanged', () => {
    it('should return an action in the shape we expect', () => {
      const value = true;
      const action = updateQuestionFlowChanged(value);

      expect(action).to.be.deep.equal({
        type: DUW_QUESTION_FLOW_CHANGED,
        payload: true,
      });
    });
  });
  describe('updateAnswerChanged', () => {
    it('should return an action in the shape we expect', () => {
      const value = true;
      const action = updateAnswerChanged(value);

      expect(action).to.be.deep.equal({
        type: DUW_ANSWER_CHANGED,
        payload: true,
      });
    });
  });
  describe('updateQuestionSelectedToEdit', () => {
    it('should return an action in the shape we expect', () => {
      const value = 'SERVICE_BRANCH';
      const action = updateQuestionSelectedToEdit(value);

      expect(action).to.be.deep.equal({
        type: DUW_QUESTION_SELECTED_TO_EDIT,
        payload: 'SERVICE_BRANCH',
      });
    });
  });
  describe('updateRouteMap', () => {
    it('should return an action in the shape we expect', () => {
      const value = ['SERVICE_BRANCH'];
      const action = updateRouteMap(value);

      expect(action).to.be.deep.equal({
        type: DUW_ROUTE_MAP,
        payload: ['SERVICE_BRANCH'],
      });
    });
  });
  describe('updateServiceBranch', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.ARMY;
      const action = updateServiceBranch(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_SERVICE_BRANCH,
        payload: RESPONSES.ARMY,
      });
    });
  });
  describe('updateDischargeYear', () => {
    it('should return an action in the shape we expect', () => {
      const value = '2024';
      const action = updateDischargeYear(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_DISCHARGE_YEAR,
        payload: '2024',
      });
    });
  });
  describe('updateDischargeMonth', () => {
    it('should return an action in the shape we expect', () => {
      const value = '1';
      const action = updateDischargeMonth(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_DISCHARGE_MONTH,
        payload: '1',
      });
    });
  });
  describe('updateReason', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.REASON_PTSD;
      const action = updateReason(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_REASON,
        payload: RESPONSES.REASON_PTSD,
      });
    });
  });
  describe('updateCourtMartial', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.COURT_MARTIAL_NO;
      const action = updateCourtMartial(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_COURT_MARTIAL,
        payload: RESPONSES.COURT_MARTIAL_NO,
      });
    });
  });
  describe('updateIntention', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.INTENTION_NO;
      const action = updateIntention(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_INTENTION,
        payload: RESPONSES.INTENTION_NO,
      });
    });
  });
  describe('updateDischargeType', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.DISCHARGE_DISHONORABLE;
      const action = updateDischargeType(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_DISCHARGE_TYPE,
        payload: RESPONSES.DISCHARGE_DISHONORABLE,
      });
    });
  });
  describe('updatePrevApplication', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.NO;
      const action = updatePrevApplication(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_PREV_APPLICATION,
        payload: RESPONSES.NO,
      });
    });
  });
  describe('updatePrevApplicationType', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.PREV_APPLICATION_BCMR;
      const action = updatePrevApplicationType(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_PREV_APPLICATION_TYPE,
        payload: RESPONSES.PREV_APPLICATION_BCMR,
      });
    });
  });
  describe('updatePrevApplicationYear', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.PREV_APPLICATION_AFTER_2011;
      const action = updatePrevApplicationYear(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_PREV_APPLICATION_YEAR,
        payload: RESPONSES.PREV_APPLICATION_AFTER_2011,
      });
    });
  });
  describe('updatePriorService', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.PRIOR_SERVICE_NO;
      const action = updatePriorService(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_PRIOR_SERVICE,
        payload: RESPONSES.PRIOR_SERVICE_NO,
      });
    });
  });
  describe('updateFailureToExhaust', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.FAILURE_TO_EXHAUST_BCMR_NO;
      const action = updateFailureToExhaust(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_FAILURE_TO_EXHAUST,
        payload: RESPONSES.FAILURE_TO_EXHAUST_BCMR_NO,
      });
    });
  });
});

describe('Discharge Wizard Redux Actions', () => {
  describe('updateFormStore', () => {
    it('should return an action in the shape we expect', () => {
      const value = 'Army';
      const action = updateFormStore(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_FORM_STORE,
        payload: 'Army',
      });
    });
  });
  describe('updateIntroPageViewed', () => {
    it('should return an action for viewing the intro page', () => {
      const value = true;
      const action = updateIntroPageViewed(value);

      expect(action).to.be.deep.equal({
        type: DUW_VIEWED_INTRO_PAGE,
        payload: true,
      });
    });
  });
  describe('updateEditMode', () => {
    it('should return an action in the shape we expect', () => {
      const value = true;
      const action = updateEditMode(value);

      expect(action).to.be.deep.equal({
        type: DUW_EDIT_MODE,
        payload: true,
      });
    });
  });

  describe('updateQuestionFlowChanged', () => {
    it('should return an action in the shape we expect', () => {
      const value = true;
      const action = updateQuestionFlowChanged(value);

      expect(action).to.be.deep.equal({
        type: DUW_QUESTION_FLOW_CHANGED,
        payload: true,
      });
    });
  });
  describe('updateAnswerChanged', () => {
    it('should return an action in the shape we expect', () => {
      const value = true;
      const action = updateAnswerChanged(value);

      expect(action).to.be.deep.equal({
        type: DUW_ANSWER_CHANGED,
        payload: true,
      });
    });
  });
  describe('updateQuestionSelectedToEdit', () => {
    it('should return an action in the shape we expect', () => {
      const value = 'SERVICE_BRANCH';
      const action = updateQuestionSelectedToEdit(value);

      expect(action).to.be.deep.equal({
        type: DUW_QUESTION_SELECTED_TO_EDIT,
        payload: 'SERVICE_BRANCH',
      });
    });
  });
  describe('updateRouteMap', () => {
    it('should return an action in the shape we expect', () => {
      const value = ['SERVICE_BRANCH'];
      const action = updateRouteMap(value);

      expect(action).to.be.deep.equal({
        type: DUW_ROUTE_MAP,
        payload: ['SERVICE_BRANCH'],
      });
    });
  });
  describe('updateServiceBranch', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.ARMY;
      const action = updateServiceBranch(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_SERVICE_BRANCH,
        payload: RESPONSES.ARMY,
      });
    });
  });
  describe('updateDischargeYear', () => {
    it('should return an action in the shape we expect', () => {
      const value = '2024';
      const action = updateDischargeYear(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_DISCHARGE_YEAR,
        payload: '2024',
      });
    });
  });
  describe('updateDischargeMonth', () => {
    it('should return an action in the shape we expect', () => {
      const value = '1';
      const action = updateDischargeMonth(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_DISCHARGE_MONTH,
        payload: '1',
      });
    });
  });
  describe('updateReason', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.REASON_PTSD;
      const action = updateReason(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_REASON,
        payload: RESPONSES.REASON_PTSD,
      });
    });
  });
  describe('updateCourtMartial', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.COURT_MARTIAL_NO;
      const action = updateCourtMartial(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_COURT_MARTIAL,
        payload: RESPONSES.COURT_MARTIAL_NO,
      });
    });
  });
  describe('updateIntention', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.INTENTION_NO;
      const action = updateIntention(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_INTENTION,
        payload: RESPONSES.INTENTION_NO,
      });
    });
  });
  describe('updateDischargeType', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.DISCHARGE_DISHONORABLE;
      const action = updateDischargeType(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_DISCHARGE_TYPE,
        payload: RESPONSES.DISCHARGE_DISHONORABLE,
      });
    });
  });
  describe('updatePrevApplication', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.NO;
      const action = updatePrevApplication(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_PREV_APPLICATION,
        payload: RESPONSES.NO,
      });
    });
  });
  describe('updatePrevApplicationType', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.PREV_APPLICATION_BCMR;
      const action = updatePrevApplicationType(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_PREV_APPLICATION_TYPE,
        payload: RESPONSES.PREV_APPLICATION_BCMR,
      });
    });
  });
  describe('updatePrevApplicationYear', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.PREV_APPLICATION_AFTER_2011;
      const action = updatePrevApplicationYear(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_PREV_APPLICATION_YEAR,
        payload: RESPONSES.PREV_APPLICATION_AFTER_2011,
      });
    });
  });
  describe('updatePriorService', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.PRIOR_SERVICE_NO;
      const action = updatePriorService(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_PRIOR_SERVICE,
        payload: RESPONSES.PRIOR_SERVICE_NO,
      });
    });
  });
  describe('updateFailureToExhaust', () => {
    it('should return an action in the shape we expect', () => {
      const value = RESPONSES.FAILURE_TO_EXHAUST_BCMR_NO;
      const action = updateFailureToExhaust(value);

      expect(action).to.be.deep.equal({
        type: DUW_UPDATE_FAILURE_TO_EXHAUST,
        payload: RESPONSES.FAILURE_TO_EXHAUST_BCMR_NO,
      });
    });
  });
});
