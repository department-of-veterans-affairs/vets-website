import { expect } from 'chai';
import { loadWebChat } from '../../../components/chatbox/useWebChatFramework';

describe('Chatbox', () => {
  describe('loadWebChat', () => {
    let oldDocument;
    beforeEach(() => {
      oldDocument = global.document;
    });
    afterEach(() => {
      global.document = oldDocument;
    });
    it('load version 14.15.2 when toggle is off', () => {
      loadWebChat(false);
      const actual = document.querySelector('script').src;
      const expected =
        'https://cdn.botframework.com/botframework-webchat/4.15.2/webchat.js';
      expect(actual).to.equal(expected);
    });
    it('load version 14.15.8 when toggle is on', () => {
      loadWebChat(true);
      const actual = document.querySelector('script').src;
      const expected =
        'https://cdn.botframework.com/botframework-webchat/4.15.8/webchat.js';
      expect(actual).to.equal(expected);
    });
  });
});
