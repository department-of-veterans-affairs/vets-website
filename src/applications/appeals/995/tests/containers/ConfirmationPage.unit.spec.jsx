import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import { $, $$ } from '~/platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

import ConfirmationPage from '../../containers/ConfirmationPage';
import maximalData from '../fixtures/data/maximal-test-v2.json';

import { SELECTED } from '../../../shared/constants';

const getData = ({ renderName = true, suffix = 'Esq.', data } = {}) => ({
  user: {
    profile: {
      userFullName: renderName
        ? { first: 'Foo', middle: 'Man', last: 'Choo', suffix }
        : {},
    },
  },
  form: {
    formId: formConfig.formId,
    submission: {
      response: Date.now(),
    },
    data: data || {
      contestedIssues: [
        {
          [SELECTED]: true,
          attributes: {
            ratingIssueSubjectText: 'test 543',
          },
        },
        {
          [SELECTED]: false,
          attributes: {
            ratingIssueSubjectText: 'test 987',
          },
        },
      ],
    },
  },
});

describe('Confirmation page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render with no data', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <ConfirmationPage />
      </Provider>,
    );
    expect($('va-alert[status="success"]', container)).to.exist;
  });

  it('should render the user name', () => {
    const { container } = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage />
      </Provider>,
    );
    expect($('.dd-privacy-hidden', container).textContent).to.contain(
      'Foo Man Choo, Esq.',
    );
  });

  it('should render the user name without suffix', () => {
    const { container } = render(
      <Provider store={mockStore(getData({ suffix: '' }))}>
        <ConfirmationPage />
      </Provider>,
    );
    expect($('.dd-privacy-hidden', container).textContent).to.contain(
      'Foo Man Choo',
    );
  });

  it('should not render the user name', () => {
    const { container } = render(
      <Provider store={mockStore(getData({ renderName: false }))}>
        <ConfirmationPage />
      </Provider>,
    );
    expect($('[data-dd-action-name="Veteran full name"]', container)).to.not
      .exist;
  });

  it('should focus on H2 inside va-alert', async () => {
    const { container } = render(
      <Provider store={mockStore(getData())}>
        <main id="main">
          <ConfirmationPage />
        </main>
      </Provider>,
    );
    const h2 = $('va-alert h2', container);
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should render confirmation page v2', () => {
    const data = getData({
      data: maximalData.data,
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect($$('ul', container).length).to.eq(7);
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(37);
  });
});
