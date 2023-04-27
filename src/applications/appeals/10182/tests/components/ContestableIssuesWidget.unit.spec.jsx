import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { ContestableIssuesWidget } from '../../components/ContestableIssuesWidget';
import { SELECTED } from '../../constants';

describe('<ContestableIssuesWidget>', () => {
  const getProps = ({
    review = false,
    submitted = false,
    onChange = () => {},
    setFormData = () => {},
  } = {}) => ({
    id: 'id',
    value: [
      { attributes: { ratingIssueSubjectText: 'issue-1' } },
      { attributes: { ratingIssueSubjectText: 'issue-2' } },
    ],
    additionalIssues: [{ issue: 'issue-3' }],
    onChange,
    formContext: {
      onReviewPage: review,
      reviewMode: review,
      submitted,
    },
    setFormData,
  });

  it('should render a list of check boxes (IssueCard component)', () => {
    const props = getProps();
    const { container } = render(<ContestableIssuesWidget {...props} />);
    expect($$('input[type="checkbox"]', container).length).to.equal(
      props.value.length + props.additionalIssues.length,
    );
    expect($('.widget-title', container).textContent).to.equal('issue-1');
  });
  it('should render change link & remove button', () => {
    const props = getProps();
    const addLength = props.additionalIssues.length;
    const { container } = render(<ContestableIssuesWidget {...props} />);
    expect($$('a.change-issue-link', container).length).to.equal(addLength);
    expect($$('.remove-issue', container).length).to.equal(addLength);
  });

  it('should not wrap the checkboxes in a fieldset', () => {
    const props = getProps();
    const { container } = render(<ContestableIssuesWidget {...props} />);
    expect($$('fieldset', container).length).to.equal(0);
  });

  it('should call onChange when the checkbox is toggled', () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });
    const { container } = render(<ContestableIssuesWidget {...props} />);
    $$('.form-checkbox', container).forEach((element, index) => {
      onChange.reset();

      // "Click" the option
      fireEvent.change($('input', element), { target: { checked: true } });

      // Check that it changed
      expect(onChange.callCount).to.equal(1);
      expect(onChange.firstCall.args[0][index]).to.eql({
        ...props.value[index],
        [SELECTED]: true,
      });

      // "Click" the option
      fireEvent.change($('input', element), { target: { checked: false } });

      // Check that it changed back
      expect(onChange.callCount).to.equal(2);
      expect(onChange.secondCall.args[0][index]).to.eql({
        ...props.value[index],
        [SELECTED]: false,
      });
    });
  });
  it('should not show an error on submission with one selection', () => {
    const props = getProps({ submitted: true });
    const issues = [{ [SELECTED]: true }];
    const { container } = render(
      <ContestableIssuesWidget {...props} additionalIssues={issues} />,
    );
    expect($$('.usa-input-error', container).length).to.equal(0);
  });

  it('should show an error when submitted with no selections', () => {
    const props = getProps({ submitted: true });
    const { container } = render(<ContestableIssuesWidget {...props} />);
    expect($$('va-alert h3', container).length).to.equal(1);
  });
  it('should show a message when no issues selected on review page', () => {
    const props = getProps({ review: true });
    const { container } = render(<ContestableIssuesWidget {...props} />);
    expect($('dt', container).textContent).to.contain(
      'at least one issue, so we can process your request',
    );
  });
  it('should remove additional item', () => {
    const setFormData = sinon.spy();
    const props = getProps({ setFormData });
    const { container } = render(<ContestableIssuesWidget {...props} />);

    expect(props.additionalIssues.length).to.equal(1);

    fireEvent.click($('va-button.remove-issue', container));

    expect(setFormData.called).to.be.true;
    expect(setFormData.args[0][0].additionalIssues.length).to.equal(0);
  });
});
