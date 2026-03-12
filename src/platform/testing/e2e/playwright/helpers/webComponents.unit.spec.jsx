const { expect } = require('chai');
const sinon = require('sinon');

const {
  shouldAddArrayItem,
  checkWebComponent,
  fillVaTextInput,
  fillVaTextarea,
  selectVaRadioOption,
  selectYesNoVaRadioOption,
  selectVaSelect,
  selectVaCheckbox,
  fillVaMemorableDate,
  fillVaDate,
  fillVaTelephoneInput,
  selectVaComboBox,
  clickVaButtonPairPrimary,
  clickVaButtonPairSecondary,
  fillVaStatementOfTruth,
  enterWebComponentData,
  fillFieldsInVaCardIfNeeded,
  selectArrayBuilderSummaryYesNo,
  clickArrayBuilderSummaryAddButton,
  clickArrayBuilderSummaryAddLink,
  arrayBuilderSummaryContinue,
} = require('./webComponents');

// Minimal mock page builder for unit tests that call page.locator / page.evaluate
function createMockPage(overrides = {}) {
  return {
    locator: sinon.stub(),
    evaluate: sinon.stub(),
    ...overrides,
  };
}

// Builds a chainable locator mock that supports deep chaining
function createMockLocator(overrides = {}) {
  const loc = {
    first: sinon.stub().returnsThis(),
    getAttribute: sinon.stub().resolves(null),
    count: sinon.stub().resolves(0),
    click: sinon.stub().resolves(),
    fill: sinon.stub().resolves(),
    clear: sinon.stub().resolves(),
    selectOption: sinon.stub().resolves(),
    evaluate: sinon.stub().resolves(),
    textContent: sinon.stub().resolves(''),
    press: sinon.stub().resolves(),
    setInputFiles: sinon.stub().resolves(),
    waitFor: sinon.stub().resolves(),
    nth: sinon.stub().returnsThis(),
    locator: sinon.stub(),
    ...overrides,
  };
  // Default: nested locator calls return a chainable mock too
  if (!overrides.locator) {
    loc.locator = sinon.stub().returns(loc);
  }
  return loc;
}

