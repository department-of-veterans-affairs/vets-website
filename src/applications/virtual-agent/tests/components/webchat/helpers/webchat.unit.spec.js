import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventObject from 'platform/monitoring/record-event';
import { describe } from 'mocha';
import {
  cardActionMiddleware,
  activityMiddleware,
} from '../../../../components/webchat/helpers/webChat';

const sandbox = sinon.createSandbox();

describe('Webchat.jsx Helpers', () => {
  afterEach(() => {
    sandbox.restore();
  });
  describe('activityMiddleware', () => {
    /**
     * Pseudo code for the activityMiddleware
     * 1. Create a curried version of a activityMiddleware that takes in a
     *    set.
     * 2. only do main body of function if and only if the feature flag is
     *    enabled
     * 3. update the set to contain the urls for the decision letters if and
     *    only if the card is an decision letter card containing openUrl actions
     *
     * Test cases:
     * 1. when the feature flag is enabled and the card is a decision letter
     *   - we should add url to set when there is only one decision letter
     *   - we should add urls to set when there are multiple decision letters
     */

    describe('When decision letter feature flag is enabled', () => {
      const generateFakeCard = (text, ...urls) => {
        const newCard = {
          activity: {
            type: 'message',
            attachments: [
              {
                content: {
                  body: [
                    {
                      text,
                    },
                  ],
                },
              },
            ],
          },
        };
        return urls.reduce((card, url) => {
          card.activity.attachments[0].content.body.push({
            columns: [
              {
                items: [
                  {
                    actions: [
                      {
                        type: 'Action.OpenUrl',
                        url,
                      },
                    ],
                  },
                ],
              },
            ],
          });
          return card;
        }, newCard);
        // return newCard
      };
      const featureFlagEnabled = true;
      it('should call next and not add anything to the set when the card is not a decision letter', () => {
        const nextStub = sandbox.stub();
        const card = generateFakeCard('not a decision letter');
        const setOfDecisionLetterUrls = new Set();
        const childrenObject = {};
        const childrenSpy = sandbox.spy();

        nextStub.returns(childrenSpy);

        activityMiddleware(featureFlagEnabled, setOfDecisionLetterUrls)()(
          nextStub,
        )(card)(childrenObject);

        expect(nextStub.calledOnce).to.be.true;
        expect(nextStub.firstCall.args[0]).to.equal(card);

        expect(childrenSpy.calledOnce).to.be.true;
        expect(childrenSpy.firstCall.args[0]).to.equal(childrenObject);

        expect(setOfDecisionLetterUrls.size).to.equal(0);
      });
      it('should add url to set when there is only one decision letter', () => {
        const nextStub = sandbox.stub();
        const card = generateFakeCard('Claims Decision Letters', 'url1');
        const setOfDecisionLetterUrls = new Set();
        const childrenObject = {};
        const childrenSpy = sandbox.spy();

        nextStub.returns(childrenSpy);

        activityMiddleware(featureFlagEnabled, setOfDecisionLetterUrls)()(
          nextStub,
        )(card)(childrenObject);

        expect(nextStub.calledOnce).to.be.true;
        expect(nextStub.firstCall.args[0]).to.equal(card);

        expect(childrenSpy.calledOnce).to.be.true;
        expect(childrenSpy.firstCall.args[0]).to.equal(childrenObject);

        expect(setOfDecisionLetterUrls.size).to.equal(1);
        expect(setOfDecisionLetterUrls.has('url1')).to.be.true;
      });
      it('should add urls to set when there are multiple decision letters', () => {
        const nextStub = sandbox.stub();
        const card = generateFakeCard(
          'Claims Decision Letters',
          'url1',
          'url2',
          'url3',
        );
        const setOfDecisionLetterUrls = new Set();
        const childrenObject = {};
        const childrenSpy = sandbox.spy();

        nextStub.returns(childrenSpy);

        activityMiddleware(featureFlagEnabled, setOfDecisionLetterUrls)()(
          nextStub,
        )(card)(childrenObject);

        expect(nextStub.calledOnce).to.be.true;
        expect(nextStub.firstCall.args[0]).to.equal(card);

        expect(childrenSpy.calledOnce).to.be.true;
        expect(childrenSpy.firstCall.args[0]).to.equal(childrenObject);

        expect(setOfDecisionLetterUrls.size).to.equal(3);
        expect(setOfDecisionLetterUrls.has('url1')).to.be.true;
        expect(setOfDecisionLetterUrls.has('url2')).to.be.true;
        expect(setOfDecisionLetterUrls.has('url3')).to.be.true;
      });
    });
    it('should call only next when the feature flag is disabled', () => {
      //  3. when the feature flag is disabled
      const nextStub = sandbox.stub();
      const card = {};
      const setOfDecisionLetterUrls = new Set();
      const childrenObject = {};
      const childrenSpy = sandbox.spy();

      nextStub.returns(childrenSpy);

      activityMiddleware(false, setOfDecisionLetterUrls)()(nextStub)(card)(
        childrenObject,
      );

      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.firstCall.args[0]).to.equal(card);

      expect(childrenSpy.calledOnce).to.be.true;
      expect(childrenSpy.firstCall.args[0]).to.equal(childrenObject);

      expect(setOfDecisionLetterUrls.size).to.equal(0);
    });
  });
  describe('cardActionMiddleware', () => {
    /**
     * Pseudo code for the middleware
     * 1. update the cardActionMiddleware to take in a Set containing decision
     *    letter urls
     * 2. update the middleware to check if the url to check if the url is in
     *    the set
     * 3. if the url is in the set, call recordEvent otherwise skip
     */

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
      it('should not call recordEvent when cardAction.type is not openUrl', () => {
        const notOpenUrl = generateFakeCard(
          'https://www.va.gov/v0/claim_letters/abc',
          'notOpenUrl',
        );
        const { nextSpy, recordEventStub } = generateSinonFunctions();
        cardActionMiddleware(decisionLetterEnabled)()(nextSpy)(notOpenUrl);
        expect(recordEventStub.notCalled).to.be.true;
        expect(nextSpy.calledOnce).to.be.true;
        expect(nextSpy.firstCall.args[0]).to.eql(notOpenUrl);
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
});
