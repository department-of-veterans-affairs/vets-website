import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { ContestableIssuesWidget } from '../../components/ContestableIssuesWidget';
import {
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../../shared/actions';
import { getRandomDate } from '../../../shared/tests/cypress.helpers';

describe('<ContestableIssuesWidget>', () => {
  const issues = [
    {
      attributes: {
        ratingIssueSubjectText: 'issue-1',
        approxDecisionDate: getRandomDate(),
      },
    },
    {
      attributes: {
        ratingIssueSubjectText: 'issue-2',
        approxDecisionDate: getRandomDate(),
      },
    },
  ];
  const additional = [{ issue: 'issue-3', decisionDate: getRandomDate() }];
  const getProps = ({
    review = false,
    submitted = false,
    onChange = () => {},
    setFormData = () => {},
    getContestableIssues = () => {},
    contestedIssues = issues,
    additionalIssues = additional,
    apiLoadStatus = '',
  } = {}) => {
    return {
      props: {
        id: 'id',
        onChange,
        formContext: {
          onReviewPage: review,
          reviewMode: review,
          submitted,
        },
        formData: { contestedIssues, additionalIssues },
        setFormData,
        getContestableIssues,
        contestableIssues: { issues: contestedIssues, status: apiLoadStatus },
      },
      mockStore: {
        getState: () => ({
          form: { data: { contestedIssues, additionalIssues } },
          formContext: {
            onReviewPage: false,
            reviewMode: false,
            submitted: false,
            touched: {},
          },
          contestableIssues: {
            status: apiLoadStatus,
          },
        }),
        subscribe: () => {},
        dispatch: () => ({
          setFormData: () => {},
          getContestableIssues,
        }),
      },
    };
  };

  it('should render ContestableIssues shared component', () => {
    const { props, mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        <ContestableIssuesWidget {...props} />
      </Provider>,
    );

    expect(container.querySelectorAll('va-checkbox')).to.have.lengthOf(3);
  });

  it('should call getContestableIssues only once, if there was a previous failure', async () => {
    const getContestableIssuesSpy = sinon.spy();
    const { props, mockStore } = getProps({
      apiLoadStatus: FETCH_CONTESTABLE_ISSUES_FAILED,
      contestedIssues: [],
      getContestableIssues: getContestableIssuesSpy,
    });
    render(
      <Provider store={mockStore}>
        <ContestableIssuesWidget {...props} value={[]} formData={{}} />
      </Provider>,
    );

    await waitFor(() => {
      expect(getContestableIssuesSpy.called).to.be.true;
    });
  });

  it('should not call getContestableIssues if api was previously successful', () => {
    const getContestableIssuesSpy = sinon.spy();
    const { props, mockStore } = getProps({
      apiLoadStatus: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
      contestedIssues: [],
      getContestableIssues: getContestableIssuesSpy,
    });
    render(
      <Provider store={mockStore}>
        <ContestableIssuesWidget {...props} value={[]} />
      </Provider>,
    );

    expect(getContestableIssuesSpy.called).to.be.false;
  });
});
