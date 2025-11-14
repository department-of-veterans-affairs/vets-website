import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import Verify from './Verify';

describe('VASS Component: Verify', () => {
  it('should render page title', () => {
    const screen = render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render introductory text about verification', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>,
    );

    expect(
      getByText(
        /First, we’ll need your information so we can send you a one-time verification code/i,
      ),
    ).to.exist;
  });

  it('should render last name input field', () => {
    const { container } = render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>,
    );
    const lastNameInput = container.querySelector(
      'va-text-input[name="last-name"]',
    );

    expect(lastNameInput).to.exist;
    expect(lastNameInput.getAttribute('label')).to.equal('Your last name');
    expect(lastNameInput.getAttribute('required')).to.exist;
  });

  it('should render date of birth field', () => {
    const { container } = render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>,
    );
    const dobInput = container.querySelector('#dob-input');

    expect(dobInput).to.exist;
  });

  it('should render submit button', () => {
    const { container } = render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>,
    );
    const submitButton = container.querySelector('va-button');

    expect(submitButton).to.exist;
    expect(submitButton.getAttribute('text')).to.equal('Submit');
  });
});
