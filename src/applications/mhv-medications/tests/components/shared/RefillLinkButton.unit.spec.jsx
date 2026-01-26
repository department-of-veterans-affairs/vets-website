import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RefillNavButton from '../../../components/shared/RefillNavButton';
import reducers from '../../../reducers';
import { dataDogActionNames } from '../../../util/dataDogConstants';

describe('RefillLinkButton component', () => {
  const defaultRx = {
    prescriptionId: 12345,
    isRefillable: true,
  };

  const setup = (rx = defaultRx) => {
    return renderWithStoreAndRouterV6(<RefillNavButton rx={rx} />, {
      initialState: {},
      reducers,
      initialEntries: ['/'],
    });
  };

  it('renders without errors when prescription is refillable', () => {
    const screen = setup();
    expect(screen.getByTestId('refill-nav-button')).to.exist;
  });

  it('displays "Request a refill" button text', () => {
    const screen = setup();
    const button = screen.getByTestId('refill-nav-button');
    expect(button).to.have.attribute('text', 'Request a refill');
  });

  it('does not render when isRefillable is false', () => {
    const rx = { ...defaultRx, isRefillable: false };
    const screen = setup(rx);
    expect(screen.queryByTestId('refill-nav-button')).to.not.exist;
  });

  it('does not render when isRefillable is undefined', () => {
    const rx = { prescriptionId: 12345 };
    const screen = setup(rx);
    expect(screen.queryByTestId('refill-nav-button')).to.not.exist;
  });

  it('has correct id attribute with prescription ID', () => {
    const screen = setup();
    const button = screen.getByTestId('refill-nav-button');
    expect(button).to.have.attribute('id', 'refill-nav-button-12345');
  });

  it('has correct aria-describedby attribute', () => {
    const screen = setup();
    const button = screen.getByTestId('refill-nav-button');
    expect(button).to.have.attribute('aria-describedby', 'card-header-12345');
  });

  it('has correct data-dd-action-name for analytics', () => {
    const screen = setup();
    const button = screen.getByTestId('refill-nav-button');
    expect(button).to.have.attribute(
      'data-dd-action-name',
      dataDogActionNames.medicationsListPage.REQUEST_REFILL_CARD_LINK,
    );
  });
});
