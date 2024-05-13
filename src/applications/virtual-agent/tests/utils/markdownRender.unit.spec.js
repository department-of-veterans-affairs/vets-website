import { expect } from 'chai';
import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
import sinon from 'sinon';
import MarkdownRenderer, {
  recordChatbotEvents,
  getRenderToken,
  getDefaultRenderer,
} from '../../utils/markdownRenderer';

describe('markdownRenderer', () => {
  let sandbox;
  let clock;
  const now = new Date();

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers({
      now,
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('recordChatbotEvents', () => {
    it('should call recordEvent when a chatbot link is clicked', () => {
      const recordEventSpy = sandbox.spy(RecordEventModule, 'default');

      const element = document.createElement('a');
      element.setAttribute('href', 'http://example.com/');
      element.setAttribute('id', 'chatbotLink');
      element.appendChild(document.createTextNode('Chatbot Link'));
      document.body.appendChild(element);

      recordChatbotEvents({ target: element });

      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.getCall(0).args[0]).to.deep.equal({
        event: 'chatbot-resource-link-click',
        link: 'http://example.com/',
        linkText: 'Chatbot Link',
        time: now,
      });
    });
    it('should call recordEvent when a non-chatbot link is clicked', () => {
      const recordEventSpy = sandbox.spy(RecordEventModule, 'default');

      const element = document.createElement('a');
      element.setAttribute('href', 'http://example.com/');
      element.setAttribute('id', 'other');
      element.appendChild(document.createTextNode('Other'));
      document.body.appendChild(element);

      recordChatbotEvents({ target: element });

      expect(recordEventSpy.notCalled).to.be.true;
    });
    it('should call recordEvent when the Speak with an agent span is clicked', () => {
      const recordEventSpy = sandbox.stub(RecordEventModule, 'default');

      const element = document.createElement('span');
      element.innerText = 'Speak with an agent';
      document.body.appendChild(element);

      recordChatbotEvents({ target: element });

      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.getCall(0).args[0]).to.deep.equal({
        event: 'cta-button-click',
        'button-type': 'default',
        'button-click-label': 'Speak with an agent',
        'button-background-color': 'blue',
        time: now,
      });
    });
    it('should not call recordEvent when a non Speak with an agent span is clicked', () => {
      const recordEventSpy = sandbox.stub(RecordEventModule, 'default');

      const element = document.createElement('span');
      element.innerText = 'Other';
      document.body.appendChild(element);

      recordChatbotEvents({ target: element });

      expect(recordEventSpy.notCalled).to.be.true;
    });
    it('should call recordEvent when the Speak with an agent button is clicked', () => {
      const recordEventSpy = sandbox.stub(RecordEventModule, 'default');

      const element = document.createElement('button');
      element.innerText = 'Speak with an agent';
      document.body.appendChild(element);

      recordChatbotEvents({ target: element });

      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.getCall(0).args[0]).to.deep.equal({
        event: 'cta-button-click',
        'button-type': 'default',
        'button-click-label': 'Speak with an agent',
        'button-background-color': 'blue',
        time: now,
      });
    });
    it('should not call recordEvent when a non Speak with an agent button is clicked', () => {
      const recordEventSpy = sandbox.stub(RecordEventModule, 'default');

      const element = document.createElement('button');
      element.innerText = 'Other';
      document.body.appendChild(element);

      recordChatbotEvents({ target: element });

      expect(recordEventSpy.notCalled).to.be.true;
    });
    it('should not call recordEvent when a different element is clicked', () => {
      const recordEventSpy = sandbox.stub(RecordEventModule, 'default');

      const element = document.createElement('div');
      document.body.appendChild(element);

      recordChatbotEvents({ target: element });

      expect(recordEventSpy.notCalled).to.be.true;
    });
  });
  describe('getRenderToken', () => {
    it('should call the renderToken function', () => {
      const renderTokenStub = sandbox.stub();
      const self = {
        renderToken: renderTokenStub,
      };

      const tokens = 'fake-tokens';
      const idx = 'fake-idx';
      const options = 'fake-options';

      getRenderToken(tokens, idx, options, null, self);

      expect(renderTokenStub.calledOnce).to.be.true;
      expect(renderTokenStub.calledWith(tokens, idx, options)).to.be.true;
    });
  });
  describe('getDefaultRenderer', () => {
    it('should call the default render function if the renderToken function does not exist', () => {
      const markdownRenderer = {
        renderer: {
          rules: {
            // eslint-disable-next-line camelcase
            link_open: 'test',
          },
        },
      };
      const result = getDefaultRenderer(markdownRenderer);

      expect(result).to.be.equal(markdownRenderer.renderer.rules.link_open);
    });
    it('should call the default render function if the renderToken function does not exist', () => {
      const markdownRenderer = {
        renderer: {
          rules: {},
        },
      };
      const result = getDefaultRenderer(markdownRenderer);

      expect(result).to.be.equal(getRenderToken);
    });
  });
  describe('rendering telephone numbers', () => {
    it('should not add aria-label to non-tel links', () => {
      expect(
        MarkdownRenderer.render('[hi](http://example.com)'),
      ).to.not.include('aria-label');
    });

    it('should not add aria-label to links with no scheme', () => {
      expect(MarkdownRenderer.render('[hi](example.com)')).to.not.include(
        'aria-label',
      );
    });

    it('should handle links inside text blocks', () => {
      expect(
        MarkdownRenderer.render('howdy there have you seen [this](tel:922)'),
      ).to.include('aria-label="9 2 2."');
    });

    it('should handle multiple links', () => {
      expect(
        MarkdownRenderer.render('have [you](tel:011) seen [this](tel:922)'),
      )
        .to.include('aria-label="9 2 2."')
        .and.include('aria-label="0 1 1."');
    });

    [
      {
        phoneNumberLink: '911',
        expectedLabel: '9 1 1.',
      },
      {
        phoneNumberLink: '1112223333',
        expectedLabel: '1 1 1. 2 2 2. 3 3 3 3.',
      },
      {
        phoneNumberLink: '11112223333',
        expectedLabel: '1. 1 1 1. 2 2 2. 3 3 3 3.',
      },
      {
        phoneNumberLink: '2223333',
        expectedLabel: '2 2 2. 3 3 3 3.',
      },
      {
        phoneNumberLink: '1-800-234-1234',
        expectedLabel: '1. 8 0 0. 2 3 4. 1 2 3 4.',
      },
      {
        phoneNumberLink: '+12223334444',
        expectedLabel: '1. 2 2 2. 3 3 3. 4 4 4 4.',
      },
      {
        phoneNumberLink: '+1(222)333-4444',
        expectedLabel: '1. 2 2 2. 3 3 3. 4 4 4 4.',
      },
    ].forEach(({ phoneNumberLink, expectedLabel }) => {
      it(`should add aria label for ${phoneNumberLink}`, () => {
        expect(
          MarkdownRenderer.render(`[hi](tel:${phoneNumberLink})`),
        ).to.include(`aria-label="${expectedLabel}"`);
      });
    });
  });
});
