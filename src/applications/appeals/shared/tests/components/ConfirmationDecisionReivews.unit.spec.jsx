import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moment from 'moment';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ConfirmationDecisionReviews from '../../components/ConfirmationDecisionReviews';
import { SELECTED } from '../../constants';

const getData = ({ renderName = true, suffix = 'Esq.' } = {}) => ({
  user: {
    profile: {
      userFullName: renderName
        ? { first: 'Foo', middle: 'Man', last: 'Choo', suffix }
        : {},
    },
  },
  form: {
    formId: '12345',
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

  it('should render the confirmation page with children', () => {
    const { container } = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationDecisionReviews
          pageTitle="Request a snack"
          alertTitle="You have successfully requested a snack"
        >
          <div id="content">
            <h3>After your snack</h3>
            <p>Take a nap</p>
          </div>
        </ConfirmationDecisionReviews>
      </Provider>,
    );
    const alert = $('va-alert[status="success"]', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain('successfully requested a snack');

    expect($$('.dd-privacy-hidden[data-dd-action-name]').length).to.eq(2);
    expect($('h2', container).textContent).to.eq('Request a snack');
    expect($('#content h3', container).textContent).to.eq('After your snack');
    expect($('#content p', container).textContent).to.eq('Take a nap');
  });

  it('should render with no data', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <ConfirmationDecisionReviews />
      </Provider>,
    );
    expect($('va-alert[status="success"]', container)).to.exist;
  });

  it('should render the user name', () => {
    const { container } = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationDecisionReviews alertTitle="test" />
      </Provider>,
    );
    expect($('.dd-privacy-hidden', container).textContent).to.contain(
      'Foo Man Choo, Esq.',
    );
  });
  it('should render the user name without suffix', () => {
    const { container } = render(
      <Provider store={mockStore(getData({ suffix: '' }))}>
        <ConfirmationDecisionReviews alertTitle="test" />
      </Provider>,
    );
    expect($('.dd-privacy-hidden', container).textContent).to.contain(
      'Foo Man Choo',
    );
  });
  it('should not render the user name', () => {
    const { container } = render(
      <Provider store={mockStore(getData({ renderName: false }))}>
        <ConfirmationDecisionReviews />
      </Provider>,
    );
    expect($('[data-dd-action-name="Veteran full name"]', container)).to.not
      .exist;
  });

  it('should render the submit date', () => {
    const data = getData();
    const date = moment(data.form.submission.response).format('MMMM D, YYYY');
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationDecisionReviews />
      </Provider>,
    );
    expect($('va-summary-box', container).innerHTML).to.contain(date);
  });
  it('should render the selected contested issue', () => {
    const { container } = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationDecisionReviews alertTitle="test" />
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
        <ConfirmationDecisionReviews />
      </Provider>,
    );
    const h2 = $('va-alert h2', container);
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should render with no data', () => {
    const getEmptyData = () => ({
      user: {
        profile: {},
      },
      form: {
        formId: '12345',
        submission: {
          response: Date.now(),
        },
        data: {},
      },
    });
    const { container } = render(
      <Provider store={mockStore(getEmptyData())}>
        <ConfirmationDecisionReviews />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('va-summary-box', container)).to.exist;
  });
});
