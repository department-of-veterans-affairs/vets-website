import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
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

  it('should render edit link & remove button', () => {
    const props = getProps();
    const { container } = render(<ContestableIssuesWidget {...props} />);
    const addLength = props.additionalIssues.length;
    const link = $$('a.edit-issue-link', container);
    expect(link.length).to.equal(addLength);
    expect($$('va-button').length).to.equal(props.additionalIssues.length);
  });

  it('should wrap the checkboxes in a fieldset', () => {
    const props = getProps();
    const { container } = render(<ContestableIssuesWidget {...props} />);
    expect($$('fieldset', container).length).to.equal(1);
  });

  it('should call onChange when the checkbox is toggled', () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });
    const { container } = render(<ContestableIssuesWidget {...props} />);
    $$('.form-checkbox', container).forEach((element, index) => {
      onChange.reset();

      const checkbox = $('input', container);
      // "Click" the option
      fireEvent.click(checkbox);

      // Check that it changed
      expect(onChange.callCount).to.equal(1);
      expect(onChange.firstCall.args[0][index]).to.eql({
        ...props.value[index],
        [SELECTED]: true,
      });

      // "Click" the option
      fireEvent.click(checkbox);

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
    expect($$('va-alert', container).length).to.equal(1);
    expect($('va-alert', container).innerHTML).to.contain(
      'at least 1 issue before you can continue',
    );
  });
  it('should show a message when no issues selected on review page', () => {
    const props = getProps({ review: true });
    const { container } = render(<ContestableIssuesWidget {...props} />);
    expect($('va-alert', container).innerHTML).to.contain(
      'at least 1 issue before you can continue',
    );
  });

  it('should remove additional item after confirming in modal', async () => {
    const setFormDataSpy = sinon.spy();
    const props = getProps({ setFormData: setFormDataSpy });
    const { container } = render(<ContestableIssuesWidget {...props} />);

    const removeButton = $$('.remove-issue', container);
    expect(removeButton.length).to.equal(1);
    fireEvent.click(removeButton[0]);

    const modal = $('va-modal', container);
    modal.__events.primaryButtonClick(); // Remove entry

    await waitFor(() => {
      expect(setFormDataSpy.called).to.be.true;
      expect(setFormDataSpy.args[0][0].additionalIssues.length).to.equal(0);
    });
  });
  it('should not remove additional item after choosing No in the modal', async () => {
    const setFormDataSpy = sinon.spy();
    const props = getProps({ setFormData: setFormDataSpy });
    const { container } = render(<ContestableIssuesWidget {...props} />);

    const removeButton = $$('.remove-issue', container);
    expect(removeButton.length).to.equal(1);
    fireEvent.click(removeButton[0]);

    const modal = $('va-modal', container);
    modal.__events.secondaryButtonClick(); // Remove entry

    await waitFor(() => {
      expect(setFormDataSpy.called).to.be.false;
    });
  });

  it('should not show no loaded issues alert after remove all additional items', async () => {
    const props = getProps();
    const { container } = render(
      <ContestableIssuesWidget {...props} additionalIssues={[]} value={[]} />,
    );

    expect($$('va-alert', container).length).to.equal(1);
    expect($('va-alert', container).innerHTML).to.contain(
      'Sorry, we couldn’t find any eligible issues',
    );
  });

  it('should not show no loaded issues alert after remove all additional items', async () => {
    const props = getProps();
    const { container, rerender } = render(
      <ContestableIssuesWidget {...props} value={[]} />,
    );

    rerender(
      <ContestableIssuesWidget {...props} additionalIssues={[]} value={[]} />,
    );
    await waitFor(() => {
      expect($$('va-alert', container).length).to.equal(0);
    });
  });
});
