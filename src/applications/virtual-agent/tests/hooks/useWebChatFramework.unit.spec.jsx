import sinon from 'sinon';
import { expect } from 'chai';
import { act, renderHook } from '@testing-library/react-hooks';

import useWebChatFramework from '../../hooks/useWebChatFramework';
import { COMPLETE, LOADING } from '../../utils/loadingStatus';
import * as UseLoadWebChatModule from '../../hooks/useLoadWebChat';

describe('useWebChatFramework', () => {
  let sandbox;
  let clock;
  const originalWindow = global.window;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers({
      toFake: ['setInterval', 'clearInterval'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
    global.window = originalWindow;
  });

  describe('useWebChatFramework', () => {
    it('should set up the useLoadWebChat hook', () => {
      const useLoadWebChatSpy = sandbox.stub(UseLoadWebChatModule, 'default');
      renderHook(() => useWebChatFramework({ timeout: 1000 }));
      expect(useLoadWebChatSpy.calledOnce).to.be.true;
    });
    it('should return loadingStatus=LOADING while loading', async () => {
      sandbox.stub(UseLoadWebChatModule, 'default');

      const { result } = renderHook(() =>
        useWebChatFramework({ timeout: 1000 }),
      );

      expect(result.current.loadingStatus).to.equal(LOADING);
      expect(result.current.webChatFramework).to.equal(global.window.WebChat);
    });
    it('should return loadingStatus=COMPLETE and correct webChatFramework when web chat loads', async () => {
      sandbox.stub(UseLoadWebChatModule, 'default');

      const { result } = renderHook(() =>
        useWebChatFramework({ timeout: 1000 }),
      );
      act(() => {
        global.window.WebChat = 'test';
        clock.tick(4000);
      });

      expect(result.current.loadingStatus).to.equal(COMPLETE);
      expect(result.current.webChatFramework).to.equal(global.window.WebChat);
    });
  });
});
