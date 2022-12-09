import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import EvidenceVaRecords from '../../components/EvidenceVaRecords';
import {
  errorMessages,
  SELECTED,
  MAX_LENGTH,
  EVIDENCE_VA_PATH,
} from '../../constants';
import { getDate } from '../../utils/dates';
import { $, $$ } from '../../utils/ui';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

describe('<EvidenceVaRecords>', () => {
  const validDate = getDate({ offset: { months: -2 } });
  const mockData = {
    contestedIssues: [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'test 1',
          approxDecisionDate: validDate,
        },
        [SELECTED]: true,
      },
    ],
    additionalIssues: [
      { issue: 'test 2', decisionDate: validDate, [SELECTED]: true },
    ],
  };
  const mockLocation = {
    locationAndName: 'Location 1',
    issues: ['Ankylosis of knee'],
    evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
  };
  const mockLocation2 = {
    locationAndName: 'Location 2',
    issues: ['Tinnitus'],
    evidenceDates: { from: '2002-02-02', to: '2012-02-02' },
  };

  const setup = ({
    index = 0,
    method = '',
    onReviewPage = false,
    data = mockData,
    goBack = () => {},
    goForward = () => {},
    goToPath = () => {},
    setFormData = () => {},
  } = {}) => (
    <div>
      <EvidenceVaRecords
        testingIndex={index}
        testingMethod={method}
        onReviewPage={onReviewPage}
        data={data}
        goBack={goBack}
        goForward={goForward}
        goToPath={goToPath}
        setFormData={setFormData}
        contentBeforeButtons={<div>before</div>}
        contentAfterButtons={<div>after</div>}
      />
    </div>
  );
  const testAndCloseModal = container => {
    // modal visible
    expect($('va-modal', container).getAttribute('visible')).to.eq('true');

    // close modal by clicking method-assigned hidden button
    fireEvent.click($('#test-method', container), mouseClick);
    expect($('va-modal', container).getAttribute('visible')).to.eq('false');
  };

  const getErrorElements = container =>
    $$(
      'va-text-input[error], va-checkbox-group[error], va-date[error]',
      container,
    );

  const getAndTestAllErrors = container => {
    const errors = errorMessages.evidence;
    const errorEls = getErrorElements(container);
    expect(errorEls[0].error).to.eq(errors.locationMissing);
    expect(errorEls[1].error).to.eq(errors.issuesMissing);
    expect(errorEls[2].error).to.eq(errorMessages.invalidDate);
    expect(errorEls[3].error).to.eq(errorMessages.invalidDate);
  };

  it('should render', () => {
    const { container } = render(setup());
    expect($('va-modal', container)).to.exist;
    expect($('va-text-input', container)).to.exist;
    expect($('va-checkbox-group', container)).to.exist;
    expect($$('va-checkbox', container).length).to.eq(2);
    expect($$('va-date', container).length).to.eq(2);
    expect($('.vads-c-action-link--green', container)).to.exist;
  });

  it('should show error messages after closing modal after submitting empty page', () => {
    const { container } = render(setup({ method: 'onModalClose' }));

    // continue
    fireEvent.click($('.usa-button-primary', container), mouseClick);
    testAndCloseModal(container);
    getAndTestAllErrors(container);
  });

  // *** FORWARD ***
  it('should navigate forward to VA private request page with valid data', () => {
    const goSpy = sinon.spy();
    const data = { ...mockData, locations: [mockLocation] };
    const page = setup({
      index: 0,
      goForward: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container), mouseClick);
    expect(goSpy.calledWith(data)).to.be.true;
  });

  it('should show modal when submitting an empty page', () => {
    const goSpy = sinon.spy();
    const { container } = render(setup({ goForward: goSpy }));
    fireEvent.submit($('form', container));

    expect($('va-modal', container).getAttribute('visible')).to.eq('true');
    expect(goSpy.called).to.be.false;
  });

  it('should not navigate, but will show errors when choosing "Yes" after continuing', () => {
    const goSpy = sinon.spy();
    const index = 1;
    const data = { ...mockData, locations: [{}, {}, {}] };
    const page = setup({
      index,
      method: 'onModalYes',
      goForward: goSpy,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container), mouseClick);
    testAndCloseModal(container);

    expect(goSpy.called).to.be.false;
    getAndTestAllErrors(container);
  });

  it('should navigate forward to next index when choosing "No" after continuing', () => {
    const goSpy = sinon.spy();
    const index = 2;
    const data = { ...mockData, locations: [mockLocation, mockLocation2] };
    const page = setup({
      index,
      method: 'onModalNo',
      goForward: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container), mouseClick);
    testAndCloseModal(container);
    expect(getErrorElements(container).length).to.eq(0);

    // going forward requires passing the form data
    expect(goSpy.calledWith(data)).to.be.true;
    // index still at 2, because we've moved beyond the indexed pages
    expect(goSpy.firstCall.args[1]).to.eq(index);
  });

  it('should navigate forward to VA private request page when choosing "No" after continuing', () => {
    const goSpy = sinon.spy();
    const data = { ...mockData, locations: [{}, {}] };
    const page = setup({
      index: 2,
      method: 'onModalNo',
      goForward: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-primary', container), mouseClick);
    testAndCloseModal(container);
    expect(goSpy.calledWith(data)).to.be.true;
  });

  // *** BACK ***
  it('should navigate back to VA records request page with valid data', () => {
    const goSpy = sinon.spy();
    const data = { ...mockData, locations: [mockLocation] };
    const index = 0;
    const page = setup({
      index,
      goBack: goSpy,
      data,
    });
    const { container } = render(page);

    // back
    fireEvent.click($('.usa-button-secondary', container), mouseClick);
    // passing a negative index is okay, we're leaving the indexed pages
    expect(goSpy.calledWith(index - 1)).to.be.true;
  });

  it('should show modal when going back on an empty page', () => {
    const goSpy = sinon.spy();
    const { container } = render(setup({ goBack: goSpy }));
    fireEvent.click($('.usa-button-secondary', container));

    expect($('va-modal', container).getAttribute('visible')).to.eq('true');
    expect(goSpy.called).to.be.false;
  });

  it('should navigate back to previous index page, after choosing "Yes" in modal', () => {
    const goSpy = sinon.spy();
    const index = 1;
    const data = { ...mockData, locations: [{}, {}, {}] };
    const page = setup({
      index,
      method: 'onModalYes',
      goBack: goSpy,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-secondary', container), mouseClick);
    testAndCloseModal(container);

    expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${index - 1}`)).to.be
      .true;
  });

  it('should navigate back to VA record request page, after choosing "Yes" in modal', () => {
    const goSpy = sinon.spy();
    const index = 0;
    const data = { ...mockData, locations: [{}, {}, {}] };
    const page = setup({
      index,
      method: 'onModalYes',
      goBack: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.usa-button-secondary', container), mouseClick);
    testAndCloseModal(container);

    expect(goSpy.calledWith(index - 1)).to.be.true;
  });

  it('should navigate back one index when choosing "No" after continuing', () => {
    const goSpy = sinon.spy();
    const index = 2;
    const page = setup({
      index,
      method: 'onModalNo',
      goToPath: goSpy,
      data: { ...mockData, locations: [{}, {}] },
    });
    const { container } = render(page);

    // back
    fireEvent.click($('.usa-button-secondary', container), mouseClick);
    testAndCloseModal(container);

    expect(goSpy.called).to.be.true;
    expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${index - 1}`)).to.be
      .true;
  });

  it('should navigate back to request VA records page when choosing "No" after continuing', () => {
    const goSpy = sinon.spy();
    const index = 0;
    const page = setup({
      index,
      method: 'onModalNo',
      goBack: goSpy,
      data: { ...mockData, locations: [{}, {}] },
    });
    const { container } = render(page);

    // back
    fireEvent.click($('.usa-button-secondary', container), mouseClick);
    testAndCloseModal(container);

    expect(goSpy.called).to.be.true;
    expect(goSpy.calledWith(index - 1)).to.be.true;
  });

  // *** ADD ANOTHER ***
  it('should navigate from zero index to a new empty location page, of index 1, with valid data', () => {
    const goSpy = sinon.spy();
    const data = { ...mockData, locations: [mockLocation] };
    const index = 0;
    const page = setup({
      index,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // add
    fireEvent.click($('.vads-c-action-link--green', container), mouseClick);

    expect($('va-modal', container).getAttribute('visible')).to.eq('false');
    expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${index + 1}`)).to.be
      .true;
  });

  it('should navigate from zero index to last entry + 1 when adding another with valid data', () => {
    const goSpy = sinon.spy();
    const locations = [mockLocation, {}, {}];
    const data = { ...mockData, locations };
    const index = 0;
    const page = setup({
      index,
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // add
    fireEvent.click($('.vads-c-action-link--green', container), mouseClick);

    expect($('va-modal', container).getAttribute('visible')).to.eq('false');
    expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${locations.length}`))
      .to.be.true;
  });

  it('should show modal when adding another on an empty page', () => {
    const goSpy = sinon.spy();
    const index = 1;
    const page = setup({
      index,
      method: 'onModalNo',
      goToPath: goSpy,
      data: { ...mockData, locations: [{}, {}] },
    });
    const { container } = render(page);
    fireEvent.click($('.vads-c-action-link--green', container));

    expect($('va-modal', container).getAttribute('visible')).to.eq('true');
    expect(goSpy.called).to.be.false;
  });

  it('should not navigate, but show errors after adding another and choosing "Yes" on an empty page', () => {
    const goSpy = sinon.spy();
    const index = 1;
    const page = setup({
      index,
      method: 'onModalYes',
      goToPath: goSpy,
      data: { ...mockData, locations: [{}, {}] },
    });
    const { container } = render(page);

    // add
    fireEvent.click($('.vads-c-action-link--green', container));

    testAndCloseModal(container);
    getAndTestAllErrors(container);
    expect(goSpy.called).to.be.false;
  });

  it('should not navigate, but clear all data after adding another and choosing "No" on an empty page', () => {
    const goSpy = sinon.spy();
    const data = {
      ...mockData,
      locations: [mockLocation, { locationAndName: 'test' }, {}],
    };
    const index = 1;
    const page = setup({
      index,
      method: 'onModalNo',
      goToPath: goSpy,
      data,
    });
    const { container } = render(page);

    // continue
    fireEvent.click($('.vads-c-action-link--green', container), mouseClick);

    testAndCloseModal(container);
    // stay on the same index, but clear all fields
    expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${index}`)).to.be.true;
    expect(getErrorElements(container).length).to.eq(0);
  });

  it('should show error when location name is too long', () => {
    const name = 'abcdef '.repeat(MAX_LENGTH.EVIDENCE_LOCATION_AND_NAME / 6);
    const data = { ...mockData, locations: [{ locationAndName: name }] };
    const page = setup({ index: 0, data });
    const { container } = render(page);

    const input = $('va-text-input', container);
    fireEvent.blur(input);

    expect(input.error).to.contain(errorMessages.evidence.locationMaxLength);
  });

  it('should show error when start treatment date is in the future', () => {
    const from = getDate({ offset: { years: +1 } });
    const data = {
      ...mockData,
      locations: [{ evidenceDates: { from } }],
    };
    const page = setup({ index: 0, data, method: 'onDateStartBlur' });
    const { container } = render(page);

    const dateFrom = $('va-date', container);
    // blur date inputs - va-text-input blur works, but not the va-date?
    // fireEvent.blur(dateFrom);
    fireEvent.click($('#test-method', container), mouseClick);

    expect(dateFrom.error).to.contain(errorMessages.evidence.pastDate);
  });

  it('should show error when last treatment date is in the future', () => {
    const to = getDate({ offset: { years: +1 } });
    const data = {
      ...mockData,
      locations: [{ evidenceDates: { to } }],
    };
    const page = setup({ index: 0, data, method: 'onDateEndBlur' });
    const { container } = render(page);

    const dateTo = $$('va-date', container)[1];
    // blur date inputs - va-text-input blur works, but not the va-date?
    // fireEvent.blur(dateFrom);
    fireEvent.click($('#test-method', container), mouseClick);

    expect(dateTo.error).to.contain(errorMessages.evidence.pastDate);
  });

  it('should show an error when the start treament date is too far in the past', () => {
    const from = getDate({ offset: { years: -101 } });
    const data = {
      ...mockData,
      locations: [{ evidenceDates: { from } }],
    };
    const page = setup({ index: 0, data, method: 'onDateStartBlur' });
    const { container } = render(page);

    const dateFrom = $('va-date', container);
    // blur date inputs - va-text-input blur works, but not the va-date?
    // fireEvent.blur(dateFrom);
    fireEvent.click($('#test-method', container), mouseClick);

    expect(dateFrom.error).to.contain(errorMessages.evidence.newerDate);
  });

  it('should show an error when the last treatment date is too far in the past', () => {
    const to = getDate({ offset: { years: -101 } });
    const data = {
      ...mockData,
      locations: [{ evidenceDates: { to } }],
    };
    const page = setup({ index: 0, data, method: 'onDateEndBlur' });
    const { container } = render(page);

    const dateTo = $$('va-date', container)[1];
    // blur date inputs - va-text-input blur works, but not the va-date?
    // fireEvent.blur(dateTo);
    fireEvent.click($('#test-method', container), mouseClick);

    expect(dateTo.error).to.contain(errorMessages.evidence.newerDate);
  });

  it('should show an error when the last treatment date is before the start', () => {
    const from = getDate({ offset: { years: -5 } });
    const to = getDate({ offset: { years: -10 } });
    const data = {
      ...mockData,
      locations: [{ evidenceDates: { from, to } }],
    };
    const page = setup({ index: 0, data, method: 'onDateEndBlur' });
    const { container } = render(page);

    const dateTo = $$('va-date', container)[1];
    // blur date inputs - va-text-input blur works, but not the va-date?
    // fireEvent.blur(dateTo);
    fireEvent.click($('#test-method', container), mouseClick);

    expect(dateTo.error).to.contain(errorMessages.endDateBeforeStart);
  });

  it('should show an error when the issue is not unique', () => {
    const data = { ...mockData, locations: [mockLocation, mockLocation] };
    const page = setup({ index: 1, data });
    const { container } = render(page);

    const input = $('va-text-input', container);
    fireEvent.blur(input);

    expect(input.error).to.contain(errorMessages.evidence.unique);
  });
});
