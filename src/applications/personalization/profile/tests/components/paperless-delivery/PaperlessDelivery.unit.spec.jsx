import React from 'react';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { renderWithStoreAndRouter as render } from '~/platform/testing/unit/react-testing-library-helpers';
import { PaperlessDelivery } from '../../../components/paperless-delivery/PaperlessDelivery';

describe('PaperlessDelivery', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the heading', () => {
    const { getByRole } = render(<PaperlessDelivery />, {
      initialState: {},
    });
    const heading = getByRole('heading', { level: 1 });
    expect(heading).to.exist;
    expect(heading).to.have.text('Paperless delivery');
  });

  it('should render the description', () => {
    const { getByText } = render(<PaperlessDelivery />, {
      initialState: {},
    });
    expect(
      getByText(
        /When you sign up, you’ll start receiving fewer documents by mail/,
      ),
    ).to.exist;
  });

  it('should render the note', () => {
    const { getByText } = render(<PaperlessDelivery />, {
      initialState: {},
    });
    expect(getByText(/enroll in additional paperless delivery options/)).to
      .exist;
  });

  it('should not render missing email alert when user has an email address', () => {
    const initialState = {
      user: {
        profile: {
          vapContactInfo: {
            email: {
              emailAddress: 'alongusername@me.com',
            },
          },
        },
      },
    };
    const { queryByText } = render(<PaperlessDelivery />, {
      initialState,
    });
    expect(queryByText(/Add your email to get delivery updates/)).not.to.exist;
  });

  it('should render email and update email address link when user has an email address', () => {
    const initialState = {
      user: {
        profile: {
          vapContactInfo: {
            email: {
              emailAddress: 'alongusername@me.com',
            },
          },
        },
      },
    };
    const { getByText, getByRole } = render(<PaperlessDelivery />, {
      initialState,
    });
    expect(getByText(/alongusername@me.com/)).to.exist;
    expect(getByRole('link', { name: /Update your email address/ })).to.exist;
  });

  it('should render missing email alert when user has no email address', () => {
    const initialState = {
      user: {
        profile: {
          vapContactInfo: {
            email: {
              emailAddress: null,
            },
          },
        },
      },
    };
    const { getByText } = render(<PaperlessDelivery />, {
      initialState,
    });
    expect(getByText(/Add your email to get delivery updates/)).to.exist;
  });

  it('should render add email address link when user has no email address', () => {
    const initialState = {
      user: {
        profile: {
          vapContactInfo: {
            email: {
              emailAddress: null,
            },
          },
        },
      },
    };
    const { getByRole } = render(<PaperlessDelivery />, {
      initialState,
    });
    expect(
      getByRole('link', { name: /Add your email address to your profile/ }),
    ).to.exist;
  });
});
