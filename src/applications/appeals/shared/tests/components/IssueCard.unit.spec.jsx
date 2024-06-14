import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { IssueCardContent, IssueCard } from '../../components/IssueCard';
import { SELECTED } from '../../constants';

const getContestableIssue = (id, selected) => ({
  ratingIssueSubjectText: `issue-${id}`,
  description: 'blah',
  ratingIssuePercentNumber: id,
  approxDecisionDate: `2021-01-${id}`,
  [SELECTED]: selected,
});
const getAdditionalIssue = (id, selected) => ({
  issue: `new-issue-${id}`,
  decisionDate: `2021-02-${id}`,
  [SELECTED]: selected,
});

describe('<IssueCard>', () => {
  const getProps = ({
    showCheckbox = true,
    onChange = () => {},
    onEdit = null,
  } = {}) => ({
    id: 'id',
    index: 0,
    options: { appendId: 'z' },
    showCheckbox,
    onChange,
    onEdit,
  });

  it('should render a Contestable issue', () => {
    const props = getProps();
    const issue = getContestableIssue('10');
    const { container } = render(<IssueCard {...props} item={issue} />);
    expect($$('input[type="checkbox"]', container).length).to.equal(1);
    expect($('.widget-title', container).textContent).to.eq('issue-10');
    expect($('.widget-title.dd-privacy-hidden[data-dd-action-name]', container))
      .to.exist;
    expect($('.widget-content', container).textContent).to.contain('blah');
    expect($('.widget-content', container).textContent).to.contain(
      'Current rating: 10%',
    );
    expect($('.widget-content', container).textContent).to.contain(
      'Decision date: January 10, 2021',
    );
    expect($$('a.edit-issue-link').length).to.equal(0);
    expect($$('.dd-privacy-hidden[data-dd-action-name]').length).to.equal(4);
  });
  it('should render an Additional issue', () => {
    const props = getProps({ onEdit: () => {} });
    const issue = getAdditionalIssue('22');
    const { container } = render(<IssueCard {...props} item={issue} />);
    expect($$('input[type="checkbox"]').length).to.equal(1);
    expect($('.widget-title', container).textContent).to.eq('new-issue-22');
    expect($('.widget-content', container).textContent).to.contain(
      'Decision date: February 22, 2021',
    );
    expect($$('a.edit-issue-link').length).to.equal(1);
    expect($$('.dd-privacy-hidden[data-dd-action-name]').length).to.equal(2);
  });
  it('should render a selected issue with appendId included', () => {
    const props = getProps();
    const issue = getContestableIssue('01', true);
    const { container } = render(<IssueCard {...props} item={issue} />);
    const checkbox = $$('input[type="checkbox"]', container);
    expect(checkbox.length).to.equal(1);
    expect(checkbox[0].id).to.equal('id_0_z'); // checks appendId
    expect(checkbox[0].checked).to.be.true;
  });

  it('should render a selected additional issue without the checkbox or edit button', () => {
    const props = getProps({ showCheckbox: false });
    const issue = getAdditionalIssue('03', true);
    const { container } = render(<IssueCard {...props} item={issue} />);
    expect($$('input[type="checkbox"]', container).length).to.equal(0);
    expect($$('.edit-issue-link', container).length).to.equal(0);
  });

  it('should call onChange when the checkbox is toggled', () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });
    const issue = getContestableIssue('01', true);
    const { container } = render(<IssueCard {...props} item={issue} />);

    const input = $('input', container);
    // "Click" the option
    fireEvent.click(input, { target: { checked: true } });
    // Check that it changed
    expect(onChange.callCount).to.equal(1);
    expect(onChange.firstCall.args[1].target.checked).to.be.true;
  });
});

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
