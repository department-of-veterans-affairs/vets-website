import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ContestableIssuesWidget from '../../components/ContestableIssuesWidget';

describe('<ContestableIssuesWidget>', () => {
  const mockStore = {
    getState: () => ({
      form: {
        data: {
          contestedIssues: [
            { attributes: { ratingIssueSubjectText: 'issue-1' } },
            { attributes: { ratingIssueSubjectText: 'issue-2' } },
          ],
          additionalIssues: [{ issue: 'issue-3' }],
        },
      },
      formContext: {
        onReviewPage: false,
        reviewMode: false,
        submitted: false,
        touched: {},
      },
      contestableIssues: {
        status: '',
      },
    }),
    subscribe: () => {},
    dispatch: () => ({
      setFormData: () => {},
    }),
  };

  it('should render ContestableIssues shared component', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <ContestableIssuesWidget />
      </Provider>,
    );
    // contestIssues.length + additionalIssues.length === 3
    expect($$('input[type="checkbox"]', container).length).to.equal(3);
    expect($('.widget-title', container).textContent).to.equal('issue-1');
  });
});
