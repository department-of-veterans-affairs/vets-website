import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import IssueSummary from '../../content/IssueSummary';
import { SELECTED } from '../../../shared/constants';
import { NO_ISSUES_SELECTED } from '../../constants';

// Already selected issues
const data = {
  contestedIssues: [
    {
      attributes: {
        ratingIssueSubjectText: 'Issue 1',
        approxDecisionDate: '2021-01-01',
      },
      [SELECTED]: true,
    },
    {
      attributes: {
        ratingIssueSubjectText: 'Issue 3',
        approxDecisionDate: '2021-03-02',
      },
      [SELECTED]: false,
    },
    {
      attributes: {
        ratingIssueSubjectText: 'Issue 2',
        approxDecisionDate: '2021-01-02',
      },
      [SELECTED]: true,
    },
  ],
  additionalIssues: [
    {
      issue: 'Issue 3',
      decisionDate: '2021-02-01',
      [SELECTED]: true,
    },
    {
      issue: 'Issue 5',
      decisionDate: '2021-03-01',
      [SELECTED]: false,
    },
    {
      issue: 'Issue 4',
      decisionDate: '2021-02-02',
      [SELECTED]: true,
    },
  ],
};

describe('IssueSummary', () => {
  it('should render', () => {
    const { container } = render(<IssueSummary formData={data} />);
    expect($('ul', container)).to.exist;
    expect($$('li', container).length).to.eq(4);
    expect($('h3', container)).to.exist;
    expect($$('h4', container).length).to.eq(4);
  });
  it('should render items', () => {
    const { container } = render(<IssueSummary formData={data} />);
    const list = $$('li', container);
    expect(list.length).to.eq(4);
    expect(list[0].textContent).to.contain('Issue 1');
    expect(list[0].textContent).to.contain('Decision date: January 1, 2021');
    expect(list[1].textContent).to.contain('Issue 2');
    expect(list[1].textContent).to.contain('Decision date: January 2, 2021');
    expect(list[2].textContent).to.contain('Issue 3');
    expect(list[2].textContent).to.contain('Decision date: February 1, 2021');
    expect(list[3].textContent).to.contain('Issue 4');
    expect(list[3].textContent).to.contain('Decision date: February 2, 2021');
    expect($$('.dd-privacy-hidden', container).length).to.eq(8);
  });
  it('should render empty issue names & dates', () => {
    const noIssuesValueData = { contestedIssues: [{ [SELECTED]: true }] };
    const { container } = render(<IssueSummary formData={noIssuesValueData} />);

    expect($('ul', container)).to.exist;
    expect($$('h4', container).length).to.eq(1);
    expect($('h4', container).textContent).to.eq('');
    expect(
      $('span[data-dd-action-name="rated issue decision date"]', container)
        .textContent,
    ).to.eq('');
  });
  it('should render no issues selected', () => {
    const noIssuesData = { contestedIssues: [], additionalIssues: [] };
    const { container } = render(<IssueSummary formData={noIssuesData} />);
    expect($('ul', container)).to.exist;
    expect($$('li', container).length).to.eq(1);
    expect($('h3', container)).to.exist;
    expect($$('h4', container).length).to.eq(0);
    expect($('strong', container).textContent).to.eq(NO_ISSUES_SELECTED);
  });
});
