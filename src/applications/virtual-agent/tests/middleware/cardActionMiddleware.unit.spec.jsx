import sinon from 'sinon';
import { expect } from 'chai';

import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
import * as SessionStorageModule from '../../utils/sessionStorage';
import { cardActionMiddleware } from '../../middleware/cardActionMiddleware';

/**
 * create a fake action card
 * @param {string} value url for the cardAction
 * @returns {{cardAction: {value: string}}} fake cardAction card
 */
function generateFakeCard(value, type = 'openUrl') {
  return {
    cardAction: { value, type },
  };
}

describe('cardAction', () => {
  let sandbox;
  let clock;
  const now = new Date();

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      now,
      toFake: ['Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('cardActionMiddleware', () => {
    describe('cardActionMiddleware', () => {
      it('should call recordEvent and next when card is a decision letter', () => {
        const card = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
        );
        const nextSpy = sinon.spy();
        const recordEventStub = sandbox.stub(RecordEventModule, 'default');

        const recordEventData = {
          event: 'file_download',
          'button-click-label': 'Decision Letter',
          time: now,
        };

        cardActionMiddleware()(nextSpy)(card);

        expect(recordEventStub.calledOnce).to.be.true;
        expect(recordEventStub.firstCall.args[0]).to.deep.equal(
          recordEventData,
        );
        expect(nextSpy.calledOnce).to.be.true;
        expect(nextSpy.calledWithExactly(card)).to.be.true;
      });

      it('should not call recordEvent when card is not a decision letter', () => {
        const card = generateFakeCard('random_thing_we_dont_use');
        const nextSpy = sinon.spy();
        const recordEventStub = sandbox.stub(RecordEventModule, 'default');

        cardActionMiddleware()(nextSpy)(card);

        expect(recordEventStub.notCalled).to.be.true;
        expect(nextSpy.calledOnce).to.be.true;
        expect(nextSpy.calledWithExactly(card)).to.be.true;
      });
      it('should not call recordEvent when cardAction.type is not openUrl', () => {
        const card = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
          'notOpenUrl',
        );
        const nextSpy = sinon.spy();
        const recordEventStub = sandbox.stub(RecordEventModule, 'default');

        cardActionMiddleware()(nextSpy)(card);

        expect(recordEventStub.notCalled).to.be.true;
        expect(nextSpy.calledOnce).to.be.true;
        expect(nextSpy.calledWithExactly(card)).to.be.true;
      });
      it('should call recordEvent with prescriptions when classList has webchat__suggested-action in card and skill is prescriptions', () => {
        const card = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
          'notOpenUrl',
        );
        card.target = {
          classList: ['webchat__suggested-action'],
        };

        sandbox
          .stub(SessionStorageModule, 'getEventSkillValue')
          .returns('va_vha_healthassistant_bot');
        const recordEventStub = sandbox.stub(RecordEventModule, 'default');

        cardActionMiddleware()(sandbox.stub())(card);

        expect(recordEventStub.calledOnce).to.be.true;
        expect(recordEventStub.firstCall.args[0]).to.deep.equal({
          event: 'chatbot-button-click',
          clickText: card.cardAction.value,
          topic: 'va_vha_healthassistant_bot',
        });
      });
      it('should call recordEvent when classList has webchat__suggested-action in card', () => {
        const card = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
          'notOpenUrl',
        );
        card.target = {
          classList: ['webchat__suggested-action'],
        };

        const recordEventStub = sandbox.stub(RecordEventModule, 'default');

        cardActionMiddleware()(sandbox.stub())(card);

        expect(recordEventStub.calledOnce).to.be.true;
      });
      it('should call recordEvent when classList has webchat__suggested-action__text in card', () => {
        const card = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
          'notOpenUrl',
        );
        card.target = {
          classList: ['webchat__suggested-action__text'],
        };

        const recordEventStub = sandbox.stub(RecordEventModule, 'default');

        cardActionMiddleware()(sandbox.stub())(card);

        expect(recordEventStub.calledOnce).to.be.true;
        expect(recordEventStub.firstCall.args[0]).to.deep.equal({
          event: 'chatbot-button-click',
          clickText: card.cardAction.value,
          topic: undefined,
        });
      });
      it('should not call recordEvent when classList is unknown class in card', () => {
        const card = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
          'notOpenUrl',
        );
        card.target = {
          classList: ['other'],
        };

        const recordEventStub = sandbox.stub(RecordEventModule, 'default');

        cardActionMiddleware()(sandbox.stub())(card);

        expect(recordEventStub.notCalled).to.be.true;
      });
      it('should call recordEvent with disability ratings when classList has webchat__suggested-action in card and skill is disability ratings', () => {
        const card = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
          'notOpenUrl',
        );
        card.target = { classList: ['webchat__suggested-action'] };

        sandbox
          .stub(SessionStorageModule, 'getEventSkillValue')
          .returns('ratings');
        const recordEventStub = sandbox.stub(RecordEventModule, 'default');

        cardActionMiddleware()(sandbox.stub())(card);

        expect(recordEventStub.calledOnce).to.be.true;
        expect(recordEventStub.firstCall.args[0]).to.deep.equal({
          event: 'chatbot-button-click',
          clickText: card.cardAction.value,
          topic: 'ratings',
        });
      });
      describe('When there are unexpected values', () => {
        it('should not throw an error when cardAction.value is not a string', () => {
          const card = generateFakeCard({}, 'notOpenUrl');
          const nextSpy = sinon.spy();
          const recordEventStub = sandbox.stub(RecordEventModule, 'default');

          cardActionMiddleware()(nextSpy)(card);

          expect(recordEventStub.notCalled).to.be.true;
          expect(nextSpy.calledOnce).to.be.true;
          expect(nextSpy.calledWithExactly(card)).to.be.true;
        });
        it('should not throw an error when cardAction is not present', () => {
          const card = {};
          const nextSpy = sinon.spy();
          const recordEventStub = sandbox.stub(RecordEventModule, 'default');

          cardActionMiddleware()(nextSpy)(card);

          expect(recordEventStub.notCalled).to.be.true;
          expect(nextSpy.calledOnce).to.be.true;
          expect(nextSpy.calledWithExactly(card)).to.be.true;
        });
      });
    });
  });
});
