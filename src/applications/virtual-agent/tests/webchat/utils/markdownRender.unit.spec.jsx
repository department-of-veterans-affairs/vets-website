import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { expect } from 'chai';
import sinon from 'sinon';
import MarkdownRenderer, {
  getDefaultRenderer,
  getRenderToken,
  recordChatbotEvents,
  stripMarkdown,
} from '../../../webchat/utils/markdownRenderer';
import { setEventSkillValue } from '../../../webchat/utils/sessionStorage';

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
      setEventSkillValue('prescriptions');
      recordChatbotEvents({ target: element });

      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.getCall(0).args[0]).to.deep.equal({
        event: 'chatbot-resource-link-click',
        link: 'http://example.com/',
        linkText: 'Chatbot Link',
        time: now,
        topic: 'prescriptions',
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

  describe('stripMarkdown', () => {
    it('should return empty string for null input', () => {
      expect(stripMarkdown(null)).to.equal('');
    });

    it('should return empty string for undefined input', () => {
      expect(stripMarkdown(undefined)).to.equal('');
    });

    it('should return empty string for empty string input', () => {
      expect(stripMarkdown('')).to.equal('');
    });

    it('should return plain text unchanged', () => {
      const plainText = 'This is plain text without any markdown';
      expect(stripMarkdown(plainText)).to.equal(plainText);
    });

    it('should remove bold markdown (**text**)', () => {
      expect(stripMarkdown('This is **bold** text')).to.equal(
        'This is bold text',
      );
    });

    it('should remove italic markdown (*text*)', () => {
      expect(stripMarkdown('This is *italic* text')).to.equal(
        'This is italic text',
      );
    });

    it('should extract link text from markdown links', () => {
      expect(
        stripMarkdown('Check out [this link](https://example.com) for more'),
      ).to.equal('Check out this link for more');
    });

    it('should remove headers (# ## ###)', () => {
      expect(stripMarkdown('# Header 1\n\nContent here')).to.include(
        'Header 1',
      );
      expect(stripMarkdown('# Header 1\n\nContent here')).to.include(
        'Content here',
      );
      expect(stripMarkdown('# Header 1\n\nContent here')).to.not.include('#');
    });

    it('should remove bullet points', () => {
      expect(stripMarkdown('- Item 1\n- Item 2\n- Item 3')).to.include(
        'Item 1',
      );
      expect(stripMarkdown('- Item 1\n- Item 2\n- Item 3')).to.include(
        'Item 2',
      );
      expect(stripMarkdown('- Item 1\n- Item 2\n- Item 3')).to.not.include('-');
    });

    it('should remove numbered list markers', () => {
      expect(stripMarkdown('1. First item\n2. Second item')).to.include(
        'First item',
      );
      expect(stripMarkdown('1. First item\n2. Second item')).to.include(
        'Second item',
      );
      expect(stripMarkdown('1. First item\n2. Second item')).to.not.include(
        '1.',
      );
    });

    it('should handle complex markdown with multiple elements', () => {
      const markdown =
        '**Related Information**\n\n- [Link 1](https://example.com/1)\n- [Link 2](https://example.com/2)';
      const result = stripMarkdown(markdown);

      expect(result).to.include('Related Information');
      expect(result).to.include('Link 1');
      expect(result).to.include('Link 2');
      expect(result).to.not.include('**');
      expect(result).to.not.include('[Link 1](https://example.com/1)');
      expect(result).to.not.include('-');
    });

    it('should clean up extra whitespace', () => {
      const markdown = 'Text   with    multiple    spaces';
      const result = stripMarkdown(markdown);
      expect(result).to.equal('Text with multiple spaces');
    });

    it('should handle markdown with inline code', () => {
      expect(stripMarkdown('Use `code` in text')).to.include('code');
      expect(stripMarkdown('Use `code` in text')).to.not.include('`');
    });

    it('should handle multiple links in text', () => {
      const markdown = 'Visit [site1](url1) and [site2](url2) for more info';
      const result = stripMarkdown(markdown);

      expect(result).to.include('site1');
      expect(result).to.include('site2');
      expect(result).to.not.include('[site1](url1)');
      expect(result).to.not.include('[site2](url2)');
    });

    it('should handle markdown with mixed formatting', () => {
      const markdown =
        '**Bold text** with *italic* and [a link](url) and `code`';
      const result = stripMarkdown(markdown);

      expect(result).to.include('Bold text');
      expect(result).to.include('italic');
      expect(result).to.include('a link');
      expect(result).to.include('code');
      expect(result).to.not.include('**');
      expect(result).to.not.include('*');
      expect(result).to.not.include('[a link](url)');
      expect(result).to.not.include('`');
    });

    it('should preserve text content while removing formatting', () => {
      const markdown =
        '**Important**: Please read [this guide](url) carefully.';
      const result = stripMarkdown(markdown);

      expect(result).to.include('Important');
      expect(result).to.include('Please read');
      expect(result).to.include('this guide');
      expect(result).to.include('carefully');
    });
  });
});
