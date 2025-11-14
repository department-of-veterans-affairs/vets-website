import { expect } from 'chai';
import sinon from 'sinon-v20';
import { onFormLoaded } from '../../utils';
import { EVIDENCE_URLS } from '../../constants';

describe('onFormLoaded', () => {
  afterEach(() => {
    sinon.restore();
  });

  // ------- RESTORE when new design toggle is removed
  // it('should direct to the correct returnUrl', () => {
  //   const routerSpy = {
  //     push: sinon.spy(),
  //   };
  //   onFormLoaded({ returnUrl: '/housing-risk', router: routerSpy });
  //   expect(routerSpy.push.firstCall.args[0]).to.eq('/housing-risk');
  // });
  // ------- END RESTORE

  // ------- REMOVE when new design toggle is removed
  describe('feature toggle is ON', () => {
    const formData = { scRedesign: true };

    // --> TODO
    describe('user has already saved previous new flow data', () => {});

    describe('user has saved within the evidence flow', () => {
      it('should redirect to the beginning of the new evidence flow', () => {
        const routerSpy = { push: sinon.spy() };

        onFormLoaded({
          formData,
          returnUrl: EVIDENCE_URLS.vaTreatmentDateDetails,
          router: routerSpy,
        });

        expect(routerSpy.push.firstCall.args[0]).to.eq(EVIDENCE_URLS.vaPrompt);
      });
    });
  });

  describe('feature toggle is OFF', () => {
    // --> TODO
    describe('user has saved within the new evidence flow', () => {});

    describe('user is on the old flow and/or does not have any new flow data', () => {
      const routerSpy = { push: sinon.spy() };
      const formData = { scRedesign: false };

      it('should direct to the given returnUrl', () => {
        onFormLoaded({
          formData,
          returnUrl: '/housing-risk',
          router: routerSpy,
        });
        expect(routerSpy.push.firstCall.args[0]).to.eq('/housing-risk');
      });
    });
  });
  // ------- END REMOVE
});
