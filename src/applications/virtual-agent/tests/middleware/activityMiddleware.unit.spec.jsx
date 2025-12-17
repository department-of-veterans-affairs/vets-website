import sinon from 'sinon';
import { expect } from 'chai';
import { activityMiddleware } from '../../middleware/activityMiddleware';
import { AI_DISCLAIMER_TEXT } from '../../utils/aiDisclaimerConstants';

describe('activityMiddleware', () => {
  it('should not call next if activity type is trace', () => {
    const next = sinon.stub();
    const card = { activity: { type: 'trace' } };
    const result = activityMiddleware()(next)(card);
    expect(result).to.be.false;
    expect(next.called).to.be.false;
  });
  it('should call next with card if card activity type is not trace', () => {
    const next = sinon.stub();
    const card = { activity: { type: 'not_trace' } };
    activityMiddleware()(next)(card);
    expect(next.calledWith(card)).to.be.true;
  });

  describe('RAG agent responses', () => {
    const disclaimerText = ` ${AI_DISCLAIMER_TEXT}`;

    it('should add fallback-text with disclaimer when RAG agent response has no existing fallback-text', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: 'This is a response',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(result.activity.channelData['webchat:fallback-text']).to.equal(
        `This is a response${disclaimerText}`,
      );
      expect(next.called).to.be.true;
    });

    it('should append disclaimer to existing fallback-text for RAG agent responses', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: 'This is a response',
          channelData: {
            category: 'rag-agent-response',
            'webchat:fallback-text': 'Existing fallback text',
          },
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(result.activity.channelData['webchat:fallback-text']).to.equal(
        `Existing fallback text${disclaimerText}`,
      );
      expect(next.called).to.be.true;
    });

    it('should strip markdown from activity.text before appending disclaimer', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: 'This is **bold** text with [a link](https://example.com)',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(
        result.activity.channelData['webchat:fallback-text'],
      ).to.not.include('**');
      expect(
        result.activity.channelData['webchat:fallback-text'],
      ).to.not.include('[a link](https://example.com)');
      expect(result.activity.channelData['webchat:fallback-text']).to.include(
        'a link',
      );
      expect(result.activity.channelData['webchat:fallback-text']).to.include(
        disclaimerText,
      );
      expect(next.called).to.be.true;
    });

    it('should strip markdown from existing fallback-text before appending disclaimer', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: 'This is a response',
          channelData: {
            category: 'rag-agent-response',
            'webchat:fallback-text': 'Text with **bold** and [link](url)',
          },
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(
        result.activity.channelData['webchat:fallback-text'],
      ).to.not.include('**');
      expect(
        result.activity.channelData['webchat:fallback-text'],
      ).to.not.include('[link](url)');
      expect(result.activity.channelData['webchat:fallback-text']).to.include(
        'link',
      );
      expect(result.activity.channelData['webchat:fallback-text']).to.include(
        disclaimerText,
      );
      expect(next.called).to.be.true;
    });

    it('should not strip markdown if text does not contain markdown syntax', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: 'Plain text without any markdown',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(result.activity.channelData['webchat:fallback-text']).to.equal(
        `Plain text without any markdown${disclaimerText}`,
      );
      expect(next.called).to.be.true;
    });

    it('should create channelData if it does not exist', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: 'This is a response',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(result.activity.channelData).to.exist;
      expect(result.activity.channelData['webchat:fallback-text']).to.exist;
      expect(next.called).to.be.true;
    });

    it('should handle empty activity.text gracefully', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: '',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(result.activity.channelData['webchat:fallback-text']).to.equal(
        AI_DISCLAIMER_TEXT,
      );
      expect(next.called).to.be.true;
    });
  });

  describe('non-RAG responses', () => {
    it('should not modify channelData for non-RAG agent responses', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: 'This is a regular response',
          channelData: {
            category: 'other-category',
          },
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(result.activity.channelData['webchat:fallback-text']).to.be
        .undefined;
      expect(next.called).to.be.true;
    });

    it('should not modify channelData for messages without category', () => {
      const next = sinon.stub().returnsArg(0);
      const card = {
        activity: {
          type: 'message',
          text: 'This is a regular response',
        },
      };

      const result = activityMiddleware()(next)(card);

      expect(result.activity.channelData).to.be.undefined;
      expect(next.called).to.be.true;
    });
  });
});
