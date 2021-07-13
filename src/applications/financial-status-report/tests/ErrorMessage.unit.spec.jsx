import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import ErrorMessage from '../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('should render va-alert', async () => {
    const fakeStore = {
      getState: () => ({
        fsr: {
          errorCode: {
            errors: [
              {
                title: 'Internal server error',
                detail: 'Internal server error',
                code: '500',
                status: '500',
              },
            ],
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const screen = render(<ErrorMessage store={fakeStore} />);
    const errorMessage = screen.findByText(
      "We're sorry. Something went wrong on our end.",
    );

    await waitFor(() => {
      expect(errorMessage).not.to.be.undefined;
    });
  });
});
