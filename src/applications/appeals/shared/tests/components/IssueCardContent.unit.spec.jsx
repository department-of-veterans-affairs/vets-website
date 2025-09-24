import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { IssueCardContent } from '../../components/IssueCardContent';
import { getAdditionalIssue, getContestableIssue } from '../test-utils';

describe('<IssueCardContent>', () => {
  it('should render an error message for empty date', () => {
    const { container } = render(<IssueCardContent />);
    expect($('.widget-content-wrap', container).textContent).to.equal(
      'Decision date: Invalid decision date',
    );
  });

  it('should render Contestable issue content', () => {
    const issue = getContestableIssue('20');
    const { container } = render(<IssueCardContent {...issue} />);
    expect($('.widget-content-wrap', container).textContent).to.contain('blah');
    expect($('.widget-content-wrap', container).textContent).to.contain(
      'Current rating: 20%',
    );
    expect($('.widget-content-wrap', container).textContent).to.contain(
      'Decision date: January 20, 2021',
    );
    expect($$('a.edit-issue-link').length).to.equal(0);
    expect($$('.dd-privacy-hidden[data-dd-action-name]').length).to.equal(3);
  });

  it('should render AdditionalIssue content', () => {
    const issue = getAdditionalIssue('21');
    const { container } = render(<IssueCardContent {...issue} />);
    expect($('.widget-content-wrap', container).textContent).to.contain(
      'Decision date: February 21, 2021',
    );
    expect($$('.dd-privacy-hidden[data-dd-action-name]').length).to.equal(1);
  });
});
