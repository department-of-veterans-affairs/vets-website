/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import userEvent from '@testing-library/user-event';
import Sinon from 'sinon';
import PropTypes from 'prop-types';
import useHandleClick from './useHandleClick';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';

function UseHandleClick({ idClickable }) {
  const handler = useHandleClick({
    link: 'va.gov',
    idClickable,
  });

  return (
    <>
      <button id="clickMe" type="button" onClick={handler()}>
        Click me
      </button>
    </>
  );
}
UseHandleClick.propTypes = {
  idClickable: PropTypes.string.isRequired,
};

describe('VAOS Hooks: useHandleClick', () => {
  it('should push link to history object when button is clicked', async () => {
    // Arrange
    const screen = renderWithStoreAndRouter(
      <UseHandleClick idClickable="clickMe" />,
      {
        initialState: {},
      },
    );

    // Act
    userEvent.click(screen.getByText('Click me'));

    // Assert
    Sinon.assert.calledWith(screen.history.push, 'va.gov');
  });
});
