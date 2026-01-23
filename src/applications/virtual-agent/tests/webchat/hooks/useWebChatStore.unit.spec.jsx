import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';
import useWebChatStore from '../../../webchat/hooks/useWebChatStore';

describe('useWebChatStore', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useWebChatStore', () => {
    it('should create store with correct parameters', async () => {
      const isMobile = true;

      const createStore = sinon.stub();

      renderHook(() =>
        useWebChatStore({
          createStore,
          isMobile,
        }),
      );

      expect(createStore.calledOnce).to.be.true;
    });
  });
});
