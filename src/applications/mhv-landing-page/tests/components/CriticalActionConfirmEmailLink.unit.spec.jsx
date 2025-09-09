import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { render } from '../unit-spec-helpers';

import CriticalActionConfirmEmailLink, {
  DATE_THRESHOLD,
} from '../../components/CriticalActionConfirmEmailLink';

const stateFn = ({
  loading = false,
  updatedAt = '2022-01-31T12:00:00.000+00:00',
} = {}) => ({
  user: {
    profile: {
      loading,
      vapContactInfo: {
        email: {
          updatedAt,
        },
      },
    },
  },
});

describe('<CriticalActionConfirmEmailLink />', () => {
  it('renders', async () => {
    const { getByTestId } = render(<CriticalActionConfirmEmailLink />, {
      initialState: stateFn(),
    });
    await waitFor(() => {
      getByTestId('va-profile--confirm-contact-email-link');
    });
  });

  it('renders nothing when loading', async () => {
    const initialState = stateFn({ loading: true });
    const { container } = render(<CriticalActionConfirmEmailLink />, {
      initialState,
    });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });

  it(`renders nothing when email was updated after ${DATE_THRESHOLD}`, async () => {
    const initialState = stateFn({
      updatedAt: '2025-09-08T12:00:00.000+00:00',
    });
    const { container } = render(<CriticalActionConfirmEmailLink />, {
      initialState,
    });
    await waitFor(() => {
      expect(container).to.be.empty;
    });
  });
});
