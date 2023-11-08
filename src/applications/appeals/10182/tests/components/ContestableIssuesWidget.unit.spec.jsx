import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { ContestableIssuesWidget } from '../../components/ContestableIssuesWidget';
import {
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../actions';

import { SELECTED } from '../../../shared/constants';
import { getRandomDate } from '../../../shared/tests/cypress.helpers';

describe('<ContestableIssuesWidget>', () => {
  const getProps = ({
    review = false,
    submitted = false,
    onChange = () => {},
    setFormData = () => {},
    getContestableIssues = () => {},
    apiLoadStatus = '',
  } = {}) => {
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
    return {
      id: 'id',
      value: issues,
      additionalIssues: [{ issue: 'issue-3', decisionDate: getRandomDate() }],
      onChange,
      formContext: {
        onReviewPage: review,
        reviewMode: review,
        submitted,
      },
      formData: { contestedIssues: issues },
      setFormData,
      getContestableIssues,
      contestableIssues: { issues },
      showPart3: true,
      apiLoadStatus,
    };
  };

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

  it('should not wrap the checkboxes in a fieldset', () => {
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
    await modal.__events.secondaryButtonClick(); // Remove entry

    await waitFor(() => {
      expect(setFormDataSpy.called).to.be.false;
    });
  });

  it('should show "no loaded issues" alert when api fails', async () => {
    const props = getProps({ apiLoadStatus: FETCH_CONTESTABLE_ISSUES_FAILED });
    const { container } = render(
      <ContestableIssuesWidget {...props} additionalIssues={[]} value={[]} />,
    );

    expect($$('va-alert', container).length).to.equal(1);
    expect($('va-alert', container).innerHTML).to.contain(
      'We can’t load your issues right now',
    );
  });

  it('should not show an alert if no issues are loaded, and after all additional issues are removed', async () => {
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

  it('should call getContestableIssues only once, if there was a previous failure', async () => {
    const getContestableIssuesSpy = sinon.spy();
    const props = getProps({
      apiLoadStatus: FETCH_CONTESTABLE_ISSUES_FAILED,
      getContestableIssues: getContestableIssuesSpy,
    });
    render(<ContestableIssuesWidget {...props} value={[]} />);

    await waitFor(() => {
      expect(getContestableIssuesSpy.called).to.be.true;
    });
  });

  it('should not call getContestableIssues if api was previously successful', () => {
    const getContestableIssuesSpy = sinon.spy();
    const props = getProps({
      apiLoadStatus: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
      getContestableIssues: getContestableIssuesSpy,
    });
    render(<ContestableIssuesWidget {...props} value={[]} />);

    expect(getContestableIssuesSpy.called).to.be.false;
  });
});
