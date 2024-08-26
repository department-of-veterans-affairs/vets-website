import React from 'react';

import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import ShowKeypadButton from '../../../components/buttons/ShowKeypadButton';
import { renderWithReduxProvider } from '../../contexts/test-helpers/CallContextProviderTestHelpers';
import { getShowKeypadButton } from '../phone/test-helpers/PhoneViewTestHelpers';

describe('ShowKeypadButton', () => {
  const doRender = () => renderWithReduxProvider(<ShowKeypadButton />);

  it('dispatches a toggle keypad action on click', () => {
    const { view, store } = doRender();

    userEvent.click(getShowKeypadButton(view));
    const { call } = store.getState();
    expect(call.isKeypadVisible).to.be.true;
  });
});
