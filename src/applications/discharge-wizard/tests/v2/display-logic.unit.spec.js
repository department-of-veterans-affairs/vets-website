import { expect } from 'chai';
import sinon from 'sinon';
import { navigateForward } from '../../utilities/page-navigation';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

describe('utilities: display logic', () => {
  describe('navigateForward', () => {
    describe('routing to discharge year', () => {
      const formResponses = { SERVICE_BRANCH: RESPONSES.ARMY };

      const router = {
        push: sinon.spy(),
      };

      it('SERVICE_BRANCH: should correctly route to the next question', () => {
        navigateForward(SHORT_NAME_MAP.SERVICE_BRANCH, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.DISCHARGE_YEAR)).to.be
          .true;
      });
    });
  });
});
