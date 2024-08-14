import { expect } from 'chai';
import sinon from 'sinon';
import { navigateForward } from '../../utilities/page-navigation';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

describe('utilities: display logic', () => {
  describe('navigateForward', () => {
    describe('routing to discharge year', () => {
      const formResponses = { SERVICE_BRANCH: RESPONSES.ARMY };
      const routeMap = ['introduction', 'service-branch'];

      const router = {
        push: sinon.spy(),
      };

      it('SERVICE_BRANCH: should correctly route to the next question', () => {
        navigateForward(
          SHORT_NAME_MAP.SERVICE_BRANCH,
          formResponses,
          router,
          false,
          () => {},
          routeMap,
        );
        expect(router.push.firstCall.calledWith(ROUTES.DISCHARGE_YEAR)).to.be
          .true;
      });
    });

    describe('routing to prev application type question by skip ahead', () => {
      const formResponses = {
        SERVICE_BRANCH: RESPONSES.ARMY,
        DISCHARGE_YEAR: '2024',
        REASON: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
      };
      const routeMap = [
        'introduction',
        'service-branch',
        'discharge-year',
        'reason',
      ];

      const router = {
        push: sinon.spy(),
      };

      it('Reason: should correctly route to the next question based on the specific answer', () => {
        navigateForward(
          SHORT_NAME_MAP.REASON,
          formResponses,
          router,
          false,
          () => {},
          routeMap,
        );
        expect(router.push.firstCall.calledWith(ROUTES.PREV_APPLICATION_TYPE))
          .to.be.true;
      });
    });

    describe('routing to prior service question by skip ahead', () => {
      const formResponses = {
        SERVICE_BRANCH: RESPONSES.ARMY,
        DISCHARGE_YEAR: '2024',
        REASON: RESPONSES.REASON_SEXUAL_ORIENTATION,
        DISCHARGE_TYPE: RESPONSES.DISCHARGE_DISHONORABLE,
        INTENTION: RESPONSES.INTENTION_YES,
        COURT_MARTIAL: RESPONSES.COURT_MARTIAL_YES,
        PREV_APPLICATION: RESPONSES.NO,
      };

      const routeMap = [
        'introduction',
        'service-branch',
        'discharge-year',
        'reason',
        'discharge-type',
        'intention',
        'court-martial',
        'prev-application',
      ];

      const router = {
        push: sinon.spy(),
      };

      it('Reason: should correctly route to the next question based on the specific answer', () => {
        navigateForward(
          SHORT_NAME_MAP.PREV_APPLICATION,
          formResponses,
          router,
          false,
          () => {},
          routeMap,
        );
        expect(router.push.firstCall.calledWith(ROUTES.PRIOR_SERVICE)).to.be
          .true;
      });
    });
  });
});
