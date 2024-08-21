import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ReviewRowView, {
  AltReviewRowView,
  CurrencyReviewRowView,
} from '../../components/ReviewRowView';

const store = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
    },
    form: {
      formId: '21P-530EZ',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
      contestedIssues: {},
    },
    featureToggles: {
      loading: false,
      [`burials_form_enabled`]: true,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('All ReviewRowView exported components', () => {
  it('renders the ReviewRowView component', () => {
    const { getAllByRole } = render(
      <Provider store={store}>
        <ReviewRowView />
      </Provider>,
    );

    const definitionList = getAllByRole('definition');
    expect(definitionList).to.exist;
  });

  it('renders the AltReviewRowView component', () => {
    const { getAllByRole } = render(
      <Provider store={store}>
        <AltReviewRowView />
      </Provider>,
    );

    const definitionList = getAllByRole('definition');
    expect(definitionList).to.exist;
  });

  it('renders CurrencyReviewRowView component', () => {
    const { getAllByRole } = render(
      <Provider store={store}>
        <CurrencyReviewRowView />
      </Provider>,
    );

    const definitionList = getAllByRole('definition');
    expect(definitionList).to.exist;
  });
});
