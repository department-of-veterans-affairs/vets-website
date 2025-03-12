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
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
      form: {
        data: {
          categoryId: '73524deb-d864-eb11-bb24-000d3a579c45',
          selectCategory: 'Health care',
          allowAttachments: false,
          contactPreferences: ['Email'],
          selectTopic: 'Audiology and hearing aids',
          topicId: 'c0da1728-d91f-ed11-b83c-001dd8069009',
          whoIsYourQuestionAbout: "It's a general question",
          initialFormData: {
            categoryId: undefined,
            selectCategory: undefined,
            selectTopic: undefined,
            topicId: undefined,
            whoIsYourQuestionAbout: undefined,
          },
        },
      },
    });
  });

  afterEach(cleanup);

  it('should render without crashing', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <ProgressBar pathname="/category-topic-1" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText(/0% complete with form/)).to.exist;
    });
  });

  it('should show progress bar for constant path', async () => {
    const { getByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('90% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('90% complete with form')).to.exist;
    });
  });

  it('should show progress bar for flow path', async () => {
    const { getByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar pathname="/about-myself-relationship-veteran-1" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('3% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/about-myself-relationship-veteran-1" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('3% complete with form')).to.exist;
    });
  });

  it('should update progress percent based on pathname', async () => {
    const { getByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar pathname="/category-topic-2" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('5% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/who-is-your-question-about" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('10% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('90% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/review-then-submit" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('98% complete with form')).to.exist;
    });

    // start going back
    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/review-then-submit" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('98% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('90% complete with form')).to.exist;
    });

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/who-is-your-question-about" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('10% complete with form')).to.exist;
    });

    const updatedStore = mockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
      form: {
        data: {
          categoryId: '73524deb-d864-eb11-bb24-000d3a579c45',
          selectCategory: 'Health care',
          allowAttachments: false,
          contactPreferences: ['Email'],
          selectTopic: 'Billing and co-pays',
          topicId: 'c0da1728-d91f-ed11-b83c-001dd8055555',
          whoIsYourQuestionAbout: undefined,
          initialFormData: {
            categoryId: undefined,
            selectCategory: undefined,
            selectTopic: undefined,
            topicId: undefined,
            whoIsYourQuestionAbout: undefined,
          },
        },
      },
    });

    rerender(
      <Provider store={updatedStore}>
        <ProgressBar pathname="/category-topic-2" />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('5% complete with form')).to.exist;
    });
  });
});
