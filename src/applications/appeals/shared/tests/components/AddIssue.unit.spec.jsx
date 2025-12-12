import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import AddIssue from '../../components/AddIssue';
import { parseDateWithOffset } from '../../utils/dates';

import {
  CONTESTABLE_ISSUES_PATH,
  REVIEW_AND_SUBMIT,
  REVIEW_ISSUES,
  LAST_ISSUE,
  MAX_LENGTH,
  MAX_YEARS_PAST,
} from '../../constants';
import errorMessages from '../../content/errorMessages';

import { maxNameLength } from '../../../995/validations/issues';
import { validateDate } from '../../../995/validations/date';

describe('<AddIssue>', () => {
  const validDate = parseDateWithOffset({ months: -2 });
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
    description = null,
    validations = { maxNameLength, validateDate },
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
          validations={validations}
          description={description}
        />
      </div>
    );
  };

  afterEach(() => {
    window.sessionStorage.removeItem(LAST_ISSUE);
  });

  it('should render', () => {
    const { container } = render(setup());
    expect($('h3', container)).to.exist;
    expect($('va-text-input', container)).to.exist;
    expect($('va-memorable-date', container)).to.exist;
  });
  it('should render with no data', () => {
    const { container } = render(setup({ data: undefined }));
    expect($('h3', container)).to.exist;
    expect($('va-text-input', container)).to.exist;
    expect($('va-memorable-date', container)).to.exist;
  });
  it('should render description', () => {
    const page = setup({ description: <span id="test-span" /> });
    const { container } = render(page);
    expect($('h3', container)).to.exist;
    expect($('#test-span', container)).to.exist;
  });

  it('should submit when valid', () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(
      setup({
        goToPath: goToPathSpy,
        data: {
          additionalIssues: [{}, { issue: 'abcd', decisionDate: validDate }],
        },
        index: 1,
      }),
    );
    fireEvent.submit($('form', container));
    fireEvent.click($('#submit', container));
    expect(goToPathSpy.called).to.be.true;
  });

  it('should prevent submission when empty', () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(setup({ goToPath: goToPathSpy }));
    fireEvent.click($('#submit', container));
    const elems = $$('va-text-input, va-memorable-date', container);

    expect(elems[0].error).to.contain(errorMessages.missingIssue);
    expect(elems[1].error).to.contain(errorMessages.decisions.blankDate);
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
    expect(textInput.error).to.contain(
      errorMessages.maxLength(MAX_LENGTH.ISSUE_NAME),
    );
  });
  it('should show error when issue name is all whitespace', () => {
    const issue = '       ';
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ issue }] },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const textInput = $('va-text-input', container);
    expect(textInput.error).to.contain(errorMessages.missingIssue);
  });

  it('should show error when issue date is not in range', () => {
    const decisionDate = parseDateWithOffset({ years: MAX_YEARS_PAST * 2 });
    const { container } = render(
      setup({
        data: {
          contestedIssues,
          additionalIssues: [{ issue: 'abcd', decisionDate }],
        },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const date = $('va-memorable-date', container);
    expect(date.error).to.match(
      /The date must be before [A-Za-z]+\.? \d+, \d{4}\./,
    );
    expect(date.invalidMonth).to.be.false;
    expect(date.invalidDay).to.be.false;
    expect(date.invalidYear).to.be.true;
  });
  it('should show an error when the issue date is > 1 year in the future', () => {
    const decisionDate = parseDateWithOffset({ months: 13 });
    const { container } = render(
      setup({
        data: {
          contestedIssues,
          additionalIssues: [{ issue: 'abcd', decisionDate }],
        },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const date = $('va-memorable-date', container);
    expect(date.error).to.match(
      /The date must be before [A-Za-z]+\.? \d+, \d{4}\./,
    );
    expect(date.invalidMonth).to.be.false;
    expect(date.invalidDay).to.be.false;
    expect(date.invalidYear).to.be.true;
  });
  it('should show an error when the issue date is > 100 years in the past', () => {
    const decisionDate = parseDateWithOffset({ years: -(MAX_YEARS_PAST + 1) });
    const { container } = render(
      setup({
        data: { contestedIssues, additionalIssues: [{ decisionDate }] },
        index: 1,
      }),
    );
    fireEvent.click($('#submit', container));

    const date = $('va-memorable-date', container);
    expect(date.error).to.contain(errorMessages.decisions.newerDate);
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
    expect(textInput.error).to.contain(errorMessages.uniqueIssue);
  });

  it('should submit when everything is valid', () => {
    const goToPathSpy = sinon.spy();
    const additionalIssues = [
      {
        issue: 'test',
        decisionDate: parseDateWithOffset({ months: -3 }),
      },
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
    expect(goToPathSpy.calledWith(`/${CONTESTABLE_ISSUES_PATH}`)).to.be.true;
  });
  it('should submit when everything is valid', () => {
    window.sessionStorage.setItem(REVIEW_ISSUES, 'true');
    const goToPathSpy = sinon.spy();
    const additionalIssues = [
      {
        issue: 'test',
        decisionDate: parseDateWithOffset({ months: -3 }),
      },
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
    expect(goToPathSpy.calledWith(REVIEW_AND_SUBMIT)).to.be.true;
    window.sessionStorage.removeItem(REVIEW_ISSUES);
  });

  describe('handlers', () => {
    it('should call onIssueNameChange', async () => {
      const setDataSpy = sinon.spy();
      const additionalIssues = [
        {
          issue: '',
          decisionDate: parseDateWithOffset({ months: -3 }),
        },
      ];
      const { container } = render(
        setup({
          setFormData: setDataSpy,
          data: { contestedIssues, additionalIssues },
          index: 1,
        }),
      );

      const input = $('#issue-name', container);
      input.value = 'name';
      await fireEvent.input(input, { target: { name: 'name' } });
      await fireEvent.blur(input); // code coverage

      await fireEvent.click($('#submit', container));
      await waitFor(() => {
        expect(setDataSpy.called).to.be.true;
        expect(setDataSpy.args[0][0].additionalIssues[0].issue).to.eq('name');
      });
    });

    it('should call date change & blur', async () => {
      const goToPathSpy = sinon.spy();
      const setDataSpy = sinon.spy();
      const additionalIssues = [{ issue: 'name', decisionDate: '' }];
      const { container } = render(
        setup({
          goToPath: goToPathSpy,
          setFormData: setDataSpy,
          data: { contestedIssues, additionalIssues },
          index: 1,
        }),
      );

      const date = $('va-memorable-date', container);

      date.__events.dateChange({ target: { value: validDate } });
      date.__events.dateBlur();

      await fireEvent.click($('#submit', container));
      await waitFor(() => {
        expect(setDataSpy.called).to.be.true;
        expect(setDataSpy.args[0][0].additionalIssues[0].decisionDate).to.eq(
          validDate,
        );
      });
    });
  });
});
