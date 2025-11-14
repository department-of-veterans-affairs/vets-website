import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import Verify from './Verify';

describe('VASS Component: Verify', () => {
  it('should render page title', () => {
    const screen = renderWithStoreAndRouter(<Verify />, {
      initialState: {},
    });

    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render introductory text about verification', () => {
    const { getByText } = renderWithStoreAndRouter(<Verify />, {
      initialState: {},
    });

    expect(
      getByText(
        /First, we'll need your information so we can send you a one-time verification code/i,
      ),
    ).to.exist;
  });

  it('should render last name input field', () => {
    const { container } = renderWithStoreAndRouter(<Verify />, {
      initialState: {},
    });
    const lastNameInput = container.querySelector(
      'va-text-input[name="last-name"]',
    );

    expect(lastNameInput).to.exist;
    expect(lastNameInput.getAttribute('label')).to.equal('Your last name');
    expect(lastNameInput.getAttribute('required')).to.exist;
  });

  it('should render date of birth field', () => {
    const { container } = renderWithStoreAndRouter(<Verify />, {
      initialState: {},
    });
    const dobInput = container.querySelector('#dob-input');

    expect(dobInput).to.exist;
  });

  it('should render submit button', () => {
    const { container } = renderWithStoreAndRouter(<Verify />, {
      initialState: {},
    });
    const submitButton = container.querySelector('va-button');

    expect(submitButton).to.exist;
    expect(submitButton.getAttribute('text')).to.equal('Submit');
  });
});
