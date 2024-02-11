import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import EvidencePrivateRecords from '../../components/EvidencePrivateRecords';
import {
  errorMessages,
  EVIDENCE_PRIVATE_PATH,
  NO_ISSUES_SELECTED,
} from '../../constants';

import { getDate } from '../../../shared/utils/dates';
import { SELECTED } from '../../../shared/constants';

/*
| Data     | Forward     | Back               | Add another      |
|----------|-------------|--------------------|------------------|
| Complete | Next page   | Prev page          | New page (empty) |
| Empty    | Focus error | Prev page & remove | Focus error      |
| Partial  | Focus error | Modal & Prev page  | Focus error      |
 */
describe('<EvidencePrivateRecords>', () => {
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
  const mockAddress = {
    country: 'USA',
    street: '123 Main',
    street2: '',
    city: 'City',
    state: 'CA',
    postalCode: '90210',
  };
  const mockFacility = {
    providerFacilityName: 'Location 1',
    providerFacilityAddress: mockAddress,
    issues: ['test 1'],
    treatmentDateRange: { from: '2001-01-01', to: '2011-01-01' },
  };
  const mockFacility2 = {
    providerFacilityName: 'Location 2',
    providerFacilityAddress: mockAddress,
    issues: ['test 2'],
    treatmentDateRange: { from: '2002-02-02', to: '2012-02-02' },
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
      <EvidencePrivateRecords
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
      [
        'va-text-input[error]',
        'va-select[error]',
        'va-checkbox-group[error]',
        'va-memorable-date[error]',
      ].join(','),
      container,
    );

  it('should render', () => {
    const { container } = render(setup());
    expect($('va-modal', container)).to.exist;
    expect($$('va-text-input', container).length).to.eq(5);
    expect($$('va-select', container).length).to.eq(2);
    expect($('va-checkbox-group', container)).to.exist;
    expect($$('va-checkbox', container).length).to.eq(2);
    expect($$('va-memorable-date', container).length).to.eq(2);
    expect($('.vads-c-action-link--green', container)).to.exist;
    // check Datadog classes
    expect(
      $$('va-checkbox.dd-privacy-hidden[data-dd-action-name]', container)
        .length,
    ).to.eq(2);
  });

  it('should render with no data', () => {
    const { container } = render(setup({ data: null }));
    expect($$('va-text-input', container).length).to.eq(5);
    expect($$('va-select', container).length).to.eq(2);
    expect($('va-checkbox-group', container)).to.exist;
    expect($$('va-checkbox', container).length).to.eq(0);
    expect($$('va-memorable-date', container).length).to.eq(2);
    expect($('.vads-c-action-link--green', container)).to.exist;
  });

  it('should update facility name', async () => {
    const setDataSpy = sinon.spy();
    const page = setup({ setFormData: setDataSpy });
    const { container } = render(page);

    const input = $('va-text-input', container);
    input.value = 'location 99';
    fireEvent.input(input, { target: { name: 'name' } });

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0].providerFacility[0]).to.deep.equal({
      providerFacilityName: input.value,
      providerFacilityAddress: {
        country: 'USA',
        street: '',
        street2: '',
        city: '',
        state: '',
        postalCode: '',
      },
      issues: [],
      treatmentDateRange: { from: '', to: '' },
    });
  });

  it('should add newly selected issue', async () => {
    const setDataSpy = sinon.spy();
    const page = setup({
      setFormData: setDataSpy,
      data: { ...mockData, providerFacility: [mockFacility] },
    });
    const { container } = render(page);

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: true, label: 'test 2' },
    });

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0].providerFacility[0]).to.deep.equal({
      ...mockFacility,
      issues: ['test 1', 'test 2'],
    });
  });

  it('should remove unselected issue', async () => {
    const setDataSpy = sinon.spy();
    const page = setup({
      setFormData: setDataSpy,
      data: { ...mockData, providerFacility: [mockFacility] },
    });
    const { container } = render(page);

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: false, label: 'test 1' },
    });

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0].providerFacility[0]).to.deep.equal({
      ...mockFacility,
      issues: [],
    });
  });

  // *** VALID DATA ***
  describe('valid data navigation', () => {
    it('should navigate forward to limitation page with valid data', async () => {
      const goSpy = sinon.spy();
      const data = { ...mockData, providerFacility: [mockFacility] };
      const page = setup({
        index: 0,
        goForward: goSpy,
        data,
      });
      const { container } = render(page);

      // continue
      fireEvent.click($('.usa-button-primary', container));
      await waitFor(() => expect(goSpy.calledWith(data)).to.be.true);
    });
    it('should navigate back to private records request page with valid data', async () => {
      const goSpy = sinon.spy();
      const data = { ...mockData, providerFacility: [mockFacility] };
      const index = 0;
      const page = setup({
        index,
        goBack: goSpy,
        data,
      });
      const { container } = render(page);

      // back
      fireEvent.click($('.usa-button-secondary', container));
      // passing a negative index is okay, we're leaving the indexed pages
      await waitFor(() => expect(goSpy.calledWith(index - 1)).to.be.true);
    });
    it('should navigate from zero index to a new empty facility page, of index 1, with valid data', async () => {
      const goSpy = sinon.spy();
      const data = {
        ...mockData,
        providerFacility: [mockFacility, {}, mockFacility2],
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
        expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index + 1}`))
          .to.be.true;
      });
    });
    it('should navigate from zero index, with valid data, to next index when inserting another entry', async () => {
      const goSpy = sinon.spy();
      const providerFacility = [mockFacility, mockFacility2, {}];
      const data = { ...mockData, providerFacility };
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
        expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index + 1}`))
          .to.be.true;
      });
    });
  });

  // *** EMPTY PAGE ***
  describe('empty page navigation', () => {
    const getAndTestAllErrors = (container, options = {}) => {
      const errors = errorMessages.evidence;
      const errorEls = getErrorElements(container);
      [
        errors.facilityMissing,
        options.ignoreCountry ? null : errors.country, // default set to USA
        errors.street,
        errors.city,
        errors.state,
        errors.postal,
        errors.issuesMissing,
        errors.blankDate,
        errors.blankDate,
      ]
        .filter(Boolean)
        .forEach((error, index) => {
          expect(errorEls[index].error).to.eq(error);
          if (error === errors.blankDate) {
            expect(errorEls[index].invalidMonth).to.be.true;
            expect(errorEls[index].invalidDay).to.be.true;
            expect(errorEls[index].invalidYear).to.be.true;
          }
        });
    };

    it('should show & focus error messages after going forward on an empty first page', async () => {
      const goSpy = sinon.spy();
      const index = 0;
      const page = setup({
        index,
        goForward: goSpy,
        goToPath: goSpy,
      });
      const { container } = render(page);

      // continue
      fireEvent.click($('.usa-button-primary', container));

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.false;
        getAndTestAllErrors(container, { ignoreCountry: true });
      });
    });
    it('should show & focus error messages after going forward on an empty second page', async () => {
      const goSpy = sinon.spy();
      const index = 1;
      const data = {
        ...mockData,
        providerFacility: [mockFacility, {}, mockFacility2],
      };
      const page = setup({
        index,
        goForward: goSpy,
        goToPath: goSpy,
        data,
      });
      const { container } = render(page);

      // continue
      fireEvent.click($('.usa-button-primary', container));

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.false;
        getAndTestAllErrors(container);
      });
    });
    it('should go back on an empty page on first entry', async () => {
      const goSpy = sinon.spy();
      const index = 0;
      const page = setup({ index, goBack: goSpy, goToPath: goSpy });
      const { container } = render(page);

      // back
      fireEvent.click($('.usa-button-secondary', container));

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.true;
        expect(goSpy.calledWith(index - 1)).to.be.true;
      });
    });

    it('should go back and remove empty page', async () => {
      const goSpy = sinon.spy();
      const setDataSpy = sinon.spy();
      const data = { ...mockData, providerFacility: [mockFacility, {}] };
      const page = setup({
        index: 1,
        goToPath: goSpy,
        setFormData: setDataSpy,
        data,
      });
      const { container } = render(page);

      // back
      fireEvent.click($('.usa-button-secondary', container));

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(goSpy.called).to.be.true;
        expect(setDataSpy.called).to.be.true;
        expect(setDataSpy.lastCall.args[0].providerFacility.length).to.eq(1);
      });
    });
    it('should show & focus on error messages after adding new location on an empty second page', async () => {
      const goSpy = sinon.spy();
      const index = 1;
      const data = {
        ...mockData,
        providerFacility: [mockFacility, {}, mockFacility2],
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
      await fireEvent.click($('.usa-button-secondary', container));

      const event = new CustomEvent('closeEvent');
      await $('va-modal', container).__events.closeEvent(event);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
      });
    });
  });

  describe('partial/invalid data navigation', () => {
    const testAndCloseModal = async (container, total, event) => {
      expect(getErrorElements(container).length).to.eq(total);
      // modal visible
      await waitFor(() => {
        expect($('va-modal[visible="true"]', container)).to.exist;
      });

      // close modal
      await $('va-modal').__events[event]();
      return waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
      });
    };

    it('should not navigate, but will show errors after continuing', async () => {
      const goSpy = sinon.spy();
      const index = 1;
      const data = {
        ...mockData,
        providerFacility: [
          mockFacility,
          { providerFacilityName: 'foo' },
          mockFacility2,
        ],
      };
      const page = setup({
        index,
        goForward: goSpy,
        goToPath: goSpy,
        data,
      });
      const { container } = render(page);

      // continue
      fireEvent.click($('.usa-button-primary', container));

      await waitFor(() => {
        expect(goSpy.called).to.be.false;
        expect(getErrorElements(container).length).to.eq(8);
        expect(document.activeElement).to.eq($('[error]', container));
      });
    });

    // *** BACK ***
    // consistently flaky test
    it('should show modal, select "No, remove this location", then navigate back to previous index', async () => {
      const goSpy = sinon.spy();
      const setDataSpy = sinon.spy();
      const index = 1;
      const data = {
        ...mockData,
        providerFacility: [
          mockFacility,
          { providerFacilityName: 'foo' },
          mockFacility2,
        ],
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
      fireEvent.click($('.usa-button-secondary', container));
      // Click no
      await testAndCloseModal(container, 8, 'secondaryButtonClick');

      await waitFor(() => {
        expect(setDataSpy.called).to.be.true;
        expect(setDataSpy.lastCall.args[0].providerFacility.length).to.eq(2);
        expect(goSpy.called).to.be.true;
        expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index - 1}`))
          .to.be.true;
      });
    });

    // consistently flaky test
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
          providerFacility: [
            mockFacility,
            mockFacility2,
            { providerFacilityName: 'foo' },
          ],
        },
      });
      const { container } = render(page);

      // back
      fireEvent.click($('.usa-button-secondary', container));
      // Click yes to keep partial entry
      await testAndCloseModal(container, 8, 'primaryButtonClick');

      await waitFor(() => {
        expect(setDataSpy.called).to.be.false; // no data change
        expect(goSpy.called).to.be.true;
        expect(goSpy.calledWith(`/${EVIDENCE_PRIVATE_PATH}?index=${index - 1}`))
          .to.be.true;
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
          providerFacility: [mockFacility, { lproviderFacilityName: 'foo' }],
        },
      });
      const { container } = render(page);

      // add
      fireEvent.click($('.vads-c-action-link--green', container));

      await waitFor(() => {
        expect(goSpy.called).to.be.false;
        expect(getErrorElements(container).length).to.eq(9);
        expect(document.activeElement).to.eq($('[error]', container));
      });
    });
  });

  describe('other errors', () => {
    const fromBlurEvent = new CustomEvent('blur', { detail: 'from' });
    const toBlurEvent = new CustomEvent('blur', { detail: 'to' });

    it('should show error when start treatment date is in the future', async () => {
      const from = getDate({ offset: { years: +1 } });
      const data = {
        ...mockData,
        providerFacility: [{ treatmentDateRange: { from } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      const dateFrom = $('va-memorable-date', container);
      // blur date from input
      $('va-memorable-date').__events.dateBlur(fromBlurEvent);

      await waitFor(() => {
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
        providerFacility: [{ treatmentDateRange: { to } }],
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

    it('should show an error when the start treatment date is too far in the past', async () => {
      const from = getDate({ offset: { years: -101 } });
      const data = {
        ...mockData,
        providerFacility: [{ treatmentDateRange: { from } }],
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
        providerFacility: [{ treatmentDateRange: { to } }],
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
        providerFacility: [{ treatmentDateRange: { from, to } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date to input
      $('va-memorable-date').__events.dateBlur(toBlurEvent);

      await waitFor(() => {
        const dateTo = $$('va-memorable-date', container)[1];
        expect(dateTo.error).to.contain(errorMessages.endDateBeforeStart);
        expect(dateTo.invalidMonth).to.be.true;
        expect(dateTo.invalidDay).to.be.true;
        expect(dateTo.invalidYear).to.be.true;
      });
    });

    it('should show an error when the issue is not unique', async () => {
      const data = {
        ...mockData,
        providerFacility: [mockFacility, mockFacility],
      };
      const page = setup({ index: 1, data });
      const { container } = render(page);

      const input = $('va-text-input', container);
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input.error).to.contain(errorMessages.evidence.uniquePrivate);
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
