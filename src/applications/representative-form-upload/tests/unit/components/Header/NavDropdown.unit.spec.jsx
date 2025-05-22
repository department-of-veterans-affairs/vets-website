import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';

import NavDropdown from '../../../../components/Header/NavDropdown';

describe('NavDropdown', () => {
  const defaultProps = {
    btnText: 'My Account',
    icon: 'account',
    view: 'mobile',
    firstName: 'John',
    lastName: 'Doe',
    closeIcon: 'close',
    children: <li>Settings</li>,
  };

  const subject = (props = {}) =>
    render(<NavDropdown {...defaultProps} {...props} />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });

  it('displays first and last name if provided', () => {
    const { getByText } = subject();
    expect(getByText('John')).to.exist;
    expect(getByText('Doe')).to.exist;
  });

  it('does not display dropdown content by default', () => {
    const { queryByTestId } = subject();
    expect(
      queryByTestId(
        `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}-list`,
      ),
    ).to.be.null;
  });

  it('shows dropdown content after clicking the button', () => {
    const { getByTestId, queryByTestId } = subject();
    const toggleButton = getByTestId(
      `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}`,
    );

    fireEvent.click(toggleButton);

    expect(
      queryByTestId(
        `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}-list`,
      ),
    ).to.exist;
  });

  it('hides dropdown content after clicking twice', () => {
    const { getByTestId, queryByTestId } = subject();
    const toggleButton = getByTestId(
      `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}`,
    );

    fireEvent.click(toggleButton); // Open
    fireEvent.click(toggleButton); // Close

    expect(
      queryByTestId(
        `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}-list`,
      ),
    ).to.be.null;
  });

  it('closes dropdown when clicking outside', () => {
    const { getByTestId, queryByTestId } = subject();
    const toggleButton = getByTestId(
      `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}`,
    );

    fireEvent.click(toggleButton); // Open

    expect(
      queryByTestId(
        `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}-list`,
      ),
    ).to.exist;

    // simulate click outside dropdown
    fireEvent.mouseDown(document.body);

    expect(
      queryByTestId(
        `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}-list`,
      ),
    ).to.be.null;
  });

  it('renders close text and icon when dropdown is open and closeIcon is provided', () => {
    const { getByTestId, getByText } = subject();
    const toggleButton = getByTestId(
      `${defaultProps.icon}-toggle-dropdown-${defaultProps.view}`,
    );

    fireEvent.click(toggleButton); // Open

    expect(getByText('Close')).to.exist;
    expect(toggleButton.querySelector('va-icon')).to.have.attribute(
      'icon',
      'close',
    );
  });
});