describe('Playwright webComponents helpers (unit)', () => {
  describe('shouldAddArrayItem', () => {
    it('returns override value directly when boolean', async () => {
      const page = createMockPage();
      expect(await shouldAddArrayItem(page, '.sel', true, {})).to.be.true;
      expect(await shouldAddArrayItem(page, '.sel', false, {})).to.be.false;
    });

    it('compares test data array length to card count', async () => {
      const locator = createMockLocator({
        getAttribute: sinon.stub().resolves('items'),
        count: sinon.stub().resolves(1),
      });

      const page = createMockPage({
        locator: sinon.stub(),
      });

      // First call for selector → returns element with data-array-path
      page.locator.withArgs('.sel').returns(locator);
      // Second call for va-card count
      page.locator.withArgs('va-card').returns({
        count: sinon.stub().resolves(1),
      });

      const testData = { items: [{ a: 1 }, { b: 2 }, { c: 3 }] };
      const result = await shouldAddArrayItem(
        page,
        '.sel',
        undefined,
        testData,
      );
      // 3 items in data, 1 card on page → should add
      expect(result).to.be.true;
    });

    it('returns false when cards match data length', async () => {
      const locator = createMockLocator({
        getAttribute: sinon.stub().resolves('items'),
        count: sinon.stub().resolves(2),
      });

      const page = createMockPage({
        locator: sinon.stub(),
      });
      page.locator.withArgs('.sel').returns(locator);
      page.locator.withArgs('va-card').returns({
        count: sinon.stub().resolves(2),
      });

      const testData = { items: [{ a: 1 }, { b: 2 }] };
      const result = await shouldAddArrayItem(
        page,
        '.sel',
        undefined,
        testData,
      );
      expect(result).to.be.false;
    });

    it('handles nested array paths (e.g. "dependents.children")', async () => {
      // This test verifies the bug: testData[arrayPath] won't work for
      // dotted paths like "dependents.children".
      // lodash.get would resolve "dependents.children" to [1, 2, 3].
      const locator = createMockLocator({
        getAttribute: sinon.stub().resolves('dependents.children'),
        count: sinon.stub().resolves(0),
      });

      const page = createMockPage({
        locator: sinon.stub(),
      });
      page.locator.withArgs('.sel').returns(locator);
      page.locator.withArgs('va-card').returns({
        count: sinon.stub().resolves(0),
      });

      const testData = {
        dependents: { children: [{ name: 'A' }, { name: 'B' }] },
      };

      const result = await shouldAddArrayItem(
        page,
        '.sel',
        undefined,
        testData,
      );
      // With the bug (testData["dependents.children"] === undefined),
      // this returns false. After fix (lodash get), should return true.
      // This test documents the EXPECTED correct behavior:
      expect(result).to.be.true;
    });

    it('returns false when arrayPath is not found', async () => {
      const locator = createMockLocator({
        getAttribute: sinon.stub().resolves(null),
        count: sinon.stub().resolves(0),
      });

      const page = createMockPage({
        locator: sinon.stub(),
      });
      page.locator.withArgs('.sel').returns(locator);

      const result = await shouldAddArrayItem(page, '.sel', undefined, {});
      expect(result).to.be.false;
    });
  });

  describe('checkWebComponent', () => {
    it('calls page.evaluate with web component selectors', async () => {
      const page = createMockPage({
        evaluate: sinon.stub().resolves(true),
      });

      const result = await checkWebComponent(page);
      expect(result).to.be.true;
      expect(page.evaluate.calledOnce).to.be.true;

      // Verify the callback is a function
      const evaluateFn = page.evaluate.firstCall.args[0];
      expect(evaluateFn).to.be.a('function');
    });

    it('returns boolean result from page.evaluate', async () => {
      const page = createMockPage({
        evaluate: sinon.stub().resolves(false),
      });

      const result = await checkWebComponent(page);
      expect(result).to.be.false;
    });
  });

  describe('fillVaTextInput', () => {
    it('fills the inner input with the given value', async () => {
      const innerInput = createMockLocator();
      const vaInput = createMockLocator({
        count: sinon.stub().resolves(1),
        locator: sinon.stub().returns(innerInput),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(vaInput),
      });

      await fillVaTextInput(page, 'firstName', 'John');
      expect(page.locator.calledWith('va-text-input[name="firstName"]')).to.be
        .true;
      expect(innerInput.click.calledOnce).to.be.true;
      expect(innerInput.clear.calledOnce).to.be.true;
      expect(innerInput.fill.calledWith('John')).to.be.true;
    });

    it('skips when value is undefined', async () => {
      const page = createMockPage();
      await fillVaTextInput(page, 'firstName', undefined);
      expect(page.locator.called).to.be.false;
    });

    it('skips when element not found', async () => {
      const vaInput = createMockLocator({ count: sinon.stub().resolves(0) });
      const page = createMockPage({
        locator: sinon.stub().returns(vaInput),
      });
      await fillVaTextInput(page, 'missing', 'x');
      // count is called but fill should not be
      expect(vaInput.count.calledOnce).to.be.true;
    });

    it('converts number values to string', async () => {
      const innerInput = createMockLocator();
      const vaInput = createMockLocator({
        count: sinon.stub().resolves(1),
        locator: sinon.stub().returns(innerInput),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(vaInput),
      });

      await fillVaTextInput(page, 'age', 30);
      expect(innerInput.fill.calledWith('30')).to.be.true;
    });
  });

  describe('fillVaTextarea', () => {
    it('fills the inner textarea', async () => {
      const innerTextarea = createMockLocator();
      const vaTextarea = createMockLocator({
        locator: sinon.stub().returns(innerTextarea),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(vaTextarea),
      });

      await fillVaTextarea(page, 'description', 'Hello world');
      expect(page.locator.calledWith('va-textarea[name="description"]')).to.be
        .true;
      expect(innerTextarea.clear.calledOnce).to.be.true;
      expect(innerTextarea.fill.calledWith('Hello world')).to.be.true;
    });

    it('skips when value is undefined', async () => {
      const page = createMockPage();
      await fillVaTextarea(page, 'desc', undefined);
      expect(page.locator.called).to.be.false;
    });
  });

  describe('selectVaRadioOption', () => {
    it('clicks the radio option with matching name and value', async () => {
      const radioOption = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().returns(radioOption),
      });

      await selectVaRadioOption(page, 'gender', 'male');
      expect(
        page.locator.calledWith('va-radio-option[name="gender"][value="male"]'),
      ).to.be.true;
      expect(radioOption.click.calledOnce).to.be.true;
    });

    it('skips when value is undefined', async () => {
      const page = createMockPage();
      await selectVaRadioOption(page, 'gender', undefined);
      expect(page.locator.called).to.be.false;
    });
  });

  describe('selectYesNoVaRadioOption', () => {
    it('selects Y when value is true', async () => {
      const radioOption = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().returns(radioOption),
      });

      await selectYesNoVaRadioOption(page, 'hasDep', true);
      expect(
        page.locator.calledWith('va-radio-option[name="hasDep"][value="Y"]'),
      ).to.be.true;
    });

    it('selects N when value is false', async () => {
      const radioOption = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().returns(radioOption),
      });

      await selectYesNoVaRadioOption(page, 'hasDep', false);
      expect(
        page.locator.calledWith('va-radio-option[name="hasDep"][value="N"]'),
      ).to.be.true;
    });
  });

  describe('selectVaSelect', () => {
    it('selects the option value', async () => {
      const innerSelect = createMockLocator();
      const vaSelect = createMockLocator({
        count: sinon.stub().resolves(1),
        locator: sinon.stub().returns(innerSelect),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(vaSelect),
      });

      await selectVaSelect(page, 'country', 'USA');
      expect(innerSelect.selectOption.calledWith('USA')).to.be.true;
    });

    it('skips when element not found', async () => {
      const vaSelect = createMockLocator({ count: sinon.stub().resolves(0) });
      const page = createMockPage({
        locator: sinon.stub().returns(vaSelect),
      });
      await selectVaSelect(page, 'missing', 'x');
      expect(vaSelect.count.calledOnce).to.be.true;
    });
  });

  describe('selectVaCheckbox', () => {
    it('calls evaluate to set checked state', async () => {
      const vaCheckbox = createMockLocator({
        count: sinon.stub().resolves(1),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(vaCheckbox),
      });

      await selectVaCheckbox(page, 'agree', true);
      expect(vaCheckbox.evaluate.calledOnce).to.be.true;
      // Second arg to evaluate should be the boolean
      expect(vaCheckbox.evaluate.firstCall.args[1]).to.be.true;
    });

    it('skips when element not found', async () => {
      const vaCheckbox = createMockLocator({
        count: sinon.stub().resolves(0),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(vaCheckbox),
      });
      await selectVaCheckbox(page, 'missing', true);
      expect(vaCheckbox.evaluate.called).to.be.false;
    });
  });

  describe('fillVaDate', () => {
    it('fills month, day, and year sub-components', async () => {
      const monthSelect = createMockLocator();
      const daySelect = createMockLocator();
      const yearInput = createMockLocator();
      const dateLocator = createMockLocator({
        getAttribute: sinon.stub().resolves(null),
        locator: sinon.stub().callsFake(sel => {
          if (sel.includes('select-month')) return monthSelect;
          if (sel.includes('select-day')) return daySelect;
          if (sel.includes('input-year')) return yearInput;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(dateLocator),
      });

      await fillVaDate(page, 'birthDate', '1990-03-15');
      expect(monthSelect.selectOption.calledWith('3')).to.be.true;
      expect(daySelect.selectOption.calledWith('15')).to.be.true;
      expect(yearInput.fill.calledWith('1990')).to.be.true;
    });

    it('skips day when monthYearOnly is true', async () => {
      const monthSelect = createMockLocator();
      const daySelect = createMockLocator();
      const yearInput = createMockLocator();
      const dateLocator = createMockLocator({
        getAttribute: sinon.stub().resolves(null),
        locator: sinon.stub().callsFake(sel => {
          if (sel.includes('select-month')) return monthSelect;
          if (sel.includes('select-day')) return daySelect;
          if (sel.includes('input-year')) return yearInput;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(dateLocator),
      });

      await fillVaDate(page, 'expiryDate', '2025-06-XX', true);
      expect(monthSelect.selectOption.calledWith('6')).to.be.true;
      expect(daySelect.selectOption.called).to.be.false;
      expect(yearInput.fill.calledWith('2025')).to.be.true;
    });

    it('reads month-year-only attribute when not explicitly passed', async () => {
      const monthSelect = createMockLocator();
      const daySelect = createMockLocator();
      const yearInput = createMockLocator();
      const dateLocator = createMockLocator({
        getAttribute: sinon.stub().resolves('true'),
        locator: sinon.stub().callsFake(sel => {
          if (sel.includes('select-month')) return monthSelect;
          if (sel.includes('select-day')) return daySelect;
          if (sel.includes('input-year')) return yearInput;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(dateLocator),
      });

      await fillVaDate(page, 'date', '2025-06-15');
      expect(daySelect.selectOption.called).to.be.false;
    });
  });

  describe('fillVaMemorableDate', () => {
    it('fills month select, day input, and year input', async () => {
      const monthSelect = createMockLocator();
      const dayInput = createMockLocator();
      const yearInput = createMockLocator();
      const dateLocator = createMockLocator({
        locator: sinon.stub().callsFake(sel => {
          if (sel.includes('month-select')) return monthSelect;
          if (sel.includes('day-input')) return dayInput;
          if (sel.includes('year-input')) return yearInput;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(dateLocator),
      });

      await fillVaMemorableDate(page, 'dob', '1985-07-22', true);
      expect(monthSelect.selectOption.calledWith('7')).to.be.true;
      expect(dayInput.fill.calledWith('22')).to.be.true;
      expect(yearInput.fill.calledWith('1985')).to.be.true;
    });

    it('uses month text input when useMonthSelect is false', async () => {
      const monthInput = createMockLocator();
      const dayInput = createMockLocator();
      const yearInput = createMockLocator();
      const dateLocator = createMockLocator({
        locator: sinon.stub().callsFake(sel => {
          if (sel.includes('month-input')) return monthInput;
          if (sel.includes('day-input')) return dayInput;
          if (sel.includes('year-input')) return yearInput;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(dateLocator),
      });

      await fillVaMemorableDate(page, 'dob', '1985-07-22', false);
      expect(monthInput.fill.calledWith('7')).to.be.true;
    });
  });

  describe('fillVaTelephoneInput', () => {
    it('fills the inner text input with contact value', async () => {
      const innerInput = createMockLocator();
      const telephoneLocator = createMockLocator({
        locator: sinon.stub().returns(innerInput),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(telephoneLocator),
      });

      await fillVaTelephoneInput(page, 'phone', { contact: '5551234567' });
      expect(innerInput.click.calledOnce).to.be.true;
      expect(innerInput.clear.calledOnce).to.be.true;
      expect(innerInput.fill.calledWith('5551234567')).to.be.true;
    });

    it('skips when value is undefined', async () => {
      const page = createMockPage();
      await fillVaTelephoneInput(page, 'phone', undefined);
      expect(page.locator.called).to.be.false;
    });
  });

  describe('selectVaComboBox', () => {
    it('fills input with option text and presses Enter', async () => {
      const innerInput = createMockLocator();
      const optionEl = createMockLocator({
        textContent: sinon.stub().resolves('  United States  '),
      });
      const comboBox = createMockLocator({
        locator: sinon.stub().callsFake(sel => {
          if (sel === 'input') return innerInput;
          if (sel.includes('option')) return optionEl;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(comboBox),
      });

      await selectVaComboBox(page, 'country', 'USA');
      expect(innerInput.click.calledOnce).to.be.true;
      expect(innerInput.clear.calledOnce).to.be.true;
      expect(innerInput.fill.calledWith('United States')).to.be.true;
      expect(innerInput.press.calledWith('Enter')).to.be.true;
    });
  });

  describe('clickVaButtonPairPrimary', () => {
    it('clicks the primary button', async () => {
      const primaryBtn = createMockLocator();
      const buttonPairInner = createMockLocator({
        locator: sinon.stub().returns(primaryBtn),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(buttonPairInner),
      });

      await clickVaButtonPairPrimary(page);
      expect(primaryBtn.click.calledOnce).to.be.true;
    });

    it('scopes by name when provided', async () => {
      const primaryBtn = createMockLocator();
      const buttonPairInner = createMockLocator({
        locator: sinon.stub().returns(primaryBtn),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(buttonPairInner),
      });

      await clickVaButtonPairPrimary(page, 'next');
      expect(page.locator.calledWith('va-button-pair[name="next"]')).to.be.true;
    });
  });

  describe('clickVaButtonPairSecondary', () => {
    it('clicks the secondary/back button', async () => {
      const secondaryBtn = createMockLocator();
      const buttonPairInner = createMockLocator({
        locator: sinon.stub().returns(secondaryBtn),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(buttonPairInner),
      });

      await clickVaButtonPairSecondary(page);
      expect(secondaryBtn.click.calledOnce).to.be.true;
    });
  });

  describe('fillVaStatementOfTruth', () => {
    it('fills name and checks certification', async () => {
      const innerInput = createMockLocator();
      const vaCheckboxLoc = createMockLocator();
      const sot = createMockLocator({
        locator: sinon.stub().callsFake(sel => {
          if (sel === 'va-text-input input') return innerInput;
          if (sel === 'va-checkbox') return vaCheckboxLoc;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(sot),
      });

      await fillVaStatementOfTruth(page, {
        fullName: 'Jane Doe',
        checked: true,
      });
      expect(innerInput.fill.calledWith('Jane Doe')).to.be.true;
      expect(vaCheckboxLoc.evaluate.calledOnce).to.be.true;
    });

    it('scopes by field name when provided', async () => {
      const sot = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().returns(sot),
      });

      await fillVaStatementOfTruth(page, { field: 'cert' });
      expect(page.locator.calledWith('va-statement-of-truth[name="cert"]')).to
        .be.true;
    });
  });

  describe('enterWebComponentData', () => {
    it('dispatches to fillVaTextInput for VA-TEXT-INPUT', async () => {
      const innerInput = createMockLocator();
      const vaInput = createMockLocator({
        count: sinon.stub().resolves(1),
        locator: sinon.stub().returns(innerInput),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(vaInput),
      });

      await enterWebComponentData(page, {
        tagName: 'VA-TEXT-INPUT',
        key: 'name',
        data: 'Alice',
      });
      expect(page.locator.calledWith('va-text-input[name="name"]')).to.be.true;
      expect(innerInput.fill.calledWith('Alice')).to.be.true;
    });

    it('dispatches to selectVaCheckbox for VA-CHECKBOX', async () => {
      const vaCheckbox = createMockLocator({
        count: sinon.stub().resolves(1),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(vaCheckbox),
      });

      await enterWebComponentData(page, {
        tagName: 'VA-CHECKBOX',
        key: 'agree',
        data: true,
      });
      expect(vaCheckbox.evaluate.calledOnce).to.be.true;
    });

    it('dispatches to fillVaDate for VA-DATE', async () => {
      const monthSelect = createMockLocator();
      const daySelect = createMockLocator();
      const yearInput = createMockLocator();
      const dateLocator = createMockLocator({
        getAttribute: sinon.stub().resolves(null),
        locator: sinon.stub().callsFake(sel => {
          if (sel.includes('select-month')) return monthSelect;
          if (sel.includes('select-day')) return daySelect;
          if (sel.includes('input-year')) return yearInput;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(dateLocator),
      });

      await enterWebComponentData(page, {
        tagName: 'VA-DATE',
        key: 'birthDate',
        data: '1990-03-15',
      });
      expect(monthSelect.selectOption.called).to.be.true;
      expect(yearInput.fill.called).to.be.true;
    });

    it('dispatches boolean to selectYesNoVaRadioOption for VA-RADIO-OPTION', async () => {
      const radioOption = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().returns(radioOption),
      });

      await enterWebComponentData(page, {
        tagName: 'VA-RADIO-OPTION',
        key: 'hasDep',
        data: true,
      });
      expect(
        page.locator.calledWith('va-radio-option[name="hasDep"][value="Y"]'),
      ).to.be.true;
    });

    it('dispatches string to selectVaRadioOption for VA-RADIO-OPTION', async () => {
      const radioOption = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().returns(radioOption),
      });

      await enterWebComponentData(page, {
        tagName: 'VA-RADIO-OPTION',
        key: 'status',
        data: 'active',
      });
      expect(
        page.locator.calledWith(
          'va-radio-option[name="status"][value="active"]',
        ),
      ).to.be.true;
    });

    it('dispatches to fillVaMemorableDate with month-select attr for VA-MEMORABLE-DATE', async () => {
      const monthSelect = createMockLocator();
      const dayInput = createMockLocator();
      const yearInput = createMockLocator();
      const memorableDateEl = createMockLocator({
        getAttribute: sinon.stub().resolves('true'),
        locator: sinon.stub().callsFake(sel => {
          if (sel.includes('month-select')) return monthSelect;
          if (sel.includes('day-input')) return dayInput;
          if (sel.includes('year-input')) return yearInput;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(memorableDateEl),
      });

      await enterWebComponentData(page, {
        tagName: 'VA-MEMORABLE-DATE',
        key: 'dob',
        data: '1995-12-25',
      });
      expect(monthSelect.selectOption.called).to.be.true;
    });

    it('reads month-select=false to use text input for VA-MEMORABLE-DATE', async () => {
      const monthInput = createMockLocator();
      const dayInput = createMockLocator();
      const yearInput = createMockLocator();
      const memorableDateEl = createMockLocator({
        getAttribute: sinon.stub().resolves('false'),
        locator: sinon.stub().callsFake(sel => {
          if (sel.includes('month-input')) return monthInput;
          if (sel.includes('day-input')) return dayInput;
          if (sel.includes('year-input')) return yearInput;
          return createMockLocator();
        }),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(memorableDateEl),
      });

      await enterWebComponentData(page, {
        tagName: 'VA-MEMORABLE-DATE',
        key: 'dob',
        data: '1995-12-25',
      });
      expect(monthInput.fill.called).to.be.true;
    });

    it('throws for unknown tag names', async () => {
      const page = createMockPage();
      try {
        await enterWebComponentData(page, {
          tagName: 'VA-UNKNOWN-THING',
          key: 'x',
          data: 'y',
        });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.include('Unknown web component type');
        expect(err.message).to.include('VA-UNKNOWN-THING');
      }
    });
  });

  describe('fillFieldsInVaCardIfNeeded', () => {
    it('fills fields for first item (index 0)', async () => {
      const addBtn = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().returns(addBtn),
      });
      const fillFn = sinon.stub().resolves();

      await fillFieldsInVaCardIfNeeded(page, { name: 'A' }, 0, fillFn, 3);
      expect(fillFn.calledWith({ name: 'A' }, 0)).to.be.true;
      // Not last item, so add button is clicked
      expect(addBtn.click.calledOnce).to.be.true;
    });

    it('clicks add button for non-last items', async () => {
      const addBtn = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(1) });
          if (sel.includes('va-growable')) return addBtn;
          return createMockLocator();
        }),
      });
      const fillFn = sinon.stub().resolves();

      await fillFieldsInVaCardIfNeeded(page, {}, 0, fillFn, 2);
      expect(addBtn.click.calledOnce).to.be.true;
    });

    it('does not click add button for last item', async () => {
      const addBtn = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(1) });
          if (sel.includes('va-growable')) return addBtn;
          return createMockLocator();
        }),
      });
      const fillFn = sinon.stub().resolves();

      // last item (index 2 of 3)
      await fillFieldsInVaCardIfNeeded(page, {}, 2, fillFn, 3);
      expect(addBtn.click.called).to.be.false;
    });
  });

  describe('arrayBuilderSummaryContinue', () => {
    it('selects yes/no radio when pattern exists', async () => {
      const yesNoLocator = createMockLocator({
        count: sinon.stub().resolves(1),
        getAttribute: sinon
          .stub()
          .onFirstCall()
          .resolves('items')
          .onSecondCall()
          .resolves('hasDep'),
      });
      const radioOption = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === '.wc-pattern-array-builder-yes-no') return yesNoLocator;
          if (sel.includes('va-radio-option')) return radioOption;
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(0) });
          return createMockLocator();
        }),
      });

      const result = await arrayBuilderSummaryContinue(
        page,
        { items: [1] },
        true,
      );
      expect(result.abortProcessing).to.be.false;
    });

    it('clicks add button when button pattern exists', async () => {
      const yesNoLocator = createMockLocator({
        count: sinon.stub().resolves(0),
      });
      const buttonLocator = createMockLocator({
        count: sinon.stub().resolves(1),
        getAttribute: sinon.stub().resolves('items'),
      });
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === '.wc-pattern-array-builder-yes-no') return yesNoLocator;
          if (sel === '.wc-pattern-array-builder-summary-add-button')
            return buttonLocator;
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(0) });
          return createMockLocator();
        }),
      });

      const result = await arrayBuilderSummaryContinue(
        page,
        { items: [1] },
        true,
      );
      expect(result.abortProcessing).to.be.true;
      expect(buttonLocator.click.calledOnce).to.be.true;
    });

    it('clicks add link when link pattern exists', async () => {
      const yesNoLocator = createMockLocator({
        count: sinon.stub().resolves(0),
      });
      const buttonLocator = createMockLocator({
        count: sinon.stub().resolves(0),
      });
      const linkLocator = createMockLocator({
        count: sinon.stub().resolves(1),
        getAttribute: sinon.stub().resolves('items'),
      });
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === '.wc-pattern-array-builder-yes-no') return yesNoLocator;
          if (sel === '.wc-pattern-array-builder-summary-add-button')
            return buttonLocator;
          if (sel === '.wc-pattern-array-builder-summary-add-link')
            return linkLocator;
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(0) });
          return createMockLocator();
        }),
      });

      const result = await arrayBuilderSummaryContinue(
        page,
        { items: [1] },
        true,
      );
      expect(result.abortProcessing).to.be.true;
      expect(linkLocator.click.calledOnce).to.be.true;
    });

    it('returns abortProcessing: false when no pattern found', async () => {
      const emptyLocator = createMockLocator({
        count: sinon.stub().resolves(0),
      });
      const page = createMockPage({
        locator: sinon.stub().returns(emptyLocator),
      });

      const result = await arrayBuilderSummaryContinue(page, {});
      expect(result.abortProcessing).to.be.false;
    });
  });

  describe('clickArrayBuilderSummaryAddButton', () => {
    it('returns abortProcessing: true and clicks when shouldAdd', async () => {
      const buttonLocator = createMockLocator({
        count: sinon.stub().resolves(1),
        getAttribute: sinon.stub().resolves('items'),
      });
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === '.wc-pattern-array-builder-summary-add-button')
            return buttonLocator;
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(0) });
          return createMockLocator();
        }),
      });

      const result = await clickArrayBuilderSummaryAddButton(
        page,
        { items: [1] },
        true,
      );
      expect(result.abortProcessing).to.be.true;
      expect(buttonLocator.click.calledOnce).to.be.true;
    });

    it('returns abortProcessing: false when shouldAdd is false', async () => {
      const buttonLocator = createMockLocator({
        getAttribute: sinon.stub().resolves('items'),
      });
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === '.wc-pattern-array-builder-summary-add-button')
            return buttonLocator;
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(0) });
          return createMockLocator();
        }),
      });

      const result = await clickArrayBuilderSummaryAddButton(page, {}, false);
      expect(result.abortProcessing).to.be.false;
    });
  });

  describe('clickArrayBuilderSummaryAddLink', () => {
    it('returns abortProcessing: true and clicks when shouldAdd', async () => {
      const linkLocator = createMockLocator({
        count: sinon.stub().resolves(1),
        getAttribute: sinon.stub().resolves('items'),
      });
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === '.wc-pattern-array-builder-summary-add-link')
            return linkLocator;
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(0) });
          return createMockLocator();
        }),
      });

      const result = await clickArrayBuilderSummaryAddLink(
        page,
        { items: [1] },
        true,
      );
      expect(result.abortProcessing).to.be.true;
    });
  });

  describe('selectArrayBuilderSummaryYesNo', () => {
    it('delegates to selectYesNoVaRadioOption via shouldAddArrayItem', async () => {
      const yesNoLocator = createMockLocator({
        getAttribute: sinon
          .stub()
          .onFirstCall()
          .resolves('items')
          .onSecondCall()
          .resolves('hasDep'),
      });
      const radioOption = createMockLocator();
      const page = createMockPage({
        locator: sinon.stub().callsFake(sel => {
          if (sel === '.wc-pattern-array-builder-yes-no') return yesNoLocator;
          if (sel.includes('va-radio-option')) return radioOption;
          if (sel === 'va-card')
            return createMockLocator({ count: sinon.stub().resolves(0) });
          return createMockLocator();
        }),
      });

      await selectArrayBuilderSummaryYesNo(page, { items: [1] }, true);
      expect(radioOption.click.calledOnce).to.be.true;
    });
  });
});
