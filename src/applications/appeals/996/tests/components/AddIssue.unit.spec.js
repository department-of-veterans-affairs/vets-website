import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { AddIssue } from '../../components/AddIssue';
import { issueErrorMessages } from '../../content/addIssue';
import { MAX_LENGTH, LAST_ISSUE } from '../../constants';
import { getDate } from '../../utils/dates';
import { $, $$ } from '../../utils/ui';

describe('<AddIssue>', () => {
  const validDate = getDate({ offset: { months: -2 } });
  const contestedIssues = [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'test',
        approxDecisionDate: validDate,
      },
    },
  ];
  const setup = ({
    index = null,
    setFormData = () => {},
    goToPath = () => {},
    data = {},
    onReviewPage = false,
  } = {}) => {
    if (index !== null) {
      window.sessionStorage.setItem(LAST_ISSUE, index);
    } else {
      window.sessionStorage.removeItem(LAST_ISSUE);
    }
    return (
      <div>
        <AddIssue
          setFormData={setFormData}
          data={data}
          goToPath={goToPath}
          onReviewPage={onReviewPage}
          testingIndex={index}
          appStateData={data}
        />
      </div>
    );
  };

  afterEach(() => {
    window.sessionStorage.removeItem(LAST_ISSUE);
  });

  it('should render', () => {
    const { container } = render(setup());
    expect($('va-text-input')).to.exist;
    expect($('va-memorable-date', container)).to.exist;
  });
  it('should prevent submission when empty', () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(setup({ goToPath: goToPathSpy }));
    fireEvent.click($('#submit', container));
    const elems = $$('va-text-input, va-memorable-date', container);

    expect(elems[0].error).to.contain(issueErrorMessages.missingIssue);
    expect(elems[1].error).to.contain(issueErrorMessages.missingDecisionDate);
    expect(elems[1].invalidMonth).to.be.true;
    expect(elems[1].invalidDay).to.be.true;
    expect(elems[1].invalidYear).to.be.true;
    expect(goToPathSpy.called).to.be.false;
  });
  it('should navigate on cancel', () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(setup({ goToPath: goToPathSpy }));
    fireEvent.click($('#cancel', container));

    expect(goToPathSpy.called).to.be.true;
  });

  it('should show error when issue name is too long', () => {
    const issue = 'abcdef '.repeat(MAX_LENGTH.ISSUE_NAME / 6);
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ issue }] },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const textInput = $('va-text-input', container);
    expect(textInput.error).to.contain(issueErrorMessages.maxLength);
  });
  it('should show error when issue date is not in range', () => {
    const decisionDate = getDate({ offset: { years: +200 } });
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ decisionDate }] },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const date = $('va-memorable-date', container);
    expect(date.error).to.contain(issueErrorMessages.pastDate);
    expect(date.invalidMonth).to.be.false;
    expect(date.invalidDay).to.be.false;
    expect(date.invalidYear).to.be.true;
  });
  it('should show an error when the issue date is > 1 year in the future', () => {
    const decisionDate = getDate({ offset: { months: +13 } });
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ decisionDate }] },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const date = $('va-memorable-date', container);
    expect(date.error).to.contain(issueErrorMessages.pastDate);
    expect(date.invalidMonth).to.be.false;
    expect(date.invalidDay).to.be.false;
    expect(date.invalidYear).to.be.true;
  });
  it('should show an error when the issue date is > 1 year in the past', () => {
    const decisionDate = getDate({ offset: { months: -13 } });
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ decisionDate }] },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const date = $('va-memorable-date', container);
    expect(date.error).to.contain(issueErrorMessages.newerDate);
    expect(date.invalidMonth).to.be.false;
    expect(date.invalidDay).to.be.false;
    expect(date.invalidYear).to.be.true;
  });

  it('should show an error when the issue is not unique', () => {
    const goToPathSpy = sinon.spy();
    const additionalIssues = [{ issue: 'test', decisionDate: validDate }];
    const { container } = render(
      setup({
        goToPath: goToPathSpy,
        data: { contestedIssues, additionalIssues },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const textInput = $('va-text-input', container);
    expect(textInput.error).to.contain(issueErrorMessages.uniqueIssue);
  });

  it('should submit when everything is valid', () => {
    const goToPathSpy = sinon.spy();
    const additionalIssues = [
      { issue: 'test', decisionDate: getDate({ offset: { months: -3 } }) },
    ];
    const { container } = render(
      setup({
        goToPath: goToPathSpy,
        data: { contestedIssues, additionalIssues },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    expect($('va-text-input', container).error).to.be.null;
    expect($('va-memorable-date', container).error).to.be.null;
    expect(goToPathSpy.called).to.be.true;
  });
});
