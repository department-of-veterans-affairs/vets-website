import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventObject from 'platform/monitoring/record-event';
import { cardActionMiddleware } from '../../../components/webchat/helpers/webChat';

const sandbox = sinon.createSandbox();

describe('Webchat.jsx', () => {
  /**
   * create a fake action card
   * @param {string} value url for the cardAction
   * @returns {{cardAction: {value: string}}} fake cardAction card
   */
  const generateFakeCard = value => ({ cardAction: { value } });
  /**
   * creates sinon functions for the tests
   * @returns {{nextSpy: SinonSpy, recordEventStub: SinonStub}}
   *          an object containing sinon functions for next and recordEvent
   */

  const generateSinonFunctions = () => ({
    nextSpy: sandbox.spy(),
    recordEventStub: sandbox.stub(recordEventObject, 'default'),
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('when decision letter tracking is enabled', () => {
    const decisionLetterEnabled = true;

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

      cardActionMiddleware(decisionLetterEnabled)()(nextSpy)(
        decisionLetterCard,
      );

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
      cardActionMiddleware(decisionLetterEnabled)()(nextSpy)(
        nonDecisionLetterCard,
      );
      expect(recordEventStub.notCalled).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
      expect(nextSpy.firstCall.args[0]).to.eql(nonDecisionLetterCard);
    });
  });

  describe('when decision letter tracking is disabled', () => {
    it('should not call recordEvent', () => {
      const decisionLetterEnabled = false;
      const nonDecisionLetterCard = generateFakeCard(
        'random_thing_we_dont_use',
      );
      const { nextSpy, recordEventStub } = generateSinonFunctions();
      cardActionMiddleware(decisionLetterEnabled)()(nextSpy)(
        nonDecisionLetterCard,
      );
      expect(recordEventStub.notCalled).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
      expect(nextSpy.firstCall.args[0]).to.eql(nonDecisionLetterCard);
    });
  });
});
