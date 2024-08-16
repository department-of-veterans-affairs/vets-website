import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import CallActionButton from '../../../components/buttons/CallActionButton';
import { CONNECTED, ENDED, INITIATED } from '../../../constants';
import { renderWithCallContextProvider } from '../../contexts/test-helpers/CallContextProviderTestHelpers';
import {
  getCallButton,
  getHangUpButton,
} from './test-helpers/CallActionButtonTestHelpers';

describe('CallActionButton', () => {
  const doRender = ({ state = {}, props = {} } = {}) => {
    const testProps = {
      calleeSipUri: '',
      extraHeaders: [],
      ...props,
    };
    return renderWithCallContextProvider(<CallActionButton {...testProps} />, {
      state,
    });
  };

  describe('when the call is initializing', () => {
    const state = {
      state: INITIATED,
    };

    it('renders a hang up button', () => {
      const { view } = doRender({ state });

      getHangUpButton(view);
    });

    it('calls the hang up callback on click', () => {
      const { view, callContext } = doRender({ state });

      userEvent.click(getHangUpButton(view));
      sinon.assert.calledOnce(callContext.hangUp);
    });
  });

  describe('when the call is active', () => {
    const state = {
      state: CONNECTED,
    };

    it('renders a hang up button', () => {
      const { view } = doRender({ state });

      getHangUpButton(view);
    });

    it('calls the hang up callback on click', () => {
      const { view, callContext } = doRender({ state });

      userEvent.click(getHangUpButton(view));
      sinon.assert.calledOnce(callContext.hangUp);
    });
  });

  describe('when the call is not initializing or active', () => {
    const state = {
      state: ENDED,
    };

    it('renders a call button', () => {
      const { view } = doRender({ state });

      getCallButton(view);
    });

    it('calls the call callback on click', () => {
      const calleeSipUri = 'sip:bob@sip.local';
      const extraHeaders = ['X-Custom-Header: value'];

      const { view, callContext } = doRender({
        state,
        props: { calleeSipUri, extraHeaders },
      });

      userEvent.click(getCallButton(view));
      sinon.assert.calledOnceWithExactly(
        callContext.call,
        calleeSipUri,
        extraHeaders,
      );
    });
  });
});
