import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { render } from '../unit-spec-helpers';
import HeaderLayout from '../../components/HeaderLayout';

describe('MHV Landing Page -- Header Layout', () => {
  it('renders', async () => {
    const { getByTestId } = render(<HeaderLayout />);
    await waitFor(() => {
      getByTestId('mhv-header-layout--milestone-2');
    });
  });
  it('renders OH/My VA Health link when told to', async () => {
    const { getByTestId, getByRole } = render(<HeaderLayout isCerner />);
    await waitFor(() => {
      getByTestId('mhv-header-layout--milestone-2');
      const ohLink = getByRole('link', {
        name: /Go to the My VA Health portal/,
      });
      expect(ohLink.href).to.match(/patientportal\.myhealth\.va\.gov/);
    });
  });

  it('renders <ConfirmEmailLink /> when user.profile.vapContactInfo.email.updatedAt is null', async () => {
    const initialState = {
      user: {
        profile: {
          loading: false,
          vapContactInfo: {
            email: {
              updatedAt: null,
            },
          },
        },
      },
    };
    const { getByTestId } = render(<HeaderLayout />, {
      initialState,
    });
    await waitFor(() => {
      expect(getByTestId('va-profile--confirm-contact-email-link')).to.exist;
    });
  });

  it('renders <ConfirmEmailLink /> when user.profile.vapContactInfo.email.updatedAt is before EMAIL_UPDATED_AT_THRESHOLD', async () => {
    const initialState = {
      user: {
        profile: {
          loading: false,
          vapContactInfo: {
            email: {
              updatedAt: '2022-01-31T12:00:00.000+00:00',
            },
          },
        },
      },
    };
    const { getByTestId } = render(<HeaderLayout />, {
      initialState,
    });
    await waitFor(() => {
      expect(getByTestId('va-profile--confirm-contact-email-link')).to.exist;
    });
  });

  it('suppresses <ConfirmEmailLink /> when user.profile.loading', async () => {
    const initialState = {
      user: {
        profile: {
          loading: true,
          vapContactInfo: {},
        },
      },
    };
    const { queryByTestId } = render(<HeaderLayout />, { initialState });
    await waitFor(() => {
      expect(queryByTestId('va-profile--confirm-contact-email-link')).to.not
        .exist;
    });
  });

  it('suppresses <ConfirmEmailLink /> when user.profile.vapContactInfo.email.updatedAt is after EMAIL_UPDATED_AT_THRESHOLD', async () => {
    const initialState = {
      user: {
        profile: {
          loading: true,
          vapContactInfo: {
            email: {
              updatedAt: '2025-09-09T12:00:00.000+00:00',
            },
          },
        },
      },
    };
    const { queryByTestId } = render(<HeaderLayout />, { initialState });
    await waitFor(() => {
      expect(queryByTestId('va-profile--confirm-contact-email-link')).to.not
        .exist;
    });
  });
});
