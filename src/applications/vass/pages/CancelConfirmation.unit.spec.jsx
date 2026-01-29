import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import CancelConfirmation from './CancelConfirmation';
import { getDefaultRenderOptions } from '../utils/test-utils';

describe('VASS Component: CancelConfirmation', () => {
  it('renders page, message, and appointment card', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <CancelConfirmation />,
      getDefaultRenderOptions(),
    );
    expect(getByTestId('cancel-confirmation-page')).to.exist;
    expect(getByTestId('cancel-confirmation-message').textContent).to.match(
      /If you need to reschedule, call us at.*/i,
    );
    expect(getByTestId('cancel-confirmation-phone')).to.exist;
    expect(getByTestId('appointment-card')).to.exist;
  });
});
