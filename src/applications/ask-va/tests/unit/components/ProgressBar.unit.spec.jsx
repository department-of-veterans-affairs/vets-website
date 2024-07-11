import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProgressBar from '../../../components/ProgressBar';

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

  it('should render without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ProgressBar pathname="/category-topic-1" categoryID="testCategory" />
      </Provider>,
    );

    expect(getByText(/complete with form/)).to.exist;
  });

  it('should show progress bar for constant path', () => {
    const { container } = render(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" categoryID="testCategory" />
      </Provider>,
    );

    const progressBar = container.querySelector('.ava-progress-bar');
    expect(progressBar).to.exist;
  });

  it('should update progress percent based on pathname', () => {
    const { getByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" categoryID="testCategory" />
      </Provider>,
    );

    expect(getByText('90% complete with form')).to.exist;

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/review-then-submit" categoryID="testCategory" />
      </Provider>,
    );

    expect(getByText('98% complete with form')).to.exist;
  });

  it('should update progress percent based on pathname', () => {
    const { getByText, rerender } = render(
      <Provider store={store}>
        <ProgressBar pathname="/your-question" categoryID="testCategory" />
      </Provider>,
    );

    expect(getByText('90% complete with form')).to.exist;

    rerender(
      <Provider store={store}>
        <ProgressBar pathname="/review-then-submit" categoryID="testCategory" />
      </Provider>,
    );

    expect(getByText('98% complete with form')).to.exist;
  });
});
