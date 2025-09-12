import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import directDeposits from '@@profile/mocks/endpoints/direct-deposits';

const { errors } = directDeposits.updates;

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

  // The Payment Restriction error alert is shared with accountNumberFlagged and paymentRestrictionsPresent
  const paymentRestrictionRegex = /We’re sorry. We couldn’t process your direct deposit update/i;

  it('renders the flagged account error', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.accountNumberFlagged.errors} />,
    );
    expect(await findByText(paymentRestrictionRegex)).to.exist;
  });

  it('renders the payment restriction error', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.paymentRestrictionsPresent.errors} />,
    );
    expect(await findByText(paymentRestrictionRegex)).to.exist;
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

  it('renders the mailing address error for missing payment address', async () => {
    const { findByText } = render(
      <UpdateErrorAlert saveError={errors.missingPaymentAddress.errors} />,
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
