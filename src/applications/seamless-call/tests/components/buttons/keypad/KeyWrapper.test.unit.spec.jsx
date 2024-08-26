import React from 'react';

import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import KeyWrapper from '../../../../components/buttons/keypad/KeyWrapper';
import { CONNECTED } from '../../../../constants';
import { renderWithReduxProvider } from '../../../contexts/test-helpers/CallContextProviderTestHelpers';
import { getKey0 } from '../../phone/test-helpers/PhoneViewTestHelpers';

describe('KeyWrapper', () => {
  const doRender = ({ state = {}, props = {} } = {}) => {
    const testProps = {
      character: '0',
      ...props,
    };
    return renderWithReduxProvider(<KeyWrapper {...testProps} />, {
      state,
    });
  };

  it('dispatches a keypad button pressed action on click', () => {
    const character = '0';
    const { view, store } = doRender({
      state: { state: CONNECTED },
      props: { character },
    });

    userEvent.click(getKey0(view));
    const { call } = store.getState();
    expect(call.keypadPresses).to.eql([character]);
  });
});
