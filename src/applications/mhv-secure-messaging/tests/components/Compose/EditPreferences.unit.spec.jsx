import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import { Paths } from '../../../util/constants';
import EditPreferences from '../../../components/ComposeForm/EditPreferences';

describe('EditPreferences component', () => {
  const setup = () => {
    return renderWithStoreAndRouter(<EditPreferences />, {
      initialState: {},
      reducers: reducer,
      path: Paths.COMPOSE,
    });
  };

  it('should open a modal when the edit preferences button is clicked', async () => {
    const screen = setup();

    const modal = screen.getByTestId('edit-list');
    expect(modal).to.have.attribute('visible', 'false');

    const editPreferencesButton = screen.getByTestId('edit-preferences-button');
    fireEvent.click(editPreferencesButton);
    expect(modal).to.have.attribute('visible', 'true');
  });

  it('should close the modal when the navigation link is clicked', () => {
    const screen = setup();
    const editPreferencesButton = screen.getByTestId('edit-preferences-button');
    fireEvent.click(editPreferencesButton);
    fireEvent.click(screen.getByTestId('edit-preferences-link'));
    expect(screen.getByTestId('edit-list')).to.have.attribute(
      'visible',
      'false',
    );
  });

  it('should close the modal when modal closeEvent is triggered', () => {
    const screen = setup();
    const editPreferencesButton = screen.getByTestId('edit-preferences-button');
    fireEvent.click(editPreferencesButton);
    const modal = screen.getByTestId('edit-list');

    const event = new CustomEvent('closeEvent', {
      bubbles: true,
    });
    modal.dispatchEvent(event);
    expect(screen.getByTestId('edit-list')).to.have.attribute(
      'visible',
      'false',
    );
  });
});
