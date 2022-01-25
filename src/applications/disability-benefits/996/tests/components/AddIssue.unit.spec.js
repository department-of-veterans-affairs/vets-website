import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import { AddIssue } from '../../components/AddIssue';
import { issueErrorMessages } from '../../content/addIssue';
import { MAX_ISSUE_NAME_LENGTH, LAST_HLR_ITEM } from '../../constants';
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
    const textInput = $('input[name="add-hlr-issue"]', container);
    expect(textInput).to.exist;
    expect($('.usa-datefields', container)).to.exist;
  });
  it('should prevent submission when empty', () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(setup({ goToPath: goToPathSpy }));
    $('button#submit', container).click();
    const errors = $$('.usa-input-error-message', container);

    expect(errors[0].textContent).to.contain(issueErrorMessages.missingIssue);
    expect(errors[1].textContent).to.contain(
      issueErrorMessages.missingDecisionDate,
    );
    expect(goToPathSpy.called).to.be.false;
  });
  it('should navigate on cancel', () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(setup({ goToPath: goToPathSpy }));
    $('button#cancel', container).click();

    expect(goToPathSpy.called).to.be.true;
  });

  it('should show error when issue name is too long', () => {
    const issue = 'abcdef '.repeat(MAX_ISSUE_NAME_LENGTH / 6);
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ issue }] },
        index: 1,
      }),
    );
    $('button#submit', container).click();

    const error = $('.usa-input-error-message', container);
    expect(error.textContent).to.contain(issueErrorMessages.maxLength);
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

    const error = $('fieldset[id] .usa-input-error-message', container);
    expect(error.textContent).to.contain(
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

    const error = $('fieldset[id] .usa-input-error-message', container);
    expect(error.textContent).to.contain(issueErrorMessages.pastDate);
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

    const error = $('fieldset[id] .usa-input-error-message', container);
    expect(error.textContent).to.contain(issueErrorMessages.newerDate);
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

    const error = $('.usa-input-error-message', container);
    expect(error.textContent).to.contain(issueErrorMessages.uniqueIssue);
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

    expect($('.usa-input-error-message', container)).to.not.exist;
    expect(goToPathSpy.called).to.be.true;
  });
});
