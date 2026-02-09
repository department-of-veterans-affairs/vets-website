import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import Dropdown from '~/platform/site-wide/representative/components/header/Dropdown';

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
    render(<Dropdown {...defaultProps} {...props} />);

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
});
