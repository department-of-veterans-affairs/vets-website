import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import IntroductionPage from '../../containers/IntroductionPage';
import { getData } from '../fixtures/data/mock-form-data';

describe('IntroductionPage', () => {
  it('should show sign in alert if not logged in', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container, getByRole } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(getByRole('heading', { name: 'Ask VA', level: 1 })).to.exist;

    expect(container.querySelector('va-button')).to.have.attribute(
      'text',
      'Sign in or create an account',
    );

    expect(
      getByRole('heading', {
        name: 'Only use Ask VA for non-urgent needs',
        level: 2,
      }),
    ).to.exist;
  });

  it('should show search bar to check status if not logged in', async () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const searchInput = container.querySelector(
      'va-search-input[label="Reference number"]',
    );
    expect(searchInput).to.exist;
  });

  it('should ask for verification if loa1 and logged in', async () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      loaLevel: 1,
      signInServiceName: 'idme',
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    await waitFor(() => {
      expect(container.querySelector('va-alert-sign-in[variant="verifyIdMe"]'))
        .to.exist;
    });
  });

  it('should allow asking a question if loa3 and logged in', async () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      loaLevel: 3,
      signInServiceName: 'idme',
    });
    const { queryByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    await waitFor(() => {
      expect(queryByText('Ask a new question')).to.exist;
    });
  });
});
