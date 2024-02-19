import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { ContestableIssues } from '../../components/ContestableIssues';
import { FETCH_CONTESTABLE_ISSUES_FAILED } from '../../actions';

import { SELECTED } from '../../constants';
import { getRandomDate } from '../cypress.helpers';

describe('<ContestableIssues>', () => {
  const getProps = ({
    review = false,
    submitted = false,
    setFormData = () => {},
    loadedIssues,
    additionalIssues,
    additionalIssueChecked = false,
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
      formContext: {
        onReviewPage: review,
        reviewMode: review,
        submitted,
      },
      formData: {
        contestedIssues: loadedIssues || issues,
        additionalIssues: additionalIssues || [
          {
            issue: 'issue-3',
            decisionDate: getRandomDate(),
            [SELECTED]: additionalIssueChecked,
          },
        ],
      },
      setFormData,
      contestableIssues: { issues },
      showPart3: true,
      apiLoadStatus,
      value: [],
    };
  };

  it('should render a list of check boxes (IssueCard component)', () => {
    const props = getProps();

    const { container } = render(<ContestableIssues {...props} />);
    expect($$('input[type="checkbox"]', container).length).to.equal(
      props.formData.contestedIssues.length +
        props.formData.additionalIssues.length,
    );
    expect($('.widget-title', container).textContent).to.equal('issue-1');
  });
  it('should render edit link & remove button', () => {
    const props = getProps();
    const { container } = render(<ContestableIssues {...props} />);
    const addLength = props.formData.additionalIssues.length;
    const link = $$('a.edit-issue-link', container);
    expect(link.length).to.equal(addLength);
    expect($$('va-button').length).to.equal(
      props.formData.additionalIssues.length,
    );
  });

  it('should not wrap the checkboxes in a fieldset', () => {
    const props = getProps();
    const { container } = render(<ContestableIssues {...props} />);
    expect($$('fieldset', container).length).to.equal(1);
  });

  it('should call onChange when the checkbox is toggled', () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });
    const { container } = render(<ContestableIssues {...props} />);
    $$('.form-checkbox', container).forEach((element, index) => {
      onChange.reset();

      const checkbox = $('input', container);
      // "Click" the option
      fireEvent.click(checkbox);

      // Check that it changed
      expect(onChange.callCount).to.equal(1);
      expect(onChange.firstCall.args[0][index]).to.eql({
        ...props.formData.contestedIssues[index],
        [SELECTED]: true,
      });

      // "Click" the option
      fireEvent.click(checkbox);

      // Check that it changed back
      expect(onChange.callCount).to.equal(2);
      expect(onChange.secondCall.args[0][index]).to.eql({
        ...props.formData.contestedIssues[index],
        [SELECTED]: false,
      });
    });
  });
  it('should not show an error on submission with one selection', () => {
    const props = getProps({ submitted: true, additionalIssueChecked: true });
    const { container } = render(<ContestableIssues {...props} />);
    expect($$('.usa-input-error', container).length).to.equal(0);
  });

  it('should show an error when submitted with no selections', async () => {
    const props = getProps({ submitted: true });
    const { container } = render(<ContestableIssues {...props} />);
    expect($$('va-alert', container).length).to.equal(1);
    const alert = $('va-alert', container);
    expect(alert.innerHTML).to.contain(
      'at least 1 issue before you can continue',
    );
    await waitFor(() => {
      expect(document.activeElement).to.equal(alert);
    });
  });

  it('should focus to error alert when submitted with no selections', async () => {
    const props = getProps();
    const { container, rerender } = render(
      <>
        <va-button type="button">foo</va-button>
        <ContestableIssues
          {...props}
          formContext={{
            onReviewPage: true,
            reviewMode: false,
            submitted: false,
          }}
        />
      </>,
    );

    // focus on button to test that the focus is shifted to the alert after
    // the page is submitted
    $('va-button', container).focus();

    rerender(
      <>
        <va-button type="button">foo</va-button>
        <ContestableIssues
          {...props}
          formContext={{
            onReviewPage: true,
            reviewMode: false,
            submitted: true, // submitting the page
          }}
        />
      </>,
    );

    await waitFor(() => {
      expect(document.activeElement).to.equal($('va-alert', container));
    });
  });

  it('should show a message when no issues selected on review page', () => {
    const props = getProps({ review: true });
    const { container } = render(<ContestableIssues {...props} />);
    expect($('va-alert', container).innerHTML).to.contain(
      'at least 1 issue before you can continue',
    );
  });

  it('should remove additional item after confirming in modal', async () => {
    const setFormDataSpy = sinon.spy();
    const props = getProps({ setFormData: setFormDataSpy });
    const { container } = render(<ContestableIssues {...props} />);

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
    const { container } = render(<ContestableIssues {...props} />);

    const removeButton = $$('.remove-issue', container);
    expect(removeButton.length).to.equal(1);
    fireEvent.click(removeButton[0]);

    const modal = $('va-modal', container);
    await modal.__events.secondaryButtonClick(); // Remove entry

    await waitFor(() => {
      expect(setFormDataSpy.called).to.be.false;
    });
  });

  it('should show "cant load your issues right now" alert when api fails', async () => {
    const props = getProps({
      apiLoadStatus: FETCH_CONTESTABLE_ISSUES_FAILED,
      loadedIssues: [],
    });
    const { container } = render(
      <ContestableIssues {...props} contestedIssues={[]} />,
    );

    expect($$('va-alert', container).length).to.equal(1);
    expect($('va-alert', container).innerHTML).to.contain(
      'We can’t load your issues right now',
    );
  });

  it('should show "no loaded issues" alert when none loaded', async () => {
    const props = getProps({ loadedIssues: [] });
    const { container } = render(<ContestableIssues {...props} />);
    expect($$('va-alert', container).length).to.equal(1);
    expect($('va-alert', container).innerHTML).to.contain(
      'we couldn’t find any eligible issues',
    );
  });

  it('should not show an alert if no issues are loaded, and after all additional issues are removed', async () => {
    const props = getProps({
      loadedIssues: [],
      additionalIssueChecked: false,
      submitted: true,
    });
    const { container, rerender } = render(<ContestableIssues {...props} />);

    const newProps = getProps({
      loadedIssues: [],
      additionalIssueChecked: true,
      submitted: true,
    });
    rerender(<ContestableIssues {...newProps} />);

    await waitFor(() => {
      expect($$('va-alert', container).length).to.eq(0);
    });
  });

  it('should not throw a JS error when no list is passed in', () => {
    const props = getProps({ review: true, loadedIssues: [] });

    const { container } = render(
      <ContestableIssues {...props} formData={{}} />,
    );
    expect($$('input[type="checkbox"]', container).length).to.equal(0);
  });
});
