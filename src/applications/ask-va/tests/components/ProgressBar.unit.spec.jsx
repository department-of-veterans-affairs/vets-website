import { cleanup, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProgressBar from '../../components/ProgressBar';

const mockStore = configureStore([]);

describe('<ProgressBar />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      askVA: {
        categoryID: 'testCategory',
      },
    });
  });

  afterEach(cleanup);

  it('should render without crashing', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <ProgressBar pathname="/category-topic-1" categoryID="testCategory" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText(/0% complete with form/)).to.exist;
    });
  });

  it('should show progress bar for constant path', async () => {
    const { getByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" categoryID="testCategory" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('90% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" categoryID="testCategory" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('90% complete with form')).to.exist;
    });
  });

  it('should show progress bar for flow path', async () => {
    const { getByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar
          pathname="/about-myself-relationship-veteran-1"
          categoryID="testCategory"
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('3% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar
          pathname="/about-myself-relationship-veteran-1"
          categoryID="testCategory"
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('3% complete with form')).to.exist;
    });
  });

  it('should update progress percent based on pathname', async () => {
    const { getByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar
          pathname="/who-is-your-question-about"
          categoryID="testCategory"
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('5% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar
          pathname="/reason-you-contacted-us"
          categoryID="testCategory"
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('10% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" categoryID="testCategory" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('90% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/review-then-submit" categoryID="testCategory" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('98% complete with form')).to.exist;
    });

    // start going back
    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/review-then-submit" categoryID="testCategory" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('98% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" categoryID="testCategory" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('90% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar
          pathname="/reason-you-contacted-us"
          categoryID="testCategory"
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('10% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar
          pathname="/who-is-your-question-about"
          categoryID="testCategory"
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('5% complete with form')).to.exist;
    });
  });
});
