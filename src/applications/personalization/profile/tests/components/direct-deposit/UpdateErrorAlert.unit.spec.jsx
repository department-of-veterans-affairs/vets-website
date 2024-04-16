import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';

const { errors } = mockDisabilityCompensations.updates;

import { UpdateErrorAlert } from '../../../components/direct-deposit/alerts/UpdateErrorAlert';

describe('<UpdateErrorAlert />', () => {
  it('renders', () => {
    const { container } = render(
      <UpdateErrorAlert
        saveError={{
          error: errors.generic,
        }}
      />,
    );
    expect(container.innerHTML).to.not.be.empty;
  });

  it('renders the default error when it gets an unrecognized error message', () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.generic} />,
    );
    expect(
      findByText(
        'We’re sorry. We couldn’t update your payment information. Please try again later.',
      ),
    ).to.exist;
  });

  it('renders the invalid routing number error', () => {
    const { findByText } = render(
      <UpdateErrorAlert
        saveError={{ error: errors.invalidChecksumRoutingNumber }}
      />,
    );
    expect(
      findByText(
        'We can’t find a bank linked to the routing number you entered.',
      ),
    ).to.exist;

    const { findByText: findByText2 } = render(
      <UpdateErrorAlert saveError={{ error: errors.invalidRoutingNumber }} />,
    );
    expect(
      findByText2(
        'We can’t find a bank linked to the routing number you entered.',
      ),
    ).to.exist;
  });

  it('renders the flagged account error', () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.flaggedAccount} />,
    );
    expect(
      findByText(
        'We’re sorry. You can’t change your direct deposit information right now because we’ve locked the ability to edit this information. We do this to protect your bank account information and prevent fraud when we think there may be a security issue.',
      ),
    ).to.exist;
  });

  it('renders the flagged routing number error', () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={{ error: errors.flaggedRoutingNumber }} />,
    );
    expect(
      findByText(
        'We’re sorry. The bank routing number you entered requires additional verification before we can save your information. To use this bank routing number, you’ll need to call us at 800-827-1000 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
      ),
    ).to.exist;
  });
});
