import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventObject from 'platform/monitoring/record-event';
import { describe } from 'mocha';
import * as Sentry from '@sentry/browser';
import {
  cardActionMiddleware,
  ifMissingParamsCallSentry,
  handleCardAction,
} from '../../../../components/webchat/helpers/webChat';

const sandbox = sinon.createSandbox();

describe('Webchat.jsx Helpers', () => {
  afterEach(() => {
    sandbox.restore();
  });
  describe('cardActionMiddleware', () => {
    /**
     * create a fake action card
     * @param {string} value url for the cardAction
     * @returns {{cardAction: {value: string}}} fake cardAction card
     */
    const generateFakeCard = (value, type = 'openUrl') => ({
      cardAction: { value, type },
    });
    /**
     * creates sinon functions for the tests
     * @returns {{nextSpy: SinonSpy, recordEventStub: SinonStub}}
     *          an object containing sinon functions for next and recordEvent
     */

    const generateSinonFunctions = () => ({
      nextSpy: sandbox.spy(),
      recordEventStub: sandbox.stub(recordEventObject, 'default'),
    });

    describe('cardActionMiddleware', () => {
      it('should call recordEvent and next when card is a decision letter', () => {
        const decisionLetterCard = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
        );
        const { nextSpy, recordEventStub } = generateSinonFunctions();
        const dateStub = sandbox.stub(Date, 'now');
        dateStub.returns(1234567890);
        const recordEventData = {
          event: 'file_download',
          'button-click-label': 'Decision Letter',
          time: new Date(Date.now()),
        };
        cardActionMiddleware()(nextSpy)(decisionLetterCard);

        expect(recordEventStub.calledOnce).to.be.true;
        expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);

        expect(nextSpy.calledOnce).to.be.true;
        expect(nextSpy.firstCall.args[0]).to.eql(decisionLetterCard);
        dateStub.restore();
      });

      it('should not call recordEvent when card is not a decision letter', () => {
        const nonDecisionLetterCard = generateFakeCard(
          'random_thing_we_dont_use',
        );
        const { nextSpy, recordEventStub } = generateSinonFunctions();
        cardActionMiddleware()(nextSpy)(nonDecisionLetterCard);
        expect(recordEventStub.notCalled).to.be.true;
        expect(nextSpy.calledOnce).to.be.true;
        expect(nextSpy.firstCall.args[0]).to.eql(nonDecisionLetterCard);
      });
      it('should not call recordEvent when cardAction.type is not openUrl', () => {
        const notOpenUrl = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
          'notOpenUrl',
        );
        const { nextSpy, recordEventStub } = generateSinonFunctions();
        cardActionMiddleware()(nextSpy)(notOpenUrl);
        expect(recordEventStub.notCalled).to.be.true;
        expect(nextSpy.calledOnce).to.be.true;
        expect(nextSpy.firstCall.args[0]).to.eql(notOpenUrl);
      });
      describe('handleCardAction', () => {
        it('should call recordEvent when button with class in classList is clicked in Rx skill', () => {
          const mockCardTargetClassList = ['webchat__suggested-action'];
          const mockCardActionValue = 'button-text';
          const mockIsRxSkill = 'true';

          const recordEventStub = sandbox.stub(recordEventObject, 'default');

          handleCardAction(
            mockCardTargetClassList,
            mockCardActionValue,
            mockIsRxSkill,
          );

          const recordEventData = {
            event: 'chatbot-button-click',
            clickText: mockCardActionValue,
            topic: 'prescriptions',
          };

          expect(recordEventStub.calledOnce).to.be.true;
          expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
        });
        it('should call recordEvent when button with class in classList is clicked outside Rx skill', () => {
          const mockCardTargetClassList = ['webchat__suggested-action'];
          const mockCardActionValue = 'button-text';
          const mockIsRxSkill = 'false';

          const recordEventStub = sandbox.stub(recordEventObject, 'default');

          handleCardAction(
            mockCardTargetClassList,
            mockCardActionValue,
            mockIsRxSkill,
          );

          const recordEventData = {
            event: 'chatbot-button-click',
            clickText: mockCardActionValue,
            topic: undefined,
          };

          expect(recordEventStub.calledOnce).to.be.true;
          expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
        });
        it('should call recordEvent when button with class in classList is clicked outside Rx skill', () => {
          const mockCardTargetClassList = ['webchat__suggested-action'];
          const mockCardActionValue = 'button-text';
          const mockIsRxSkill = 'false';

          const recordEventStub = sandbox.stub(recordEventObject, 'default');

          handleCardAction(
            mockCardTargetClassList,
            mockCardActionValue,
            mockIsRxSkill,
          );

          const recordEventData = {
            event: 'chatbot-button-click',
            clickText: mockCardActionValue,
            topic: undefined,
          };

          expect(recordEventStub.calledOnce).to.be.true;
          expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
        });
        it('should call recordEvent when button with class in classList is clicked outside Rx skill', () => {
          const mockCardTargetClassList = ['some_unexpected_class'];
          const mockCardActionValue = 'button-text';
          const mockIsRxSkill = 'false';

          const recordEventStub = sandbox.stub(recordEventObject, 'default');

          handleCardAction(
            mockCardTargetClassList,
            mockCardActionValue,
            mockIsRxSkill,
          );

          expect(recordEventStub.notCalled).to.be.true;
        });
      });
      describe('When there are unexpected values', () => {
        it('should not throw an error when cardAction.value is not a string', () => {
          const missingCardActionValue = generateFakeCard({}, 'notOpenUrl');
          const { nextSpy, recordEventStub } = generateSinonFunctions();
          cardActionMiddleware()(nextSpy)(missingCardActionValue);
          expect(recordEventStub.notCalled).to.be.true;
          expect(nextSpy.calledOnce).to.be.true;
          expect(nextSpy.firstCall.args[0]).to.eql(missingCardActionValue);
        });
        it('should not throw an error when cardAction is not present', () => {
          const missingCardActionObj = {};
          const { nextSpy, recordEventStub } = generateSinonFunctions();
          cardActionMiddleware()(nextSpy)(missingCardActionObj);
          expect(recordEventStub.notCalled).to.be.true;
          expect(nextSpy.calledOnce).to.be.true;
          expect(nextSpy.firstCall.args[0]).to.eql(missingCardActionObj);
        });
      });
    });
  });
  describe('ifMissingParamsCallSentry', () => {
    describe('Invalid params', () => {
      describe('call sentry when the csrfToken is invalid', () => {
        it('should call sentry when csrfToken is null', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = null;
          const apiSession = 'apiSession';
          const userFirstName = 'userFirstName';
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          expect(captureExceptionStub.calledOnce).to.be.true;
        });
        it('should call sentry when csrfToken is undefined', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = undefined;
          const apiSession = 'apiSession';
          const userFirstName = 'userFirstName';
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          expect(captureExceptionStub.calledOnce).to.be.true;
        });
        it('should call sentry when csrfToken is an empty string', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = '';
          const apiSession = 'apiSession';
          const userFirstName = 'userFirstName';
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          expect(captureExceptionStub.calledOnce).to.be.true;
        });
      });
      describe('call sentry when the apiSession is invalid', () => {
        it('should call sentry when apiSession is null', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = 'csrfToken';
          const apiSession = null;
          const userFirstName = 'userFirstName';
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          expect(captureExceptionStub.calledOnce).to.be.true;
        });
        it('should call sentry when apiSession is undefined', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = 'csrfToken';
          const apiSession = undefined;
          const userFirstName = 'userFirstName';
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          expect(captureExceptionStub.calledOnce).to.be.true;
        });
        it('should call sentry when apiSession is an empty string', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = 'csrfToken';
          const apiSession = '';
          const userFirstName = 'userFirstName';
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          expect(captureExceptionStub.calledOnce).to.be.true;
        });
      });
      describe('call sentry when the apiSession is invalid', () => {
        it('should call sentry when userFirstName is null', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = 'csrfToken';
          const apiSession = 'apiSession';
          const userFirstName = null;
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          expect(captureExceptionStub.calledOnce).to.be.true;
        });
        it('should call sentry when userFirstName is undefined', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = 'csrfToken';
          const apiSession = 'apiSession';
          const userFirstName = undefined;
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          expect(captureExceptionStub.calledOnce).to.be.true;
        });
      });
      describe('should indicate if a variable is undefined', () => {
        it('should indicate when userUuid is undefined', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = 'csrfToken';
          const apiSession = 'apiSession';
          const userFirstName = 'userFirstName';
          const userUuid = undefined;
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );

          const expectedError = captureExceptionStub.firstCall.args[0];
          expect(expectedError.name).to.equal('TypeError');
          expect(expectedError.message).to.equal(
            'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":"csrfToken present","apiSession":"apiSession present","userFirstName":"userFirstName present","userUuid":"userUuid was undefined"}',
          );
        });
        it('Should indicate when csrfToke is undefined', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = undefined;
          const apiSession = 'apiSession';
          const userFirstName = 'userFirstName';
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          const expectedError = captureExceptionStub.firstCall.args[0];
          expect(expectedError.name).to.equal('TypeError');
          expect(expectedError.message).to.equal(
            'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":"csrfToken was undefined","apiSession":"apiSession present","userFirstName":"userFirstName present","userUuid":"userUuid present"}',
          );
        });
        it('Should indicate when apiSession is undefined', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = 'csrfToken';
          const apiSession = undefined;
          const userFirstName = 'userFirstName';
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          const expectedError = captureExceptionStub.firstCall.args[0];
          expect(expectedError.name).to.equal('TypeError');
          expect(expectedError.message).to.equal(
            'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":"csrfToken present","apiSession":"apiSession was undefined","userFirstName":"userFirstName present","userUuid":"userUuid present"}',
          );
        });
        it('Should indicate when userFirstName is undefined', () => {
          const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
          const csrfToken = 'csrfToken';
          const apiSession = 'apiSession';
          const userFirstName = undefined;
          const userUuid = 'userUuid';
          ifMissingParamsCallSentry(
            csrfToken,
            apiSession,
            userFirstName,
            userUuid,
          );
          const expectedError = captureExceptionStub.firstCall.args[0];
          expect(expectedError.name).to.equal('TypeError');
          expect(expectedError.message).to.equal(
            'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":"csrfToken present","apiSession":"apiSession present","userFirstName":"userFirstName was undefined","userUuid":"userUuid present"}',
          );
        });
      });
    });
    it('should not call sentry when parameters are valid', () => {
      const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
      const csrfToken = 'csrfToken';
      const apiSession = 'apiSession';
      const userFirstName = 'userFirstName';
      const userUuid = 'userUuid';
      ifMissingParamsCallSentry(csrfToken, apiSession, userFirstName, userUuid);
      expect(captureExceptionStub.notCalled).to.be.true;
    });
    describe('variables should be obfuscated', () => {
      it('should not log the value of the apiSession, userFirstName, and userUuid to Sentry', () => {
        const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
        const csrfToken = undefined;
        const apiSession = 'apiSession';
        const userFirstName = 'userFirstName';
        const userUuid = 'userUuid';
        ifMissingParamsCallSentry(
          csrfToken,
          apiSession,
          userFirstName,
          userUuid,
        );
        const expectedError = captureExceptionStub.firstCall.args[0];
        expect(expectedError.name).to.equal('TypeError');
        expect(expectedError.message).to.equal(
          'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":"csrfToken was undefined","apiSession":"apiSession present","userFirstName":"userFirstName present","userUuid":"userUuid present"}',
        );
      });
      it('should not log the value of the csrfToken, userFirstName, and userUuid to Sentry', () => {
        const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
        const csrfToken = 'csrfToken';
        const apiSession = undefined;
        const userFirstName = 'userFirstName';
        const userUuid = 'userUuid';
        ifMissingParamsCallSentry(
          csrfToken,
          apiSession,
          userFirstName,
          userUuid,
        );
        const expectedError = captureExceptionStub.firstCall.args[0];
        expect(expectedError.name).to.equal('TypeError');
        expect(expectedError.message).to.equal(
          'Virtual Agent chatbot bad start - missing required variables: {"csrfToken":"csrfToken present","apiSession":"apiSession was undefined","userFirstName":"userFirstName present","userUuid":"userUuid present"}',
        );
      });
    });
  });
});
