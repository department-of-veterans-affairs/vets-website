import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import Verify from './Verify';

describe('VASS Component: Verify', () => {
  it('should render all content', () => {
    const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
      <Verify />,
      {
        initialState: {},
      },
    );

    expect(getByTestId('header')).to.exist;
    expect(getByTestId('verify-intro-text')).to.exist;
    expect(getByTestId('last-name-input')).to.exist;
    expect(getByTestId('dob-input')).to.exist;
    expect(getByTestId('submit-button')).to.exist;
    expect(queryByTestId('verify-error-alert')).to.not.exist;
  });

  it('should display error alert when submitting with incorrect credentials', async () => {
    const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
      <Verify />,
      {
        initialState: {},
      },
    );

    const lastNameInput = getByTestId('last-name-input');
    const dobInput = getByTestId('dob-input');
    const submitButton = getByTestId('submit-button');

    // Enter incorrect credentials
    lastNameInput.value = 'WrongName';
    lastNameInput.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: 'WrongName' },
        bubbles: true,
      }),
    );

    dobInput.value = '1990-01-01';
    dobInput.dispatchEvent(
      new CustomEvent('dateChange', {
        detail: { value: '1990-01-01' },
        bubbles: true,
        composed: true,
      }),
    );

    submitButton.click();

    await waitFor(() => {
      expect(queryByTestId('verify-error-alert')).to.exist;
    });
  });
});
