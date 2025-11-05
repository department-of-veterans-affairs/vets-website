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
    testChange,
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
      testChange,
      contestableIssues: { issues: loadedIssues || issues },
      apiLoadStatus,
      value: [],
    };
  };

  it('should render a list of check boxes (IssueCard component)', () => {
    const props = getProps();
    const { container } = render(<ContestableIssues {...props} />);

    expect($$('va-checkbox', container).length).to.equal(
      props.formData.contestedIssues.length +
        props.formData.additionalIssues.length,
    );
    expect(container.querySelectorAll('[label="issue-1"]')).to.have.lengthOf(1);
  });
  it('should render edit link & remove button', () => {
    const props = getProps();
    const { container } = render(<ContestableIssues {...props} />);
    const addLength = props.formData.additionalIssues.length;
    const link = $$('.edit-issue-link', container);
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
    const testChange = sinon.spy();
    const props = getProps({ testChange });
    const { container } = render(<ContestableIssues {...props} />);

    $$('.widget-checkbox-wrap', container).forEach(async (element, index) => {
      testChange.reset();

      const checkbox = $('va-checkbox', element);
      // "Click" the option
      await fireEvent.click(checkbox);

      // Check that it changed
      expect(testChange.callCount).to.equal(1);
      expect(testChange.firstCall.args[0]).to.eq(index);
      expect(testChange.firstCall.args[1].target.checked).to.be.true;

      // "Click" to uncheck the option
      await fireEvent.click(checkbox);

      // Check that it changed back
      expect(testChange.callCount).to.equal(2);
      expect(testChange.secondCall.args[0]).to.eq(index);
      expect(testChange.secondCall.args[1].target.checked).to.be.false;
    });
  });

  it('should call set form data when an api loaded checkbox is toggled', async () => {
    const setFormDataSpy = sinon.spy();
    const props = getProps({ setFormData: setFormDataSpy, testChange: null });
    const { container } = render(<ContestableIssues {...props} />);

    $$('.widget-checkbox-wrap', container).forEach(async element => {
      const checkbox = $('va-checkbox', element);

      // "Click" the option
      await fireEvent.click(checkbox);

      // Check that it changed in the form data
      expect(setFormDataSpy.called).to.be.true;
      expect(setFormDataSpy.args[0][0].contestedIssues[0]).to.deep.equal({
        ...props.formData.contestedIssues[0],
        [SELECTED]: true,
      });
    });
  });

  it('should call set form data when an additional issue checkbox is toggled', () => {
    const setFormDataSpy = sinon.spy();
    const props = getProps({
      loadedIssues: [],
      setFormData: setFormDataSpy,
      testChange: null,
    });
    const { container } = render(<ContestableIssues {...props} />);

    $$('.widget-checkbox-wrap', container).forEach(async element => {
      const checkbox = $('input', element);

      // "Click" the option
      fireEvent.click(checkbox);

      // Check that it changed in the form data
      expect(setFormDataSpy.called).to.be.true;
      expect(setFormDataSpy.args[0][0].additionalIssues[0]).to.deep.equal({
        ...props.formData.additionalIssues[0],
        [SELECTED]: true,
      });
    });
  });

  it('should show max selection error modal', async () => {
    const props = getProps({
      loadedIssues: new Array(100).fill({ [SELECTED]: true }),
    });

    const { container } = render(<ContestableIssues {...props} />);

    $$('.widget-checkbox-wrap', container).forEach(async element => {
      const lastCheckbox = $$('input', element).slice(-1)[0];

      // Click last checkbox
      await fireEvent.click(lastCheckbox);

      const errorModal = $('va-modal[visible]', container);
      expect(errorModal).to.exist;

      errorModal.__events.closeEvent();
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
    expect(
      $$('va-alert:not(#blocked-issues-alert)', container).length,
    ).to.equal(1);
    const alert = $('va-alert', container);
    expect(alert.innerHTML).to.contain(
      'at least 1 issue before you can continue',
    );
    await waitFor(() => {
      expect(document.activeElement).to.equal($('h3', alert));
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
      expect(document.activeElement).to.equal($('va-alert h4', container));
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
      additionalIssues: [],
    });
    const { container } = render(
      <ContestableIssues {...props} contestedIssues={[]} />,
    );

    expect(
      $$('va-alert:not(#blocked-issues-alert)', container).length,
    ).to.equal(1);
    expect($('va-alert', container).innerHTML).to.contain(
      'We can’t load your issues right now',
    );
  });

  it('should show "no loaded issues" alert when none loaded', async () => {
    const props = getProps({ loadedIssues: [], additionalIssues: [] });
    const { container } = render(
      <ContestableIssues {...props} formData={{}} />,
    );
    expect(
      $$('va-alert:not(#blocked-issues-alert)', container).length,
    ).to.equal(1);
    expect($('va-alert', container).innerHTML).to.contain(
      'we couldn’t find any eligible issues',
    );
  });

  it('should not show an alert when api fails but there are existing additional issues', async () => {
    const props = getProps({
      apiLoadStatus: FETCH_CONTESTABLE_ISSUES_FAILED,
      loadedIssues: [],
    });
    const { container } = render(
      <ContestableIssues {...props} contestedIssues={[]} />,
    );

    expect(
      $$('va-alert:not(#blocked-issues-alert)', container).length,
    ).to.equal(0);
  });

  it('should not show an alert when api is successful, and after adding an additional issues', async () => {
    const props = getProps({
      apiLoadStatus: FETCH_CONTESTABLE_ISSUES_FAILED,
      loadedIssues: [],
    });
    const { container } = render(
      <ContestableIssues {...props} contestedIssues={[]} />,
    );

    expect(
      $$('va-alert:not(#blocked-issues-alert)', container).length,
    ).to.equal(0);
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
      expect($$('va-alert:not(#blocked-issues-alert)', container).length).to.eq(
        0,
      );
    });
  });

  it('should not throw a JS error when no list is passed in', () => {
    const props = getProps({ review: true, loadedIssues: [] });

    const { container } = render(
      <ContestableIssues {...props} formData={{}} />,
    );
    expect($$('input[type="checkbox"]', container).length).to.equal(0);
  });

  describe('blocked issues functionality', () => {
    it('should display blocked message when issues have today decision dates', () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      const issuesWithToday = [
        {
          attributes: {
            ratingIssueSubjectText: 'Back Pain',
            approxDecisionDate: todayString,
          },
        },
        {
          attributes: {
            ratingIssueSubjectText: 'Knee Injury',
            approxDecisionDate: '2023-06-15',
          },
        },
      ];

      const props = getProps({ loadedIssues: issuesWithToday });
      const { container } = render(<ContestableIssues {...props} />);

      const blockedAlert = $('#blocked-issues-alert', container);
      expect(blockedAlert).to.exist;
      expect(blockedAlert.textContent).to.include(
        "Your back pain issue isn't available",
      );
    });

    it('should display blocked message for multiple blocked issues with correct plural grammar', () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      const multipleBlockedIssues = [
        {
          attributes: {
            ratingIssueSubjectText: 'Back Pain',
            approxDecisionDate: todayString,
          },
        },
        {
          attributes: {
            ratingIssueSubjectText: 'Knee Injury',
            approxDecisionDate: todayString,
          },
        },
      ];

      const props = getProps({ loadedIssues: multipleBlockedIssues });
      const { container } = render(<ContestableIssues {...props} />);

      const blockedAlert = $('#blocked-issues-alert', container);
      expect(blockedAlert).to.exist;
      expect(blockedAlert.textContent).to.include(
        "Your back pain and knee injury issues aren't available",
      );
    });

    it('should not display blocked message when no issues are blocked', () => {
      const pastIssues = [
        {
          attributes: {
            ratingIssueSubjectText: 'Back Pain',
            approxDecisionDate: '2023-06-15',
          },
        },
        {
          attributes: {
            ratingIssueSubjectText: 'Knee Injury',
            approxDecisionDate: '2023-08-20',
          },
        },
      ];

      const props = getProps({ loadedIssues: pastIssues });
      const { container } = render(<ContestableIssues {...props} />);

      const blockedAlert = $('#blocked-issues-alert', container);
      expect(blockedAlert).to.exist;
      expect(blockedAlert.getAttribute('visible')).to.equal('false');
    });

    it('should display separator between blocked and non-blocked issues', () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      const mixedIssues = [
        {
          attributes: {
            ratingIssueSubjectText: 'Blocked Issue',
            approxDecisionDate: todayString,
          },
        },
        {
          attributes: {
            ratingIssueSubjectText: 'Available Issue',
            approxDecisionDate: '2023-06-15',
          },
        },
      ];

      const props = getProps({ loadedIssues: mixedIssues });
      const { container } = render(<ContestableIssues {...props} />);

      // Check that visual separation exists between blocked and non-blocked issues
      const elementsWithSeparator = container.querySelectorAll(
        '[class*="vads-u-border-top--1px"][class*="vads-u-border-color--gray-light"]',
      );
      expect(elementsWithSeparator.length).to.equal(2);
    });
  });
});
