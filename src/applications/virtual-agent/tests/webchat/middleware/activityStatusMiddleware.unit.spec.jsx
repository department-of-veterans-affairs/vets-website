import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { activityStatusMiddleware } from '../../../webchat/middleware/activityStatusMiddleware';
import { AI_DISCLAIMER_TEXT } from '../../../webchat/utils/aiDisclaimerConstants';

describe('activityStatusMiddleware', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when activity is a RAG agent response', () => {
    it('should wrap the original status with disclaimer wrapper', () => {
      const args = {
        activity: {
          type: 'message',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const mockStatus = <div data-testid="original-status">Status</div>;
      const nextStub = sandbox.stub().returns(mockStatus);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container, getByTestId, getByText } = render(result);

      // Check that the wrapper div exists with correct class
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.exist;

      // Check that the disclaimer exists with correct class and text
      const disclaimer = container.querySelector('.va-chatbot-ai-disclaimer');
      expect(disclaimer).to.exist;
      expect(getByText(AI_DISCLAIMER_TEXT)).to.exist;

      // Check that the original status is rendered inside the wrapper
      expect(getByTestId('original-status')).to.exist;
      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.calledWith(args)).to.be.true;
    });

    it('should call next with the args', () => {
      const args = {
        activity: {
          type: 'message',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const mockStatus = <div>Status</div>;
      const nextStub = sandbox.stub().returns(mockStatus);

      const middleware = activityStatusMiddleware();
      middleware(nextStub)(args);

      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.calledWith(args)).to.be.true;
    });
  });

  describe('when activity is not a RAG agent response', () => {
    it('should return the result of next without wrapping when activity type is not message', () => {
      const args = {
        activity: {
          type: 'event',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const mockStatus = <div data-testid="original-status">Status</div>;
      const nextStub = sandbox.stub().returns(mockStatus);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container, getByTestId } = render(result);

      // Check that the wrapper div does not exist
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.not.exist;

      // Check that the original status is rendered directly
      expect(getByTestId('original-status')).to.exist;
      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.calledWith(args)).to.be.true;
    });

    it('should return the result of next without wrapping when channelData category is not rag-agent-response', () => {
      const args = {
        activity: {
          type: 'message',
          channelData: {
            category: 'other-category',
          },
        },
      };

      const mockStatus = <div data-testid="original-status">Status</div>;
      const nextStub = sandbox.stub().returns(mockStatus);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container, getByTestId } = render(result);

      // Check that the wrapper div does not exist
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.not.exist;

      // Check that the original status is rendered directly
      expect(getByTestId('original-status')).to.exist;
      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.calledWith(args)).to.be.true;
    });

    it('should return the result of next without wrapping when channelData is missing', () => {
      const args = {
        activity: {
          type: 'message',
        },
      };

      const mockStatus = <div data-testid="original-status">Status</div>;
      const nextStub = sandbox.stub().returns(mockStatus);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container, getByTestId } = render(result);

      // Check that the wrapper div does not exist
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.not.exist;

      // Check that the original status is rendered directly
      expect(getByTestId('original-status')).to.exist;
      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.calledWith(args)).to.be.true;
    });

    it('should return the result of next without wrapping when activity is missing', () => {
      const args = {};

      const mockStatus = <div data-testid="original-status">Status</div>;
      const nextStub = sandbox.stub().returns(mockStatus);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container, getByTestId } = render(result);

      // Check that the wrapper div does not exist
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.not.exist;

      // Check that the original status is rendered directly
      expect(getByTestId('original-status')).to.exist;
      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.calledWith(args)).to.be.true;
    });

    it('should return the result of next without wrapping when args is null', () => {
      const args = null;

      const mockStatus = <div data-testid="original-status">Status</div>;
      const nextStub = sandbox.stub().returns(mockStatus);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container, getByTestId } = render(result);

      // Check that the wrapper div does not exist
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.not.exist;

      // Check that the original status is rendered directly
      expect(getByTestId('original-status')).to.exist;
      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.calledWith(args)).to.be.true;
    });

    it('should return the result of next without wrapping when args is undefined', () => {
      const args = undefined;

      const mockStatus = <div data-testid="original-status">Status</div>;
      const nextStub = sandbox.stub().returns(mockStatus);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container, getByTestId } = render(result);

      // Check that the wrapper div does not exist
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.not.exist;

      // Check that the original status is rendered directly
      expect(getByTestId('original-status')).to.exist;
      expect(nextStub.calledOnce).to.be.true;
      expect(nextStub.calledWith(args)).to.be.true;
    });
  });

  describe('edge cases', () => {
    it('should handle when next returns null', () => {
      const args = {
        activity: {
          type: 'message',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const nextStub = sandbox.stub().returns(null);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container } = render(result);

      // Check that the wrapper div exists
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.exist;

      // Check that the disclaimer exists
      const disclaimer = container.querySelector('.va-chatbot-ai-disclaimer');
      expect(disclaimer).to.exist;
    });

    it('should handle when next returns a string', () => {
      const args = {
        activity: {
          type: 'message',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const nextStub = sandbox.stub().returns('Status text');

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container, getByText } = render(result);

      // Check that the wrapper div exists
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.exist;

      // Check that the status text is rendered
      expect(getByText('Status text')).to.exist;
    });

    it('should handle when next returns a number', () => {
      const args = {
        activity: {
          type: 'message',
          channelData: {
            category: 'rag-agent-response',
          },
        },
      };

      const nextStub = sandbox.stub().returns(42);

      const middleware = activityStatusMiddleware();
      const result = middleware(nextStub)(args);

      const { container } = render(result);

      // Check that the wrapper div exists
      const wrapper = container.querySelector('.va-chatbot-status-wrapper');
      expect(wrapper).to.exist;
    });
  });
});
