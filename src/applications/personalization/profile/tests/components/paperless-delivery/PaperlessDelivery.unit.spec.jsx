import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { expect } from 'chai';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import { PaperlessDelivery } from '../../../components/paperless-delivery/PaperlessDelivery';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

describe('PaperlessDelivery', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the heading', () => {
    const { getByRole } = render(<PaperlessDelivery />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading).to.have.text('Paperless delivery');
  });

  it('should render the description', () => {
    const { getByText } = render(<PaperlessDelivery />);
    expect(
      getByText(
        /When you sign up, you’ll start receiving fewer documents by mail/,
      ),
    );
  });

  it('should render the note', () => {
    const { getByText } = render(<PaperlessDelivery />);
    expect(getByText(/enroll in additional paperless delivery options/));
  });

  it('should render alert when user has no email', async () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <PaperlessDelivery />,
      {
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
      },
    );

    expect(getByText(/Add your email to get delivery updates/));
  });
});
