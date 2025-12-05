import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ShowIssuesList from '../../components/ShowIssuesList';

// Already selected issues
const issues = [
  {
    attributes: {
      ratingIssueSubjectText: 'Issue 1',
      approxDecisionDate: '2021-01-01',
    },
  },
  {
    attributes: {
      ratingIssueSubjectText: 'Issue 2',
      approxDecisionDate: '2021-01-02',
    },
  },
  {
    issue: 'Issue 3',
    decisionDate: '2021-02-01',
  },
  {
    issue: 'Issue 4',
    decisionDate: '2021-02-02',
  },
];

describe('ShowIssuesList', () => {
  it('should render items', () => {
    const { container } = render(<ShowIssuesList issues={issues} />);
    const listItems = container.querySelectorAll('ul li');

    expect(listItems.length).to.eq(4);
    expect(listItems[0].textContent).to.contain('Issue 1');
    expect(listItems[0].textContent).to.contain(
      'Decision date: January 1, 2021',
    );
    expect(listItems[3].textContent).to.contain('Issue 4');
    expect(listItems[3].textContent).to.contain(
      'Decision date: February 2, 2021',
    );
    expect(
      container.querySelectorAll(
        'strong.dd-privacy-hidden[data-dd-action-name]',
      ).length,
    ).to.eq(4);
    expect(
      container.querySelectorAll('span.dd-privacy-hidden[data-dd-action-name]')
        .length,
    ).to.eq(4);
  });

  it('should not throw an error', () => {
    const { container } = render(<ShowIssuesList issues={[{}]} />);
    const list = container.querySelectorAll('ul');
    expect(list.length).to.eq(1);
  });
});
