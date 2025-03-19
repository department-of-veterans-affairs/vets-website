import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it } from 'mocha';
import {
  clearBotSessionStorage,
  getConversationIdKey,
  getInAuthExp,
  getIsRxSkill,
  getIsTrackingUtterances,
  getLoggedInFlow,
  getRecentUtterances,
  getTokenKey,
  setConversationIdKey,
  setInAuthExp,
  setIsRxSkill,
  setIsTrackingUtterances,
  setLoggedInFlow,
  setRecentUtterances,
  setTokenKey,
  storeUtterances,
} from '../../utils/sessionStorage';

describe('sessionStorage', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    sessionStorage.clear();
  });

  describe('loggedInFlow', () => {
    it('should get logged in flow', () => {
      sessionStorage.setItem('va-bot.loggedInFlow', 'true');
      const result = getLoggedInFlow();
      expect(result).to.equal('true');
    });
    it('should set logged in flow', () => {
      setLoggedInFlow('true');
      const result = sessionStorage.getItem('va-bot.loggedInFlow');
      expect(result).to.equal('true');
    });
  });
  describe('inAuthExp', () => {
    it('should get in auth exp', () => {
      sessionStorage.setItem('va-bot.inAuthExperience', 'true');
      const result = getInAuthExp();
      expect(result).to.equal('true');
    });
    it('should set in auth exp', () => {
      setInAuthExp('true');
      const result = sessionStorage.getItem('va-bot.inAuthExperience');
      expect(result).to.equal('true');
    });
  });
  describe('recentUtterances', () => {
    it('should get recent utterances', () => {
      sessionStorage.setItem(
        'va-bot.recentUtterances',
        JSON.stringify(['utterance1', 'utterance2']),
      );
      const result = getRecentUtterances();
      expect(result).to.deep.equal(['utterance1', 'utterance2']);
    });
    it('should set recent utterances', () => {
      setRecentUtterances(['utterance1', 'utterance2']);
      const result = sessionStorage.getItem('va-bot.recentUtterances');
      expect(result).to.equal(JSON.stringify(['utterance1', 'utterance2']));
    });
  });
  describe('isRxSkill', () => {
    it('should get rx skill', () => {
      sessionStorage.setItem('va-bot.isRxSkill', true);
      const result = getIsRxSkill();
      expect(result).to.equal('true');
    });
    it('should set rx skill', () => {
      setIsRxSkill(true);
      const result = sessionStorage.getItem('va-bot.isRxSkill');
      expect(result).to.equal('true');
    });
  });
  describe('conversationIdKey', () => {
    it('should get conversation id key', () => {
      sessionStorage.setItem('va-bot.conversationId', 'abc');
      const result = getConversationIdKey();
      expect(result).to.equal('abc');
    });
    it('should set conversation id key', () => {
      setConversationIdKey('abc');
      const result = sessionStorage.getItem('va-bot.conversationId');
      expect(result).to.equal('abc');
    });
  });
  describe('isTrackingUtterances', () => {
    it('should get is tracking utterances', () => {
      sessionStorage.setItem('va-bot.isTrackingUtterances', true);
      const result = getIsTrackingUtterances();
      expect(result).to.equal('true');
    });
    it('should set is tracking utterances', () => {
      setIsTrackingUtterances(true);
      const result = sessionStorage.getItem('va-bot.isTrackingUtterances');
      expect(result).to.equal('true');
    });
  });
  describe('tokenKey', () => {
    it('should get token key', () => {
      sessionStorage.setItem('va-bot.token', 'def');
      const result = getTokenKey();
      expect(result).to.equal('def');
    });
    it('should set token key', () => {
      setTokenKey('def');
      const result = sessionStorage.getItem('va-bot.token');
      expect(result).to.equal('def');
    });
  });
  describe('clearBotSessionStorage', () => {
    it('should clear bot session storage items with prefixed keys when forceClear is true', () => {
      // Set up the sessionStorage mock with the desired values
      setLoggedInFlow('true');
      setInAuthExp('true');
      sessionStorage.setItem('itemToNotClear', 'apple');

      clearBotSessionStorage(true);

      const loggedInFlow = getLoggedInFlow();
      const inAuthExp = getInAuthExp();
      const itemToClear = sessionStorage.getItem('itemToNotClear');

      expect(loggedInFlow).to.be.null;
      expect(inAuthExp).to.be.null;
      expect(itemToClear).to.equal('apple');
    });
    it('should exclude specific keys from clearing when loggedInFlow is true and inAuthExp is false', () => {
      // Set up the sessionStorage mock with the desired values
      setLoggedInFlow('true');
      setInAuthExp('false');
      setRecentUtterances(['apple']);
      setConversationIdKey('orange');
      setTokenKey('grape');
      sessionStorage.setItem('va-bot.itemToClear', 'banana');

      clearBotSessionStorage(false);

      const itemToClear = sessionStorage.getItem('va-bot.itemToClear');
      const loggedInFlow = getLoggedInFlow();
      const recentUtterances = getRecentUtterances();
      const conversationIdKey = getConversationIdKey();
      const tokenKey = getTokenKey();

      expect(itemToClear).to.be.null;
      expect(loggedInFlow).to.equal('true');
      expect(recentUtterances).to.deep.equal(['apple']);
      expect(conversationIdKey).to.equal('orange');
      expect(tokenKey).to.equal('grape');
    });
    it('should do nothing when in auth experience but logged out', () => {
      setInAuthExp('true');
      setLoggedInFlow('false');
      sessionStorage.setItem('va-bot.itemToNotClear', 'strawberry');

      clearBotSessionStorage(false);
      const itemToNotClear = sessionStorage.getItem('va-bot.itemToNotClear');

      expect(itemToNotClear).to.be.equal('strawberry');
    });
  });

  describe('storeUtterances', () => {
    it('should store the last two user utterances', () => {
      const event1 = {
        data: {
          type: 'message',
          text: 'Hello',
          from: {
            role: 'user',
          },
        },
      };

      const event2 = {
        data: {
          type: 'message',
          text: 'Hello',
          from: {
            role: 'user',
          },
        },
      };

      storeUtterances(event1);
      storeUtterances(event2);

      const storedUtterances = getRecentUtterances();
      expect(storedUtterances).to.deep.equal(['Hello', 'Hello']);
    });

    it('should not store utterances if the event role is not a user', () => {
      const event = {
        data: {
          type: 'message',
          text: 'Hello',
          from: {
            role: 'bot',
          },
        },
      };

      storeUtterances(event);

      const storedUtterances = getRecentUtterances();
      expect(storedUtterances).to.be.null;
    });

    it('should not store utterances if the event text is empty', () => {
      const event = {
        data: {
          type: 'message',
          text: '',
          from: {
            role: 'user',
          },
        },
      };

      storeUtterances(event);

      const storedUtterances = getRecentUtterances();
      expect(storedUtterances).to.be.null;
    });

    it('should not store utterances if the event text is missing', () => {
      const event = {
        data: {
          type: 'message',
          from: {
            role: 'user',
          },
        },
      };

      storeUtterances(event);

      const storedUtterances = JSON.parse(
        sessionStorage.getItem('RECENT_UTTERANCES'),
      );
      expect(storedUtterances).to.be.null;
    });
  });
});
