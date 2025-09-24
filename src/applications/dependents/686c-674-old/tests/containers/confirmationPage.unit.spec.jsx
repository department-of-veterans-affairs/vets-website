import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import ConfirmationPage from '../../containers/ConfirmationPage';

const getData = ({
  loggedIn = true,
  timestamp = new Date('09/07/2024'),
} = {}) => ({
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          verified: false,
        },
      },
      form: {
        submission: {
          formSubmissionId: '123fake-submission-id-567',
          timestamp,
          attributes: {
            guid: '123fake-submission-id-567',
          },
        },
        data: {
          veteranFullName: { first: 'Jane', last: 'Doe' },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('Dependents Form (686c-674) confirmation page', () => {
  it('should render', () => {
    const { mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );

    expect($$('h2', container).length).to.eql(6);
    expect($$('va-link', container).length).to.eql(5);
    expect($$('va-alert[status="success', container).length).to.equal(1);
    expect($('va-button', container).getAttribute('text')).to.eq(
      'Print this page for your records',
    );

    const sections = $$('section');
    expect(sections.length).to.eql(4);

    expect($$('.va-address-block', container).length).to.eq(2);
    expect($$('va-telephone', container).length).to.eq(4);
  });

  it('should render empty date string', () => {
    const { mockStore } = getData({ timestamp: null });
    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(queryByTestId('dateSubmitted').children.length).to.eql(0);
  });

  it('should fire print event', () => {
    const { mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );

    const button = $(
      'va-button[text="Print this page for your records"]',
      container,
    );
    fireEvent.click(button);
    expect(window.document.body.innerHTML.length).greaterThan(1);
  });
});
