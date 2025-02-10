// Dependencies.
import React from 'react';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
// Relative imports.
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import AuthContent from '.';

describe('Secure Messaging Page <AuthContent>', () => {
  const authContentProps = {
    authenticatedWithSSOe: true,
    cernerFacilities: [
      { usesCernerMessaging: true, facilityId: '123', isCerner: true },
    ],
    otherFacilities: [],
    ehrDataByVhaId: {
      358: { ehr: '', vamcFacilityName: '', vamcSystemName: '', vhaId: '' },
    },
    widgetType: 'secure-messaging-page',
  };
  const getState = ({
    featureTogglesAreLoading = false,
    mhvModernCtaLinks = true,
  } = {}) => ({
    featureToggles: {
      loading: featureTogglesAreLoading,
      /* eslint-disable camelcase */
      mhv_modern_cta_links: mhvModernCtaLinks,
      /* eslint-enable camelcase */
    },
  });

  it('renders what we expect', async () => {
    const screen = renderWithStoreAndRouter(
      <AuthContent {...authContentProps} />,
      {
        initialState: { ...getState() },
      },
    );

    await waitFor(() => {
      expect(screen.queryByText('Send or receive a secure message')).to.exist;
      expect(
        screen.queryByText(
          'How can VA secure messaging help me manage my health care?',
        ),
      ).to.exist;
      expect(screen.queryByText('Am I eligible to use secure messaging?')).to
        .exist;
      expect(screen.queryByText('How does secure messaging work?')).to.exist;
      expect(screen.queryByText('Send or receive a secure message')).to.exist;
      expect(
        screen.queryByText(
          'Can I use secure messaging for medical emergencies or urgent needs?',
        ),
      ).to.exist;
      expect(
        screen.queryByText(
          'Can I use secure messaging with community (non-VA) providers?',
        ),
      ).to.exist;
      expect(
        screen.queryByText('Will my personal health information be protected?'),
      ).to.exist;
      expect(screen.queryByText('What if I have more questions?')).to.exist;
    });
  });
});
