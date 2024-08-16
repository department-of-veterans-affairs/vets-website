import React from 'react';

import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import HideKeypadButton from '../../../../components/buttons/keypad/HideKeypadButton';
import { renderWithReduxProvider } from '../../../contexts/test-helpers/CallContextProviderTestHelpers';
import { getHideKeypadButton } from '../../phone/test-helpers/PhoneViewTestHelpers';

describe('HideKeypadButton', () => {
  const doRender = () => renderWithReduxProvider(<HideKeypadButton />);

  it('dispatches a toggle keypad action on click', () => {
    const { view, store } = doRender();

    userEvent.click(getHideKeypadButton(view));
    const { call } = store.getState();
    expect(call.isKeypadVisible).to.be.true;
  });
});
