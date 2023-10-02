import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventObject from 'platform/monitoring/record-event';
import { cardActionMiddleware } from '../../../components/webchat/WebChat';

const sandbox = sinon.createSandbox();

describe('Webchat.jsx', () => {
  describe('decision letter tracking', () => {
    afterEach(() => {
      sandbox.restore();
    });

    /**
     * creates sinon functions for the tests
     * @returns {{nextSpy: SinonSpy, recordEventStub: SinonStub}}
     *          an object contianing sinon functions for next and recordEvent
     */
    const generateSinonFunctions = () => ({
      nextSpy: sandbox.spy(),
      recordEventStub: sandbox.stub(recordEventObject, 'default'),
    });

    /**
     * create a fake action card
     * @param {string} value url for the cardAction
     * @returns {{cardAction: {value: string}}} fake cardAction card
     */
    const generateFakeCard = value => ({ cardAction: { value } });

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
      expect(nextSpy.firstCall.args[0]).to.eql(decisionLetterCard.cardAction);
      dateStub.restore();
    });

    it('should only call next when card is not a decision letter', () => {
      const nonDecisionLetterCard = generateFakeCard(
        'random_thing_we_dont_use',
      );
      const { nextSpy, recordEventStub } = generateSinonFunctions();
      cardActionMiddleware()(nextSpy)(nonDecisionLetterCard);
      expect(recordEventStub.notCalled).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
  });
});
