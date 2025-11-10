import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as focusUtils from '~/platform/utilities/ui/focus';
import VaDetailsEntry from '../../../components/evidence/VaDetailsEntry';
import {
  errorMessages,
  HAS_VA_EVIDENCE,
  EVIDENCE_VA_DETAILS_URL,
  NO_ISSUES_SELECTED,
} from '../../../constants';
import {
  clickAddAnother,
  clickBack,
  clickContinue,
  verifyHeader,
} from '../../unit-test-helpers';
import { parseDateWithOffset } from '../../../../shared/utils/dates';
import { MAX_LENGTH, SELECTED } from '../../../../shared/constants';
import { records } from '../../data/evidence-records';
import { getProviderDetailsTitle } from '../../../utils/evidence';

const vaLocations = records().locations;

/*
| Data     | Forward     | Back               | Add angit stother      |
|----------|-------------|--------------------|------------------|
| Complete | Next page   | Prev page          | New page (empty) |
| Empty    | Focus error | Prev page & remove | Focus error      |
| Partial  | Focus error | Modal & Prev page  | Focus error      |
 */
describe('VaDetailsEntry', () => {
  let focusElementSpy;

  beforeEach(() => {
    focusElementSpy = sinon.stub(focusUtils, 'focusElement');
  });

  afterEach(() => {
    focusElementSpy.restore();
  });

  const validDate = parseDateWithOffset({ months: -2 });
  const mockData = {
    contestedIssues: [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'Hypertension',
          approxDecisionDate: validDate,
        },
        [SELECTED]: true,
      },
    ],
    additionalIssues: [
      {
        issue: 'Gluten Intolerance',
        decisionDate: validDate,
        [SELECTED]: true,
      },
    ],
    locations: vaLocations,
  };

  const setup = ({
    index = 0,
    data = mockData,
    goBack = () => {},
    goForward = () => {},
    goToPath = () => {},
    setFormData = () => {},
  } = {}) => (
    <VaDetailsEntry
      testingIndex={index}
      data={data}
      goBack={goBack}
      goForward={goForward}
      goToPath={goToPath}
      setFormData={setFormData}
      contentBeforeButtons={<div>before</div>}
      contentAfterButtons={<div>after</div>}
    />
  );

  const getErrorElements = container =>
    $$(
      'va-text-input[error], va-checkbox-group[error], va-date[error], va-memorable-date[error]',
      container,
    );

  it('should render', () => {
    const { container } = render(setup());

    const h3s = $$('h3', container);

    verifyHeader(h3s, 0, getProviderDetailsTitle('add', 1, 'va'));
    expect($('#add-location-name', container)).to.exist;
    expect($('va-checkbox-group', container)).to.exist;
    expect($('va-checkbox[label="Hypertension"]', container)).to.exist;
    expect($('va-checkbox[label="Gluten Intolerance"]', container)).to.exist;
    expect($('va-date', container)).to.exist;
    expect($('va-checkbox[name="nodate"]', container)).to.exist;

    // check Datadog classes
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(2);

    expect($$('va-button', container).length).to.eq(2);
  });

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
      noDate: undefined,
      treatmentDate: '',
    });
  });

  it('should add newly selected issue', async () => {
    const setDataSpy = sinon.spy();
    const page = setup({
      setFormData: setDataSpy,
      data: {
        ...mockData,
        [HAS_VA_EVIDENCE]: true,
        locations: [{ ...vaLocations[0], issues: [] }],
      },
    });
    const { container } = render(page);

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: true, label: 'Hypertension' },
    });

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0].locations[0]).to.deep.equal(vaLocations[0]);
  });

  it('should remove unselected issue', async () => {
    const setDataSpy = sinon.spy();
    const page = setup({
      setFormData: setDataSpy,
      data: {
        ...mockData,
        [HAS_VA_EVIDENCE]: true,
        locations: [vaLocations[1]],
      },
    });

    const { container } = render(page);

    const checkboxGroup = $('va-checkbox-group', container);
    await checkboxGroup.__events.vaChange({
      target: { checked: false, label: 'Gluten Intolerance' },
    });

    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.args[0][0].locations[0]).to.deep.equal({
      ...vaLocations[1],
      issues: ['Hypertension'],
    });
  });

  // *** VALID DATA ***
  describe('valid data navigation', () => {
    it('should navigate forward to VA private request page with valid data (with a date)', async () => {
      const goSpy = sinon.spy();
      const data = {
        ...mockData,
        [HAS_VA_EVIDENCE]: true,
        locations: [vaLocations[0]],
      };

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

    it('should navigate forward to VA private request page with valid data (with no date)', async () => {
      const goSpy = sinon.spy();
      const data = {
        ...mockData,
        [HAS_VA_EVIDENCE]: true,
        locations: [vaLocations[1]],
      };

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

    it('should navigate back to VA records request page with valid data (with a date)', async () => {
      const goSpy = sinon.spy();
      const data = { ...mockData, locations: [vaLocations[0]] };
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

    it('should navigate back to VA records request page with valid data (with no date)', async () => {
      const goSpy = sinon.spy();
      const data = { ...mockData, locations: [vaLocations[1]] };
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
        [HAS_VA_EVIDENCE]: true,
        locations: [vaLocations[0], {}, vaLocations[1]],
      };

      const index = 0;
      const page = setup({
        index,
        goToPath: goSpy,
        data,
      });

      const { container } = render(page);

      // add
      clickAddAnother(container);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(
          goSpy.calledWith(`/${EVIDENCE_VA_DETAILS_URL}?index=${index + 1}`),
        ).to.be.true;
      });
    });

    it('should navigate from zero index, with valid data, to next index when inserting another entry', async () => {
      const goSpy = sinon.spy();
      const locations = [vaLocations[0], vaLocations[1], {}];
      const data = { ...mockData, [HAS_VA_EVIDENCE]: true, locations };
      const index = 0;
      const page = setup({
        index,
        goToPath: goSpy,
        data,
      });
      const { container } = render(page);

      // add
      clickAddAnother(container);

      await waitFor(() => {
        expect($('va-modal[visible="false"]', container)).to.exist;
        expect(
          goSpy.calledWith(`/${EVIDENCE_VA_DETAILS_URL}?index=${index + 1}`),
        ).to.be.true;
      });
    });

    // *** EMPTY PAGE ***
    describe('empty page navigation', () => {
      const getAndTestAllErrors = async container => {
        const errors = errorMessages.evidence;
        const errorEls = await getErrorElements(container);
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
        }).then(() => {
          getAndTestAllErrors(container);
        });
      });

      it('should show & focus on error messages after going forward on an empty second page', async () => {
        const goSpy = sinon.spy();
        const index = 1;
        const data = {
          ...mockData,
          [HAS_VA_EVIDENCE]: true,
          locations: [vaLocations[0], {}, vaLocations[1]],
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
        }).then(() => {
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
        const data = {
          ...mockData,
          [HAS_VA_EVIDENCE]: true,
          locations: [vaLocations[0], {}],
        };
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
          [HAS_VA_EVIDENCE]: true,
          locations: [vaLocations[0], {}, vaLocations[1]],
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
        }).then(() => {
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
        waitFor(() => {
          expect($('va-modal[visible="true"]', container)).to.exist;
        })
          .then(() => {
            // close modal
            $('va-modal').__events[event]();
          })
          .finally(() => {
            expect($('va-modal[visible="false"]', container)).to.exist;
          });
      };

      it('should not navigate, but will show errors after continuing', async () => {
        const goSpy = sinon.spy();
        const index = 1;
        const data = {
          ...mockData,
          [HAS_VA_EVIDENCE]: true,
          locations: [
            vaLocations[0],
            { locationAndName: 'foo' },
            vaLocations[1],
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
        await clickContinue(container);

        waitFor(() => {
          expect(goSpy.called).to.be.false;
          expect(getErrorElements(container).length).to.eq(3);
          expect(focusElementSpy.args[0][0]).to.eq('[role="alert"]');
        });
      });

      // *** BACK ***
      it('should show modal, select "No, remove this location", then navigate back to previous index', async () => {
        const goSpy = sinon.spy();
        const setDataSpy = sinon.spy();
        const index = 1;
        const data = {
          ...mockData,
          [HAS_VA_EVIDENCE]: true,
          locations: [
            vaLocations[0],
            { locationAndName: 'foo' },
            vaLocations[1],
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

        // This check is super-flaky in CI
        waitFor(() => {
          expect(getErrorElements(container).length).to.eq(3);
        });

        testAndCloseModal(container, 'secondaryButtonClick').then(() => {
          expect(setDataSpy.called).to.be.true;
          expect(setDataSpy.lastCall.args[0].locations.length).to.eq(2);
          expect(goSpy.called).to.be.true;
          expect(
            goSpy.calledWith(`/${EVIDENCE_VA_DETAILS_URL}?index=${index - 1}`),
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
            [HAS_VA_EVIDENCE]: true,
            locations: [
              vaLocations[0],
              vaLocations[1],
              { locationAndName: 'foo' },
            ],
          },
        });
        const { container } = render(page);

        // back
        await clickBack(container);

        // This check is super-flaky in CI
        waitFor(() => {
          expect(getErrorElements(container).length).to.eq(3);
        });

        // keep partial entry
        testAndCloseModal(container, 'primaryButtonClick').then(() => {
          expect(setDataSpy.called).to.be.false; // no data change
          expect(goSpy.called).to.be.true;
          expect(
            goSpy.calledWith(`/${EVIDENCE_VA_DETAILS_URL}?index=${index - 1}`),
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
            [HAS_VA_EVIDENCE]: true,
            locations: [vaLocations[0], { locationAndName: 'foo' }],
          },
        });
        const { container } = render(page);

        // add
        await clickAddAnother(container);

        waitFor(() => {
          expect(goSpy.called).to.be.false;
          expect(getErrorElements(container).length).to.eq(3);
          expect(focusElementSpy.args[0][0]).to.eq('[role="alert"]');
        });
      });
    });

    describe('other errors', () => {
      // *** OTHER ERRORS ***
      it('should show error when location name is too long', async () => {
        const name = 'abcdef '.repeat(
          MAX_LENGTH.SC_EVIDENCE_LOCATION_AND_NAME / 6,
        );
        const data = {
          ...mockData,
          [HAS_VA_EVIDENCE]: true,
          locations: [{ locationAndName: name }],
        };
        const page = setup({ index: 0, data });
        const { container } = render(page);

        const input = await $('va-text-input', container);
        await fireEvent.blur(input);

        waitFor(() => {
          expect(input.error).to.contain(
            errorMessages.evidence.locationMaxLength,
          );
        });
      });

      it('should show an error when the issue is not unique', async () => {
        const data = {
          ...mockData,
          [HAS_VA_EVIDENCE]: true,
          locations: [vaLocations[0], vaLocations[0]],
        };
        const page = setup({ index: 1, data });
        const { container } = render(page);

        const input = await $('va-text-input', container);
        await fireEvent.blur(input);

        waitFor(() => {
          expect(input.error).to.contain(errorMessages.evidence.uniqueVA);
        });
      });

      it('should show no contestable issues were selected message', () => {
        const data = { data: { contestedIssues: [], additionalIssues: [] } };
        const { container } = render(setup(data));
        expect($$('p', container)[2].textContent).to.contain(
          NO_ISSUES_SELECTED,
        );
      });

      it('should not move focus after submitting & blurring first input', async () => {
        const goSpy = sinon.spy();
        const index = 1;
        const data = {
          ...mockData,
          [HAS_VA_EVIDENCE]: true,
          locations: [vaLocations[0], {}, vaLocations[1]],
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

        const input = await $('va-text-input', container);
        await fireEvent.blur(input);
        await userEvent.tab(); // ensure focus is not trapped; see #98137

        waitFor(() => {
          expect(getErrorElements(container).length).to.eq(3);
          expect(goSpy.called).to.be.false;
          expect(focusElementSpy.args[0][0]).to.eq('[role="alert"]');
          expect(document.activeElement).to.not.eq(input);
          // focus called one additional time when focus shifts back to the error
          expect(focusElementSpy.args.length).to.be.lessThan(3);
        });
      });
    });
  });
});
