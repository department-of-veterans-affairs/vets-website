import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import EvidenceVaRecords from '../../components/EvidenceVaRecords';
import {
  errorMessages,
  EVIDENCE_VA_PATH,
  NO_ISSUES_SELECTED,
} from '../../constants';

import { getDate } from '../../../shared/utils/dates';
import { MAX_LENGTH, SELECTED } from '../../../shared/constants';

/*
| Data     | Forward     | Back               | Add another      |
|----------|-------------|--------------------|------------------|
| Complete | Next page   | Prev page          | New page (empty) |
| Empty    | Focus error | Prev page & remove | Focus error      |
| Partial  | Focus error | Modal & Prev page  | Focus error      |
 */
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
    issues: ['test 1'],
    evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
  };
  const mockLocation2 = {
    locationAndName: 'Location 2',
    issues: ['test 2'],
    evidenceDates: { from: '2002-02-02', to: '2012-02-02' },
  };

  const setup = ({
    index = 0,
    data = mockData,
    goBack = () => {},
    goForward = () => {},
    goToPath = () => {},
    setFormData = () => {},
  } = {}) => (
    <div>
      <EvidenceVaRecords
        testingIndex={index}
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

  const getErrorElements = container =>
    $$(
      'va-text-input[error], va-checkbox-group[error], va-memorable-date[error]',
      container,
    );

  it('should render', () => {
    const { container } = render(setup());
    expect($('h3', container)).to.exist;
    expect($('va-modal', container)).to.exist;
    expect($('va-text-input', container)).to.exist;
    expect($('va-checkbox-group', container)).to.exist;
    expect($$('va-checkbox', container).length).to.eq(2);
    expect($$('va-memorable-date', container).length).to.eq(2);
    expect($('.vads-c-action-link--green', container)).to.exist;
    // check Datadog classes
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(2);
  });

  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

  const clickContinue = container => {
    const pair = $('va-button-pair', container);
    pair.__events.primaryClick(clickEvent);
  };

  const clickBack = container => {
    const pair = $('va-button-pair', container);
    pair.__events.secondaryClick(clickEvent);
  };

  it('should update location name', async () => {
    const setDataSpy = sinon.spy();
    const page = setup({ setFormData: setDataSpy });
    const { container } = render(page);

    const input = $('va-text-input', container);
    input.value = 'location 99';
    fireEvent.input(input, { target: { name: 'name' } });

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0].locations[0]).to.deep.equal({
      locationAndName: input.value,
      issues: [],
      evidenceDates: { from: '', to: '' },
    });
  });

  it('should add newly selected issue', async () => {
    const setDataSpy = sinon.spy();
    const page = setup({
      setFormData: setDataSpy,
      data: { ...mockData, locations: [mockLocation] },
    });
    const { container } = render(page);

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: true, label: 'test 2' },
    });

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0].locations[0]).to.deep.equal({
      ...mockLocation,
      issues: ['test 1', 'test 2'],
    });
  });

  it('should remove unselected issue', async () => {
    const setDataSpy = sinon.spy();
    const page = setup({
      setFormData: setDataSpy,
      data: { ...mockData, locations: [mockLocation] },
    });
    const { container } = render(page);

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: false, label: 'test 1' },
    });

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0].locations[0]).to.deep.equal({
      ...mockLocation,
      issues: [],
    });
  });

  // *** VALID DATA ***
  describe('valid data navigation', () => {
    it('should navigate forward to VA private request page with valid data', async () => {
      const goSpy = sinon.spy();
      const data = { ...mockData, locations: [mockLocation] };
      const page = setup({
        index: 0,
        goForward: goSpy,
        data,
      });
      const { container } = render(page);

      // continue
      clickContinue(container);
      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.calledWith(data)).to.be.true;
      });
    });
    it('should navigate back to VA records request page with valid data', async () => {
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
      clickBack(container);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        // passing a negative index is okay, we're leaving the indexed pages
        expect(goSpy.calledWith(index - 1)).to.be.true;
      });
    });
    it('should navigate from zero index to a new empty location page, of index 1, with valid data', async () => {
      const goSpy = sinon.spy();
      const data = {
        ...mockData,
        locations: [mockLocation, {}, mockLocation2],
      };
      const index = 0;
      const page = setup({
        index,
        goToPath: goSpy,
        data,
      });
      const { container } = render(page);

      // add
      fireEvent.click($('.vads-c-action-link--green', container));

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${index + 1}`)).to
          .be.true;
      });
    });

    it('should navigate from zero index, with valid data, to next index when inserting another entry', async () => {
      const goSpy = sinon.spy();
      const locations = [mockLocation, mockLocation2, {}];
      const data = { ...mockData, locations };
      const index = 0;
      const page = setup({
        index,
        goToPath: goSpy,
        data,
      });
      const { container } = render(page);

      // add
      fireEvent.click($('.vads-c-action-link--green', container));

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${index + 1}`)).to
          .be.true;
      });
    });
  });

  // *** EMPTY PAGE ***
  describe('empty page navigation', () => {
    const getAndTestAllErrors = container => {
      expect(document.activeElement).to.eq($('[error]', container));
      const errors = errorMessages.evidence;
      const errorEls = getErrorElements(container);
      expect(errorEls[0].error).to.eq(errors.locationMissing);
      expect(errorEls[1].error).to.eq(errors.issuesMissing);

      expect(errorEls[2].error).to.eq(errorMessages.evidence.blankDate);
      expect(errorEls[2].invalidMonth).to.be.true;
      expect(errorEls[2].invalidDay).to.be.true;
      expect(errorEls[2].invalidYear).to.be.true;

      expect(errorEls[3].error).to.eq(errorMessages.evidence.blankDate);
      expect(errorEls[3].invalidMonth).to.be.true;
      expect(errorEls[3].invalidDay).to.be.true;
      expect(errorEls[3].invalidYear).to.be.true;
    };

    it('should show & focus on error messages after going forward on an empty first page', async () => {
      const goSpy = sinon.spy();
      const index = 0;
      const page = setup({ index, goForward: goSpy });
      const { container } = render(page);

      // forward
      clickContinue(container);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.false;
        getAndTestAllErrors(container);
      });
    });
    it('should show & focus on error messages after going forward on an empty second page', async () => {
      const goSpy = sinon.spy();
      const index = 1;
      const data = {
        ...mockData,
        locations: [mockLocation, {}, mockLocation2],
      };
      const page = setup({
        index,
        goForward: goSpy,
        goToPath: goSpy,
        data,
      });
      const { container } = render(page);

      // continue
      clickContinue(container);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.false;
        getAndTestAllErrors(container);
      });
    });
    it('should go back on an empty page on first entry', async () => {
      const goSpy = sinon.spy();
      const index = 0;
      const page = setup({ index, goBack: goSpy });
      const { container } = render(page);

      // back
      clickBack(container);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.true;
        expect(goSpy.calledWith(index - 1)).to.be.true;
      });
    });

    it('should go back and remove empty page', async () => {
      const goSpy = sinon.spy();
      const setDataSpy = sinon.spy();
      const data = { ...mockData, locations: [mockLocation, {}] };
      const page = setup({
        index: 1,
        goToPath: goSpy,
        setFormData: setDataSpy,
        data,
      });
      const { container } = render(page);

      // back
      clickBack(container);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.true;
        expect(setDataSpy.called).to.be.true;
        expect(setDataSpy.lastCall.args[0].locations.length).to.eq(1);
      });
    });
    it('should show & focus on error messages after adding new location on an empty second page', async () => {
      const goSpy = sinon.spy();
      const index = 1;
      const data = {
        ...mockData,
        locations: [mockLocation, {}, mockLocation2],
      };
      const page = setup({
        index,
        goForward: goSpy,
        goToPath: goSpy,
        data,
      });
      const { container } = render(page);

      // add
      fireEvent.click($('.vads-c-action-link--green', container));

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.false;
        getAndTestAllErrors(container);
      });
    });

    it('should cancel navigation', async () => {
      const goSpy = sinon.spy();
      const index = 0;
      const page = setup({ index, goBack: goSpy, goToPath: goSpy });
      const { container } = render(page);

      // back
      clickBack(container);

      const event = new CustomEvent('closeEvent');
      await $('va-modal', container).__events.closeEvent(event);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
      });
    });
  });

  describe('partial/invalid data navigation', () => {
    const testAndCloseModal = async (container, event) => {
      // modal visible
      await waitFor(() => {
        expect($('va-modal[visible="true"]', container)).to.exist;
      });

      // close modal
      $('va-modal').__events[event]();
      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
      });
    };

    it('should not navigate, but will show errors after continuing', async () => {
      const goSpy = sinon.spy();
      const index = 1;
      const data = {
        ...mockData,
        locations: [mockLocation, { locationAndName: 'foo' }, mockLocation2],
      };
      const page = setup({
        index,
        goForward: goSpy,
        goToPath: goSpy,
        data,
      });
      const { container } = render(page);

      // continue
      clickContinue(container);

      await waitFor(() => {
        expect(goSpy.called).to.be.false;
        expect(getErrorElements(container).length).to.eq(3);
        expect(document.activeElement).to.eq($('[error]', container));
      });
    });

    // *** BACK ***
    it('should show modal, select "No, remove this location", then navigate back to previous index', async () => {
      const goSpy = sinon.spy();
      const setDataSpy = sinon.spy();
      const index = 1;
      const data = {
        ...mockData,
        locations: [mockLocation, { locationAndName: 'foo' }, mockLocation2],
      };
      const page = setup({
        index,
        goBack: goSpy,
        goToPath: goSpy,
        setFormData: setDataSpy,
        data,
      });
      const { container } = render(page);

      // back
      clickBack(container);

      // This check is super-flaky in CI
      await waitFor(() => {
        expect(getErrorElements(container).length).to.eq(3);
      });

      await testAndCloseModal(container, 'secondaryButtonClick');

      await waitFor(() => {
        expect(setDataSpy.called).to.be.true;
        expect(setDataSpy.lastCall.args[0].locations.length).to.eq(2);
        expect(goSpy.called).to.be.true;
        expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${index - 1}`)).to
          .be.true;
      });
    });

    it('should show modal, select "Yes", then navigate back to previous index', async () => {
      const goSpy = sinon.spy();
      const setDataSpy = sinon.spy();
      const index = 2;
      const page = setup({
        index,
        goToPath: goSpy,
        setFormData: setDataSpy,
        data: {
          ...mockData,
          locations: [mockLocation, mockLocation2, { locationAndName: 'foo' }],
        },
      });
      const { container } = render(page);

      // back
      clickBack(container);

      // This check is super-flaky in CI
      await waitFor(() => {
        expect(getErrorElements(container).length).to.eq(3);
      });

      // keep partial entry
      await testAndCloseModal(container, 'primaryButtonClick');

      await waitFor(() => {
        expect(setDataSpy.called).to.be.false; // no data change
        expect(goSpy.called).to.be.true;
        expect(goSpy.calledWith(`/${EVIDENCE_VA_PATH}?index=${index - 1}`)).to
          .be.true;
      });
    });

    // *** ADD ANOTHER ***
    it('should not navigate, but show errors after adding another and choosing "Yes" on an empty page', async () => {
      const goSpy = sinon.spy();
      const index = 1;
      const page = setup({
        index,
        goToPath: goSpy,
        data: {
          ...mockData,
          locations: [mockLocation, { locationAndName: 'foo' }],
        },
      });
      const { container } = render(page);

      // add
      fireEvent.click($('.vads-c-action-link--green', container));

      await waitFor(() => {
        expect(goSpy.called).to.be.false;
        expect(getErrorElements(container).length).to.eq(3);
        expect(document.activeElement).to.eq($('[error]', container));
      });
    });
  });

  describe('other errors', () => {
    const fromBlurEvent = new CustomEvent('blur', { detail: 'from' });
    const toBlurEvent = new CustomEvent('blur', { detail: 'to' });

    // *** OTHER ERRORS ***
    it('should show error when location name is too long', async () => {
      const name = 'abcdef '.repeat(
        MAX_LENGTH.SC_EVIDENCE_LOCATION_AND_NAME / 6,
      );
      const data = { ...mockData, locations: [{ locationAndName: name }] };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      const input = $('va-text-input', container);
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input.error).to.contain(
          errorMessages.evidence.locationMaxLength,
        );
      });
    });

    it('should show error when start treatment date is in the future', async () => {
      const from = getDate({ offset: { years: +1 } });
      const data = {
        ...mockData,
        locations: [{ evidenceDates: { from } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date from input
      $('va-memorable-date').__events.dateBlur(fromBlurEvent);

      await waitFor(() => {
        const dateFrom = $('va-memorable-date', container);
        expect(dateFrom.error).to.contain(errorMessages.evidence.pastDate);
        expect(dateFrom.invalidMonth).to.be.false;
        expect(dateFrom.invalidDay).to.be.false;
        expect(dateFrom.invalidYear).to.be.true;
      });
    });

    it('should show error when last treatment date is in the future', async () => {
      const to = getDate({ offset: { years: +1 } });
      const data = {
        ...mockData,
        locations: [{ evidenceDates: { to } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date to input
      $('va-memorable-date').__events.dateBlur(toBlurEvent);

      await waitFor(() => {
        const dateTo = $$('va-memorable-date', container)[1];
        expect(dateTo.error).to.contain(errorMessages.evidence.pastDate);
        expect(dateTo.invalidMonth).to.be.false;
        expect(dateTo.invalidDay).to.be.false;
        expect(dateTo.invalidYear).to.be.true;
      });
    });

    it('should show an error when the start treament date is too far in the past', async () => {
      const from = getDate({ offset: { years: -101 } });
      const data = {
        ...mockData,
        locations: [{ evidenceDates: { from } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date from input
      $('va-memorable-date').__events.dateBlur(fromBlurEvent);

      await waitFor(() => {
        const dateFrom = $('va-memorable-date', container);
        expect(dateFrom.error).to.contain(errorMessages.evidence.newerDate);
        expect(dateFrom.invalidMonth).to.be.false;
        expect(dateFrom.invalidDay).to.be.false;
        expect(dateFrom.invalidYear).to.be.true;
      });
    });

    it('should show an error when the last treatment date is too far in the past', async () => {
      const to = getDate({ offset: { years: -101 } });
      const data = {
        ...mockData,
        locations: [{ evidenceDates: { to } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date to input
      $('va-memorable-date').__events.dateBlur(toBlurEvent);

      await waitFor(() => {
        const dateTo = $$('va-memorable-date', container)[1];
        expect(dateTo.error).to.contain(errorMessages.evidence.newerDate);
        expect(dateTo.invalidMonth).to.be.false;
        expect(dateTo.invalidDay).to.be.false;
        expect(dateTo.invalidYear).to.be.true;
      });
    });

    it('should show an error when the last treatment date is before the start', async () => {
      const from = getDate({ offset: { years: -5 } });
      const to = getDate({ offset: { years: -10 } });
      const data = {
        ...mockData,
        locations: [{ evidenceDates: { from, to } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      const dateTo = $$('va-memorable-date', container)[1];
      // blur date to input
      $('va-memorable-date').__events.dateBlur(toBlurEvent);

      await waitFor(() => {
        expect(dateTo.error).to.contain(errorMessages.endDateBeforeStart);
      });
    });

    it('should show an error when the issue is not unique', async () => {
      const data = { ...mockData, locations: [mockLocation, mockLocation] };
      const page = setup({ index: 1, data });
      const { container } = render(page);

      const input = $('va-text-input', container);
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input.error).to.contain(errorMessages.evidence.uniqueVA);
      });
    });

    it('should show no contestable issues were selected message', () => {
      const data = { data: { contestedIssues: [], additionalIssues: [] } };
      const { container } = render(setup(data));
      expect($('va-checkbox-group', container).textContent).to.contain(
        NO_ISSUES_SELECTED,
      );
    });
  });
});
