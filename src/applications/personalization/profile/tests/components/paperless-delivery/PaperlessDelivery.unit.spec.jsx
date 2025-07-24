import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import { PaperlessDelivery } from '../../../components/paperless-delivery/PaperlessDelivery';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

describe('PaperlessDelivery', () => {
  let screen;

  beforeEach(() => {
    screen = render(<PaperlessDelivery />);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the heading', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading).to.have.text('Paperless delivery');
  });

  it('should render the description', () => {
    expect(
      screen.getByText(
        /When you sign up, you’ll start receiving fewer documents by mail/,
      ),
    );
  });

  it('should render the note', () => {
    expect(screen.getByText(/enroll in additional paperless delivery options/));
  });

  it('should render missing email alert when user has no email', async () => {
    const view = renderWithProfileReducersAndRouter(<PaperlessDelivery />, {
      initialState: {
        featureToggles: {
          loading: false,
          [featureFlagNames.profileShowPaperlessDelivery]: true,
        },
        user: {
          profile: {
            vapContactInfo: {
              email: {
                emailAddress: '',
              },
            },
          },
        },
      },
      path: '/profile/paperless-delivery',
    });

    await waitFor(
      () => expect(view.findByTestId('missing-email-info-alert')).to.exist,
    );
  });
});
