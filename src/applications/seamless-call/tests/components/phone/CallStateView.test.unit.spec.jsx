import React from 'react';

import { expect } from 'chai';
import CallStateView from '../../../components/phone/CallStateView';
import { CONNECTED, ENDED, FAILED, INITIATED } from '../../../constants';
import jssip from '../../../utils/JsSipWrapper';
import { renderWithReduxProvider } from '../../contexts/test-helpers/CallContextProviderTestHelpers';
import { getUnavailableErrorStateText } from '../../utils/test-helpers/CallErrorStateTestHelpers';
import { getCallInitiatedText } from '../../utils/test-helpers/CallStateTestHelpers';
import { getElapsedCallTime } from './test-helpers/ElapsedCallTimeTestHelpers';
import { getAudioElement } from './test-helpers/RemoteStreamAudioTestHelpers';

describe('CallStateView', () => {
  const doRender = ({ state = {} } = {}) =>
    renderWithReduxProvider(<CallStateView />, { state });

  describe('when the call state is null', () => {
    it('renders nothing', () => {
      const { view } = doRender({
        state: { state: null },
      });

      expect(view.container).to.be.empty;
    });
  });

  describe('when the call is initializing', () => {
    const callInitializing = {
      state: INITIATED,
    };

    it('renders a call state display', () => {
      const { view } = doRender({ state: callInitializing });

      getCallInitiatedText(view);
    });
  });

  describe('when the call is active', () => {
    const callActive = {
      state: CONNECTED,
    };

    it('renders a remote audio element', () => {
      const { view } = doRender({ state: callActive });

      getAudioElement(view);
    });

    it('renders the elapsed call time', () => {
      const { view } = doRender({ state: callActive });

      getElapsedCallTime(view, '00:00');
    });
  });

  describe('when the call ended', () => {
    it('renders the elapsed call time', () => {
      const { view } = doRender({ state: { state: ENDED } });

      getElapsedCallTime(view, '00:00');
    });
  });

  describe('when the call failed', () => {
    it('renders a call error state display', () => {
      const { view } = doRender({
        state: {
          state: FAILED,
          errorState: jssip.C.causes.UNAVAILABLE,
        },
      });

      getUnavailableErrorStateText(view);
    });
  });
});
