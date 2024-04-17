import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';

const { errors } = mockDisabilityCompensations.updates;

import { UpdateErrorAlert } from '../../../components/direct-deposit/alerts/UpdateErrorAlert';

describe('<UpdateErrorAlert />', () => {
  it('renders', () => {
    const { container } = render(
      <UpdateErrorAlert saveError={errors.generic} />,
    );
    expect(container.innerHTML).to.not.be.empty;
  });

  it('renders the default error when it gets an unrecognized error message', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.generic.errors} />,
    );
    expect(
      await findByText(
        'We’re sorry. We couldn’t update your payment information. Please try again later.',
      ),
    ).to.exist;
  });

  it('renders the invalid routing number error for checksum error', async () => {
    const { findByText } = render(
      <UpdateErrorAlert
        saveError={errors.invalidChecksumRoutingNumber.errors}
      />,
    );
    expect(
      await findByText(
        'We can’t find a bank linked to the routing number you entered.',
      ),
    ).to.exist;
  });

  it('renders the invalid routing number error for invalid error', async () => {
    const { findByText: findByText2 } = render(
      <UpdateErrorAlert saveError={errors.invalidRoutingNumber.errors} />,
    );
    expect(
      await findByText2(
        'We can’t find a bank linked to the routing number you entered.',
      ),
    ).to.exist;
  });

  it('renders the flagged account error', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.accountNumberFlagged.errors} />,
    );
    expect(
      await findByText(
        'We’re sorry. You can’t change your direct deposit information right now because we’ve locked the ability to edit this information. We do this to protect your bank account information and prevent fraud when we think there may be a security issue.',
      ),
    ).to.exist;
  });

  it('renders the flagged routing number error', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.routingNumberFlagged.errors} />,
    );
    expect(
      await findByText(
        /We’re sorry. The bank routing number you entered requires additional verification before we can save your information/i,
      ),
    ).to.exist;
  });

  it('renders the mailing address error', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.invalidMailingAddress.errors} />,
    );
    expect(
      await findByText(
        /We’re sorry. We couldn’t update your direct deposit bank information because your mailing address is missing or invalid./i,
      ),
    ).to.exist;
  });

  it('renders the day phone number error', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.invalidDayPhone.errors} />,
    );
    expect(
      await findByText(
        /We’re sorry. We couldn’t update your direct deposit bank information because your work phone number is missing or invalid./i,
      ),
    ).to.exist;
  });

  it('renders the night phone number error', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.invalidNightPhone.errors} />,
    );
    expect(
      await findByText(
        /We’re sorry. We couldn’t update your direct deposit bank information because your home phone number is missing or invalid./i,
      ),
    ).to.exist;
  });
});
