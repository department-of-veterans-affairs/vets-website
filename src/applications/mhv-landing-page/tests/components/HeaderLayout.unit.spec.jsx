import React from 'react';
import { expect } from 'chai';

import { waitFor } from '@testing-library/react';
import { render } from '../unit-spec-helpers';
import HeaderLayout from '../../components/HeaderLayout';

describe('MHV Landing Page -- Header Layout', () => {
  const stateFn = ({
    loading = false,
    confirmationDate = '2025-09-30T12:00:00.000+00:00',
    emailAddress = 'vet@va.gov',
    updatedAt = '2025-09-30T12:00:00.000+00:00',
    oracleHealth = false,
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
        userAtPretransitionedOhFacility: oracleHealth,
        userFacilityReadyForInfoAlert: oracleHealth,
      },
    },
  });

  it('renders', async () => {
    const { getByTestId } = render(<HeaderLayout />);
    await waitFor(() => {
      getByTestId('mhv-header-layout--milestone-2');
    });
  });
  describe('showCernerInfoAlert prop', () => {
    const initialState = stateFn({ oracleHealth: true });
    it('renders info alert when showCernerInfoAlert is true', async () => {
      const { getByTestId } = render(<HeaderLayout showCernerInfoAlert />, {
        initialState,
      });
      await waitFor(() => {
        expect(getByTestId('cerner-facilities-info-alert')).to.exist;
      });
    });
    it('renders learn more text and link when showCernerInfoAlert is true', async () => {
      const { getByText, container } = render(
        <HeaderLayout showCernerInfoAlert />,
        {
          initialState,
        },
      );
      await waitFor(() => {
        expect(getByText(/Want to learn more about what/)).to.exist;
        const learnMoreLink = container.querySelector(
          'va-link[text="Learn more about My HealtheVet on VA.gov"]',
        );
        expect(learnMoreLink).to.exist;
        expect(learnMoreLink.getAttribute('href')).to.equal(
          '/resources/my-healthevet-on-vagov-what-to-know',
        );
      });
    });
    it('does not render info alert or learn more when showCernerInfoAlert is false', async () => {
      const { queryByTestId, queryByText, container } = render(
        <HeaderLayout />,
        {
          initialState: stateFn(),
        },
      );
      await waitFor(() => {
        queryByTestId('mhv-header-layout--milestone-2');
        expect(queryByTestId('cerner-facilities-info-alert')).to.not.exist;
        expect(queryByText(/Want to learn more about what/)).to.not.exist;
        const learnMoreLink = container.querySelector(
          'va-link[text="Learn more about My HealtheVet on VA.gov"]',
        );
        expect(learnMoreLink).to.not.exist;
      });
    });
  });

  describe('MhvAlertConfirmEmail component', () => {
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
