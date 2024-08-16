import React from 'react';

import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import MuteButton from '../../../components/buttons/MuteButton';
import { renderWithReduxProvider } from '../../contexts/test-helpers/CallContextProviderTestHelpers';
import { getMuteButton } from '../phone/test-helpers/PhoneViewTestHelpers';

describe('MuteButton', () => {
  const doRender = ({ state = {} } = {}) =>
    renderWithReduxProvider(<MuteButton />, { state });

  it('dispatches a mute pressed action on click', () => {
    const { view, store } = doRender();

    userEvent.click(getMuteButton(view));
    const { call } = store.getState();
    expect(call.isMuted).to.be.true;
  });

  it('sets the button pressed CSS class when muted', () => {
    const { view } = doRender({
      state: { isMuted: true },
    });

    expect(getMuteButton(view)).to.have.class('phone-button-pressed-bg');
  });
});
