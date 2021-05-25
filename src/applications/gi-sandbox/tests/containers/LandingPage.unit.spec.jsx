import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '../helpers';

import LandingPageContainer, {
  LandingPage,
} from '../../containers/LandingPage';

describe('<LandingPage>', () => {
  it.skip('should render', async () => {
    const screen = renderWithStoreAndRouter(<LandingPageContainer />, {});

    await waitFor(() => {
      expect(screen.getByRole('heading', { 'aria-level': 1 })).to.be.ok;
    });
  });

  it.skip('should set page title', async () => {
    const dispatchSetPageTitle = sinon.spy();

    const screen = renderWithStoreAndRouter(
      <LandingPage
        dispatchSetPageTitle={dispatchSetPageTitle}
        search={{ inProgress: true }}
      />,
      {},
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { 'aria-level': 1 })).to.be.ok;
    });

    expect(dispatchSetPageTitle.called).to.be.true;
  });
});
