import { expect } from 'chai';
import sinon from 'sinon';
import {
  navigateBackward,
  navigateForward,
} from '../../utilities/page-navigation';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

describe('Navigation Utilities', () => {
  let routerMock;
  let setRouteMapMock;
  let routeMap;

  beforeEach(() => {
    routerMock = { push: sinon.spy() };
    setRouteMapMock = sinon.spy();
    routeMap = [ROUTES.HOME, ROUTES.SERVICE_BRANCH, ROUTES.DISCHARGE_YEAR];
  });

  describe('navigateBackward', () => {
    it('should navigate to the last route for non-edit mode', () => {
      navigateBackward(
        routerMock,
        setRouteMapMock,
        routeMap,
        SHORT_NAME_MAP.DISCHARGE_YEAR,
        false,
        false,
        false,
      );

      expect(setRouteMapMock.calledWith([ROUTES.HOME, ROUTES.SERVICE_BRANCH]))
        .to.be.true;
      expect(routerMock.push.calledWith(ROUTES.SERVICE_BRANCH)).to.be.true;
    });

    it('should navigate to the review page for edit mode (non-forkable)', () => {
      navigateBackward(
        routerMock,
        setRouteMapMock,
        [
          ROUTES.HOME,
          ROUTES.SERVICE_BRANCH,
          ROUTES.DISCHARGE_YEAR,
          ROUTES.REASON,
          ROUTES.PREV_APPLICATION,
          ROUTES.REVIEW,
        ],
        SHORT_NAME_MAP.REASON,
        true,
        false,
        false,
      );

      expect(routerMock.push.calledWith(ROUTES.REVIEW)).to.be.true;
    });

    it('should update the route map for edit mode(forkable question)', () => {
      navigateBackward(
        routerMock,
        setRouteMapMock,
        routeMap,
        SHORT_NAME_MAP.DISCHARGE_YEAR,
        true,
        true,
        true,
      );

      expect(setRouteMapMock.calledWith([ROUTES.HOME, ROUTES.SERVICE_BRANCH]))
        .to.be.true;
      expect(routerMock.push.calledWith(ROUTES.SERVICE_BRANCH)).to.be.true;
    });
  });

  describe('navigateForward', () => {
    it('should navigate to the next route', () => {
      const formResponses = {
        SERVICE_BRANCH: RESPONSES.AIR_FORCE,
        DISCHARGE_YEAR: null,
        DISCHARGE_MONTH: null,
        REASON: null,
        DISCHARGE_TYPE: null,
        INTENTION: null,
        COURT_MARTIAL: null,
        PREV_APPLICATION: null,
        PREV_APPLICATION_YEAR: null,
        PREV_APPLICATION_TYPE: null,
        FAILURE_TO_EXHAUST: null,
        PRIOR_SERVICE: null,
        REVIEW: null,
      };
      navigateForward(
        SHORT_NAME_MAP.SERVICE_BRANCH,
        formResponses,
        routerMock,
        false,
        setRouteMapMock,
        [ROUTES.HOME, ROUTES.SERVICE_BRANCH],
        false,
        false,
        '',
      );

      expect(
        setRouteMapMock.calledWith([
          ROUTES.HOME,
          ROUTES.SERVICE_BRANCH,
          ROUTES.DISCHARGE_YEAR,
        ]),
      ).to.be.true;
      expect(routerMock.push.calledWith(ROUTES.DISCHARGE_YEAR)).to.be.true;
    });

    it('should skip questions where display conditions are not met', () => {
      const formResponses = {
        SERVICE_BRANCH: RESPONSES.AIR_FORCE,
        DISCHARGE_YEAR: '2024',
        DISCHARGE_MONTH: null,
        REASON: null,
        DISCHARGE_TYPE: null,
        INTENTION: null,
        COURT_MARTIAL: null,
        PREV_APPLICATION: null,
        PREV_APPLICATION_YEAR: null,
        PREV_APPLICATION_TYPE: null,
        FAILURE_TO_EXHAUST: null,
        PRIOR_SERVICE: null,
        REVIEW: null,
      };
      navigateForward(
        SHORT_NAME_MAP.DISCHARGE_YEAR,
        formResponses,
        routerMock,
        false,
        setRouteMapMock,
        [ROUTES.HOME, ROUTES.SERVICE_BRANCH, ROUTES.DISCHARGE_YEAR],
        false,
        false,
        '',
      );

      expect(
        setRouteMapMock.calledWith([
          ROUTES.HOME,
          ROUTES.SERVICE_BRANCH,
          ROUTES.DISCHARGE_YEAR,
          ROUTES.REASON,
        ]),
      ).to.be.true;
      expect(routerMock.push.calledWith(ROUTES.REASON)).to.be.true;
    });

    it('should handle reaching the end of the flow', () => {
      const formResponses = {
        SERVICE_BRANCH: RESPONSES.AIR_FORCE,
        DISCHARGE_YEAR: 2024,
        DISCHARGE_MONTH: null,
        REASON: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
        DISCHARGE_TYPE: null,
        INTENTION: null,
        COURT_MARTIAL: null,
        PREV_APPLICATION: RESPONSES.PREV_APPLICATION_BCMR,
        PREV_APPLICATION_YEAR: null,
        PREV_APPLICATION_TYPE: null,
        FAILURE_TO_EXHAUST: null,
        PRIOR_SERVICE: null,
        REVIEW: null,
      };
      navigateForward(
        SHORT_NAME_MAP.PREV_APPLICATION,
        formResponses,
        routerMock,
        false,
        setRouteMapMock,
        [
          ROUTES.HOME,
          ROUTES.SERVICE_BRANCH,
          ROUTES.DISCHARGE_YEAR,
          ROUTES.PREV_APPLICATION,
        ],
        false,
        false,
        '',
      );
      expect(routerMock.push.called).to.be.false;
    });
  });
});
