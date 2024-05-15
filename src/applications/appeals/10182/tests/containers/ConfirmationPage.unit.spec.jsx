import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

import ConfirmationPage from '../../containers/ConfirmationPage';

import { SELECTED } from '../../../shared/constants';
import { getReadableDate } from '../../../shared/utils/dates';

const getData = ({
  renderName = true,
  suffix = 'Esq.',
  nodConfirmationUpdate = false,
} = {}) => ({
  user: {
    profile: {
      userFullName: renderName
        ? { first: 'Foo', middle: 'Man', last: 'Choo', suffix }
        : {},
    },
  },
  featureToggles: {
    loading: false,
    nodConfirmationUpdate,
    // eslint-disable-next-line camelcase
    nod_confirmation_update: nodConfirmationUpdate,
  },
  form: {
    formId: formConfig.formId,
    submission: {
      response: Date.now(),
    },
    data: {
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

  it('should render the confirmation page', () => {
    const { container } = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage />
      </Provider>,
    );
    expect($('va-alert[status="success"]', container)).to.exist;
    expect($$('ul', container).length).to.eq(1);
    expect($$('.dd-privacy-hidden[data-dd-action-name]').length).to.eq(2);
  });
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

  it('should render the submit date', () => {
    const data = getData();
    const date = getReadableDate(data.form.submission.response);
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect($('va-summary-box', container).textContent).to.contain(date);
  });
  it('should render the selected contested issue', () => {
    const { container } = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage />
      </Provider>,
    );
    const list = $('ul', container);
    expect(list.textContent).to.contain('test 543');
    expect(list.textContent).not.to.contain('test 987');
    expect($$('span.dd-privacy-hidden', container).length).to.eq(1);
  });
  it('should focus on H2 inside va-alert', async () => {
    const { container } = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage />
      </Provider>,
    );
    const h2 = $('va-alert h2', container);
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should render confirmation page v2', () => {
    const { container } = render(
      <Provider store={mockStore(getData({ nodConfirmationUpdate: true }))}>
        <ConfirmationPage />
      </Provider>,
    );
    expect($$('ul', container).length).to.eq(4);
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(10);
  });
});
