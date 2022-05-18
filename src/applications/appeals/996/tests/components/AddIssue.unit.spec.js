import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import { AddIssue } from '../../components/AddIssue';
import { issueErrorMessages } from '../../content/addIssue';
import { MAX_LENGTH, LAST_HLR_ITEM } from '../../constants';
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
      window.sessionStorage.setItem(LAST_HLR_ITEM, index);
    } else {
      window.sessionStorage.removeItem(LAST_HLR_ITEM);
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
    window.sessionStorage.removeItem(LAST_HLR_ITEM);
  });

  it('should render', () => {
    const { container } = render(setup());
    expect($('va-text-input')).to.exist;
    expect($('va-date', container)).to.exist;
  });
  it('should prevent submission when empty', () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(setup({ goToPath: goToPathSpy }));
    $('button#submit', container).click();
    const elems = $$('va-text-input, va-date', container);

    expect(elems[0].error).to.contain(issueErrorMessages.missingIssue);
    // expect(elems[1].error).to.contain(issueErrorMessages.missingDecisionDate);
    // Returning invalidDate until va-date web component is updated
    expect(elems[1].error).to.contain(issueErrorMessages.invalidDate);
    expect(goToPathSpy.called).to.be.false;
  });
  it('should navigate on cancel', () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(setup({ goToPath: goToPathSpy }));
    $('button#cancel', container).click();

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
    $('button#submit', container).click();

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
    $('button#submit', container).click();

    const date = $('va-date', container);
    expect(date.error).to.contain(
      // partial match
      issueErrorMessages.invalidDateRange('xxxx', '').split('xxxx')[0],
    );
  });
  it('should show an error when the issue date is > 1 year in the future', () => {
    const decisionDate = getDate({ offset: { months: +13 } });
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ decisionDate }] },
        index: 1,
      }),
    );
    $('button#submit', container).click();

    const date = $('va-date', container);
    expect(date.error).to.contain(issueErrorMessages.pastDate);
  });
  it('should show an error when the issue date is > 1 year in the past', () => {
    const decisionDate = getDate({ offset: { months: -13 } });
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ decisionDate }] },
        index: 1,
      }),
    );
    $('button#submit', container).click();

    const date = $('va-date', container);
    expect(date.error).to.contain(issueErrorMessages.newerDate);
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
    $('button#submit', container).click();

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
    $('button#submit', container).click();

    expect($('va-text-input', container).error).to.be.null;
    expect($('va-date', container).error).to.be.null;
    expect(goToPathSpy.called).to.be.true;
  });
});
