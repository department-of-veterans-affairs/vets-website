import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '../helpers';

import SearchPageContainer, { SearchPage } from '../../containers/SearchPage';

describe('<SearchPage>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<SearchPageContainer />, {});

    await waitFor(() => {
      expect(screen.getByRole('heading', { 'aria-level': 1 })).to.be.ok;
    });
  });

  it('should set page title', async () => {
    const dispatchSetPageTitle = sinon.spy();

    const screen = renderWithStoreAndRouter(
      <SearchPage
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
