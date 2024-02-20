/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import Sinon from 'sinon';
import { fireEvent } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '../../../tests/mocks/setup';
import useHandleKeyDown from '../useHandleKeyDown';

function UseHandleKeyDown() {
  const handler = useHandleKeyDown({
    link: 'va.gov',
    idClickable: 'clickMe',
  });

  return (
    <button id="clickMe" type="button" onKeyDown={handler()}>
      Click me
    </button>
  );
}

describe('VAOS Appointment list hooks: useHandleKeyDown', () => {
  it('should push link to history object when button is clicked', async () => {
    // Arrange
    const screen = renderWithStoreAndRouter(<UseHandleKeyDown />, {
      initialState: {},
    });
    const button = screen.getByText('Click me');

    // Act
    fireEvent.keyDown(button, {
      key: 'Space',
      code: 'Space',
      charCode: 32,
    });

    // Assert
    Sinon.assert.calledWith(screen.history.push, 'va.gov');
  });
});
