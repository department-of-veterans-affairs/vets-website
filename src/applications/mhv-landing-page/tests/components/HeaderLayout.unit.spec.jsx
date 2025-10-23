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

  describe('MhvAlertConfirmEmail component', () => {
    const stateFn = ({
      loading = false,
      confirmationDate = '2025-09-30T12:00:00.000+00:00',
      emailAddress = 'vet@va.gov',
      updatedAt = '2025-09-30T12:00:00.000+00:00',
    } = {}) => ({
      featureToggles: {
        loading: false,
        mhvEmailConfirmation: true,
      },
      user: {
        profile: {
          loading,
          vaPatient: true,
          vapContactInfo: {
            email: {
              confirmationDate,
              emailAddress,
              updatedAt,
            },
          },
        },
      },
    });

    it('renders nothing', async () => {
      const { queryByTestId } = render(<HeaderLayout />, {
        initialState: stateFn(),
      });
      await waitFor(() => {
        expect(queryByTestId('mhv-alert--confirm-contact-email')).to.not.exist;
        expect(queryByTestId('mhv-alert--add-contact-email')).to.not.exist;
      });
    });

    it('renders when user.profile.vapContactInfo.email.updatedAt is before date threshold', async () => {
      const initialState = stateFn({
        updatedAt: '2022-01-31T12:00:00.000+00:00',
      });
      const { getByTestId } = render(<HeaderLayout />, {
        initialState,
      });
      await waitFor(() => {
        getByTestId('mhv-alert--confirm-contact-email');
      });
    });

    it('renders when !user.proflie.vapContactInfo.email.emailAddress', async () => {
      const initialState = stateFn({ emailAddress: '' });
      const { getByTestId } = render(<HeaderLayout />, { initialState });
      await waitFor(() => {
        getByTestId('mhv-alert--add-contact-email');
      });
    });
  });
});
