import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import NavDropdown from '../../../../../components/common/Header/NavDropdown';

describe('opens and closes dropdown on button click and outside click', () => {
  it('renders', () => {
    const { getByTestId, queryByTestId } = render(
      <div>
        <NavDropdown
          btnText="Menu"
          icon="user"
          view="desktop"
          firstName="John"
          lastName="Doe"
        >
          <li>Profile</li>
          <li>Settings</li>
        </NavDropdown>
        <div data-testid="outside-element">Outside</div>
      </div>,
    );

    const toggleButton = getByTestId('user-toggle-dropdown-desktop');
    fireEvent.click(toggleButton);

    const dropdown = getByTestId('user-toggle-dropdown-desktop-list');

    expect(dropdown).to.exist;

    // Click outside the dropdown
    const outsideElement = getByTestId('outside-element');
    fireEvent.mouseDown(outsideElement);

    // Dropdown should be closed
    expect(queryByTestId('user-toggle-dropdown-desktop-list')).not.to.exist;
  });
});
