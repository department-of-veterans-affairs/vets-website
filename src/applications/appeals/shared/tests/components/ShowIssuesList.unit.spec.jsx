import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

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
  it('should render', () => {
    const wrapper = shallow(<ShowIssuesList issues={issues} />);
    const list = wrapper.find('ul');
    expect(list.length).to.eq(1);
    wrapper.unmount();
  });
  it('should render items', () => {
    const wrapper = shallow(<ShowIssuesList issues={issues} />);
    const list = wrapper.find('li');
    expect(list.length).to.eq(4);
    expect(list.first().text()).to.contain('Issue 1');
    expect(list.first().text()).to.contain('Decision date: January 1, 2021');
    expect(list.last().text()).to.contain('Issue 4');
    expect(list.last().text()).to.contain('Decision date: February 2, 2021');
    expect(
      wrapper.find('strong.dd-privacy-hidden[data-dd-action-name]').length,
    ).to.eq(4);
    expect(
      wrapper.find('span.dd-privacy-hidden[data-dd-action-name]').length,
    ).to.eq(4);
    wrapper.unmount();
  });
});
