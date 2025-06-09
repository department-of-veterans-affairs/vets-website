import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import * as RetryOnce from '../../utils/retryOnce';
import useChatbotToken from '../../hooks/useChatbotToken';
import { COMPLETE } from '../../utils/loadingStatus';

describe('useChatbotToken', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useChatbotToken', () => {
    it('should return token loadingStatus', async () => {
      sandbox.stub(RetryOnce, 'default').resolves({
        token: 'abc',
      });

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken({ timeout: 1 }));
      });

      expect(result.result.current.token).to.equal('abc');
      expect(result.result.current.loadingStatus).to.equal(COMPLETE);
    });
  });
});
