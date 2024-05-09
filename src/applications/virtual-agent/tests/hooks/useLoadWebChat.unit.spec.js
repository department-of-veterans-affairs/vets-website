import sinon from 'sinon';
import { expect } from 'chai';

import { renderHook } from '@testing-library/react-hooks';
import * as UseFeatureToggleModule from '~/platform/utilities/feature-toggles/useFeatureToggle/';
import useLoadWebChat from '../../hooks/useLoadWebChat';

describe('useLoadWebChat', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useLoadWebChat', () => {
    it('should load regular webchat if virtualAgentUpgradeWebchat14158 feature toggle is false', () => {
      const useToggleValueStub = sandbox.stub().returns(false);
      sandbox.stub(UseFeatureToggleModule, 'useFeatureToggle').returns({
        useToggleValue: useToggleValueStub,
        TOGGLE_NAMES: {
          virtualAgentUpgradeWebchat14158: 'virtualAgentUpgradeWebchat14158',
        },
      });

      renderHook(() => useLoadWebChat());

      const script = document.querySelector('script');
      expect(script.src).to.equal(
        'https://cdn.botframework.com/botframework-webchat/4.15.8/webchat.js',
      );
    });
    it('should load webchat v4.16.1 if virtualAgentUpgradeWebchat14158 feature toggle is false', () => {
      const useToggleValueStub = sandbox.stub().returns(true);
      sandbox.stub(UseFeatureToggleModule, 'useFeatureToggle').returns({
        useToggleValue: useToggleValueStub,
        TOGGLE_NAMES: {
          virtualAgentUpgradeWebchat14158: 'virtualAgentUpgradeWebchat14158',
        },
      });

      renderHook(() => useLoadWebChat());

      const script = document.querySelector('script');
      expect(script.src).to.equal(
        'https://www.unpkg.com/botframework-webchat@4.16.1-main.20240405.6a623fb/dist/webchat.js',
      );
    });
  });
});
