import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import moment from 'moment';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

import ConfirmationPage from '../../containers/ConfirmationPage';
import { SELECTED } from '../../../shared/constants';

const getData = () => ({
  user: {
    profile: {
      userFullName: {
        first: 'Foo',
        middle: 'Man',
        last: 'Choo',
        suffix: 'Esq.',
      },
    },
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
  it('should render the submit date', () => {
    const data = getData();
    const date = moment(data.form.submission.response).format('MMMM D, YYYY');
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect($('.inset', container).textContent).to.contain(date);
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
});
