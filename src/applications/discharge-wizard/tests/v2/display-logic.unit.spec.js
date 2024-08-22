import { expect } from 'chai';
import sinon from 'sinon';
import { navigateForward } from '../../utilities/page-navigation';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

describe('utilities: display logic', () => {
  describe('navigateForward', () => {
    describe('Routing to discharge year', () => {
      const formResponses = { SERVICE_BRANCH: RESPONSES.ARMY };
      const routeMap = [ROUTES.HOMEPAGE, ROUTES.SERVICE_BRANCH];

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

    describe('Routing to prev application type question by skip ahead', () => {
      const formResponses = {
        SERVICE_BRANCH: RESPONSES.ARMY,
        DISCHARGE_YEAR: '2024',
        REASON: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
      };
      const routeMap = [
        ROUTES.HOMEPAGE,
        ROUTES.SERVICE_BRANCH,
        ROUTES.DISCHARGE_YEAR,
        ROUTES.REASON,
      ];

      const router = {
        push: sinon.spy(),
      };

      it('Should correctly route to the next question based on the specific answer', () => {
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

    describe('Routing to prior service question by skip ahead', () => {
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
        ROUTES.HOMEPAGE,
        ROUTES.SERVICE_BRANCH,
        ROUTES.DISCHARGE_YEAR,
        ROUTES.REASON,
        ROUTES.DISCHARGE_TYPE,
        ROUTES.INTENTION,
        ROUTES.COURT_MARTIAL,
        ROUTES.PREV_APPLICATION,
      ];

      const router = {
        push: sinon.spy(),
      };

      it('Should correctly route to the next question based on the specific answer', () => {
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
