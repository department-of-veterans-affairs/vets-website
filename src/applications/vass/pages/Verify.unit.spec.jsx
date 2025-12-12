import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';

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
    const {
      getByTestId,
      queryByTestId,
      container,
    } = renderWithStoreAndRouterV6(<Verify />, {
      initialState: {},
    });

    const submitButton = getByTestId('submit-button');

    const dobInput = container.querySelector(
      'va-memorable-date[data-testid="dob-input"]',
    );
    dobInput.__events.dateChange({ target: { value: '1990-01-01' } });

    inputVaTextInput(
      container,
      'WrongName',
      'va-text-input[data-testid="last-name-input"]',
    );

    submitButton.click();

    await waitFor(() => {
      expect(queryByTestId('verify-error-alert')).to.exist;
    });
  });
});
