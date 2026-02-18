import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as focusUtils from '~/platform/utilities/ui/focus';
import PrivateDetailsEntry from '../../../components/evidence/PrivateDetailsEntry';
import {
  errorMessages,
  EVIDENCE_PRIVATE_DETAILS_URL,
  NO_ISSUES_SELECTED,
} from '../../../constants';
import {
  clickAddAnother,
  clickBack,
  clickContinue,
} from '../../unit-test-helpers';
import { parseDateWithOffset } from '../../../../shared/utils/dates';
import { SELECTED, MAX_YEARS_PAST } from '../../../../shared/constants';
import sharedErrorMessages from '../../../../shared/content/errorMessages';

/*
| Data     | Forward     | Back               | Add another      |
|----------|-------------|--------------------|------------------|
| Complete | Next page   | Prev page          | New page (empty) |
| Empty    | Focus error | Prev page & remove | Focus error      |
| Partial  | Focus error | Modal & Prev page  | Focus error      |
 */
describe('<PrivateDetailsEntry>', () => {
  const validDate = parseDateWithOffset({ months: -2 });
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
      <PrivateDetailsEntry
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
        'va-date[error]',
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
    expect($$('va-checkbox', container).length).to.eq(0);
    expect($$('va-memorable-date', container).length).to.eq(2);
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
      clickContinue(container);
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
      clickBack(container);
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
      await clickAddAnother(container);

      waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(
          goSpy.calledWith(
            `/${EVIDENCE_PRIVATE_DETAILS_URL}?index=${index + 1}`,
          ),
        ).to.be.true;
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
      await clickAddAnother(container);

      waitFor(async () => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(
          goSpy.calledWith(
            `/${EVIDENCE_PRIVATE_DETAILS_URL}?index=${index + 1}`,
          ),
        ).to.be.true;
      });
    });
  });

  // *** EMPTY PAGE ***
  describe('empty page navigation', () => {
    const getAndTestAllErrors = async (container, options = {}) => {
      const errors = errorMessages.evidence;
      const errorEls = await getErrorElements(container);
      [
        errors.facilityMissing,
        options.ignoreCountry ? null : sharedErrorMessages.country, // default set to USA
        sharedErrorMessages.street,
        sharedErrorMessages.city,
        sharedErrorMessages.state,
        sharedErrorMessages.postal,
        errors.issuesMissing,
        errors.blankDate,
        errors.blankDate,
      ]
        .filter(Boolean)
        .forEach((error, index) => {
          expect(errorEls[index]?.error).to.eq(error);
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
      await clickContinue(container);

      waitFor(async () => {
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
      const page = setup({ index, goBack: goSpy, goToPath: goSpy });
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
      const data = { ...mockData, providerFacility: [mockFacility, {}] };
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
      clickAddAnother(container);

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

      waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
      });
    });
  });

  describe('partial/invalid data navigation', () => {
    let focusElementSpy;
    beforeEach(() => {
      focusElementSpy = sinon.stub(focusUtils, 'focusElement');
    });
    afterEach(() => {
      focusElementSpy.restore();
    });

    const testAndCloseModal = (container, total, event) =>
      // modal visible
      waitFor(() => {
        expect($('va-modal[visible="true"]', container)).to.exist;
      })
        .then(() => {
          expect(getErrorElements(container).length).to.eq(total);
          // close modal
          $('va-modal').__events[event]();
        })
        .finally(() => {
          expect($('va-modal[visible="false"]', container)).to.exist;
        });

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
      clickContinue(container);

      waitFor(() => {
        expect(goSpy.called).to.be.false;
        expect(focusElementSpy.called).to.be.true;
        expect(focusElementSpy.args[0][0]).to.eq('[role="alert"]');
      }).then(() => {
        expect(getErrorElements(container).length).to.eq(8);
      });
    });

    // *** BACK ***
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
      await clickBack(container);
      // Click no
      testAndCloseModal(container, 8, 'secondaryButtonClick').then(() => {
        expect(setDataSpy.called).to.be.true;
        expect(setDataSpy.lastCall.args[0].providerFacility.length).to.eq(2);
        expect(goSpy.called).to.be.true;
        expect(
          goSpy.calledWith(
            `/${EVIDENCE_PRIVATE_DETAILS_URL}?index=${index - 1}`,
          ),
        ).to.be.true;
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
          providerFacility: [
            mockFacility,
            mockFacility2,
            { providerFacilityName: 'foo' },
          ],
        },
      });
      const { container } = render(page);

      // back
      await clickBack(container);
      // Click yes to keep partial entry
      testAndCloseModal(container, 8, 'primaryButtonClick').then(() => {
        expect(setDataSpy.called).to.be.false; // no data change
        expect(goSpy.called).to.be.true;
        expect(
          goSpy.calledWith(
            `/${EVIDENCE_PRIVATE_DETAILS_URL}?index=${index - 1}`,
          ),
        ).to.be.true;
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
      clickAddAnother(container);

      waitFor(async () => {
        expect(goSpy.called).to.be.false;
        expect(focusElementSpy.called).to.be.true;
        expect(focusElementSpy.args[0][0]).to.eq('[role="alert"]');
      }).then(() => {
        expect(getErrorElements(container).length).to.eq(9);
      });
    });
  });

  describe('other errors', () => {
    const fromBlurEvent = new CustomEvent('blur', { detail: 'from' });
    const toBlurEvent = new CustomEvent('blur', { detail: 'to' });

    it('should show error when start treatment date is in the future', async () => {
      const from = parseDateWithOffset({ years: 1 });
      const data = {
        ...mockData,
        providerFacility: [{ treatmentDateRange: { from } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      const dateFrom = await $('va-memorable-date', container);
      // blur date from input
      await $('va-memorable-date').__events.dateBlur(fromBlurEvent);

      waitFor(async () => {
        expect(dateFrom.error).to.contain(errorMessages.evidence.pastDate);
        expect(dateFrom.invalidMonth).to.be.false;
        expect(dateFrom.invalidDay).to.be.false;
        expect(dateFrom.invalidYear).to.be.true;
      });
    });

    it('should show error when last treatment date is in the future', async () => {
      const to = parseDateWithOffset({ years: 1 });
      const data = {
        ...mockData,
        providerFacility: [{ treatmentDateRange: { to } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date to input
      await $('va-memorable-date').__events.dateBlur(toBlurEvent);

      waitFor(async () => {
        const dateTo = await $$('va-memorable-date', container)[1];
        expect(dateTo.error).to.contain(errorMessages.evidence.pastDate);
        expect(dateTo.invalidMonth).to.be.false;
        expect(dateTo.invalidDay).to.be.false;
        expect(dateTo.invalidYear).to.be.true;
      });
    });

    it('should show an error when the start treatment date is too far in the past', async () => {
      const from = parseDateWithOffset({ years: -(MAX_YEARS_PAST + 1) });
      const data = {
        ...mockData,
        providerFacility: [{ treatmentDateRange: { from } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date from input
      await $('va-memorable-date').__events.dateBlur(fromBlurEvent);

      waitFor(async () => {
        const dateFrom = await $('va-memorable-date', container);
        expect(dateFrom.error).to.contain(errorMessages.evidence.newerDate);
        expect(dateFrom.invalidMonth).to.be.false;
        expect(dateFrom.invalidDay).to.be.false;
        expect(dateFrom.invalidYear).to.be.true;
      });
    });

    it('should show an error when the last treatment date is too far in the past', async () => {
      const to = parseDateWithOffset({ years: -(MAX_YEARS_PAST + 1) });
      const data = {
        ...mockData,
        providerFacility: [{ treatmentDateRange: { to } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date to input
      await $('va-memorable-date').__events.dateBlur(toBlurEvent);

      waitFor(async () => {
        const dateTo = await $$('va-memorable-date', container)?.[1];
        expect(dateTo.error).to.contain(errorMessages.evidence.newerDate);
        expect(dateTo.invalidMonth).to.be.false;
        expect(dateTo.invalidDay).to.be.false;
        expect(dateTo.invalidYear).to.be.true;
      });
    });

    it('should show an error when the last treatment date is before the start', async () => {
      const from = parseDateWithOffset({ years: -5 });
      const to = parseDateWithOffset({ years: -10 });
      const data = {
        ...mockData,
        providerFacility: [{ treatmentDateRange: { from, to } }],
      };
      const page = setup({ index: 0, data });
      const { container } = render(page);

      // blur date to input
      await $('va-memorable-date').__events.dateBlur(toBlurEvent);

      waitFor(async () => {
        const dateTo = await $$('va-memorable-date', container)?.[1];
        expect(dateTo.error).to.contain(sharedErrorMessages.endDateBeforeStart);
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
      await fireEvent.blur(input);

      expect(input.error).to.contain(errorMessages.evidence.uniquePrivate);
    });

    it('should show no contestable issues were selected message', () => {
      const data = { data: { contestedIssues: [], additionalIssues: [] } };
      const { container } = render(setup(data));
      expect($$('p', container)[2].textContent).to.contain(NO_ISSUES_SELECTED);
    });
  });
});
