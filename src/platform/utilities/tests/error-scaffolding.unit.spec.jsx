import { expect } from 'chai';

import {
  isSupportedVaElement,
  getErrorPropText,
  collectAllErrorElements,
  findFocusTarget,
  addErrorAnnotations,
  cleanupErrorAnnotations,
} from '../scroll/error-scaffolding';

describe('error-scaffolding', () => {
  let container;

  const createVaElementWithShadowRoot = (tagName, { label, error } = {}) => {
    const element = document.createElement(tagName);
    if (label) element.setAttribute('label', label);
    if (error) element.setAttribute('error', error);
    const shadowRoot = element.attachShadow({ mode: 'open' });
    return { element, shadowRoot };
  };

  const createVaTextInput = ({ label, error, describedBy } = {}) => {
    const { element: textInput, shadowRoot } = createVaElementWithShadowRoot(
      'va-text-input',
      { label, error },
    );
    const input = document.createElement('input');
    if (describedBy) input.setAttribute('aria-describedby', describedBy);
    shadowRoot.appendChild(input);

    return { textInput, shadowRoot, input };
  };

  const createVaRadioOption = ({ label, error, describedBy } = {}) => {
    const { element: option, shadowRoot } = createVaElementWithShadowRoot(
      'va-radio-option',
      { label, error },
    );
    const input = document.createElement('input');
    input.type = 'radio';
    if (describedBy) input.setAttribute('aria-describedby', describedBy);
    shadowRoot.appendChild(input);

    return { option, shadowRoot, input };
  };

  const createVaDateWithErrorMessage = ({
    message,
    error,
    describedBy,
  } = {}) => {
    const { element: vaDate, shadowRoot } = createVaElementWithShadowRoot(
      'va-date',
      { error },
    );
    if (describedBy) vaDate.setAttribute('aria-describedby', describedBy);
    const errorSpan = document.createElement('span');
    errorSpan.id = 'error-message';
    errorSpan.textContent = message || '';
    shadowRoot.appendChild(errorSpan);
    return { vaDate, shadowRoot, errorSpan };
  };

  const createDateComponentWithChildren = ({ invalidChildIndex }) => {
    const dateComponent = document.createElement('va-memorable-date');
    const shadowRoot = dateComponent.attachShadow({ mode: 'open' });

    const children = Array.from({ length: 3 }, (_, index) => {
      const child = document.createElement('va-text-input');
      if (index === invalidChildIndex) {
        child.setAttribute('invalid', 'true');
      }
      shadowRoot.appendChild(child);
      return child;
    });

    return { dateComponent, shadowRoot, children };
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('isSupportedVaElement', () => {
    it('should return true for representative supported components', () => {
      const representativeSupported = [
        'va-text-input',
        'va-statement-of-truth',
        'va-radio',
        'va-date',
      ];

      representativeSupported.forEach(tagName => {
        const element = document.createElement(tagName);
        expect(isSupportedVaElement(element)).to.be.true;
      });
    });

    it('should return false for unsupported elements', () => {
      const div = document.createElement('div');
      const input = document.createElement('input');
      const customElement = document.createElement('custom-element');

      expect(isSupportedVaElement(div)).to.be.false;
      expect(isSupportedVaElement(input)).to.be.false;
      expect(isSupportedVaElement(customElement)).to.be.false;
    });
  });

  describe('getErrorPropText', () => {
    const cases = [
      {
        title: 'error prop',
        tagName: 'va-text-input',
        setup: el => el.setAttribute('error', 'This field is required'),
        expected: 'This field is required',
      },
      {
        title: 'input-error attribute',
        tagName: 'va-statement-of-truth',
        setup: el => el.setAttribute('input-error', 'This field is required'),
        expected: 'This field is required',
      },
      {
        title: 'checkbox-error attribute',
        tagName: 'va-statement-of-truth',
        setup: el =>
          el.setAttribute('checkbox-error', 'Select at least one option'),
        expected: 'Select at least one option',
      },
      {
        title: 'date #error-message span',
        element: createVaDateWithErrorMessage({
          message: 'Please provide a valid date',
        }).vaDate,
        expected: 'Please provide a valid date',
      },
      {
        title: 'generated-error attribute',
        tagName: 'va-radio-option',
        setup: el => el.setAttribute('generated-error', 'Generated error text'),
        expected: 'Generated error text',
      },
      {
        title: 'no error present',
        tagName: 'va-text-input',
        expected: '',
      },
    ];

    cases.forEach(({ title, tagName, setup, element, expected }) => {
      it(`should read error message from ${title}`, () => {
        const el = element || document.createElement(tagName);
        if (setup) setup(el);
        expect(getErrorPropText(el)).to.equal(expected);
      });
    });
  });

  describe('findFocusTarget - Direct Components', () => {
    it('should return shadow input for va-text-input', () => {
      const { textInput, input } = createVaTextInput();

      const focusTarget = findFocusTarget(textInput);
      expect(focusTarget).to.equal(input);
    });
  });

  describe('findFocusTarget - Date Components', () => {
    it('should return first invalid child for date component when field-level error on first element', () => {
      const { dateComponent, children } = createDateComponentWithChildren({
        invalidChildIndex: 0,
      });

      const focusTarget = findFocusTarget(dateComponent);
      expect(focusTarget).to.equal(children[0]);
    });

    it('should return first invalid child for date component when field-level error on second element', () => {
      const { dateComponent, children } = createDateComponentWithChildren({
        invalidChildIndex: 1,
      });

      const focusTarget = findFocusTarget(dateComponent);
      expect(focusTarget).to.equal(children[1]);
    });

    it('should return first child for date component with cross-field validation error', () => {
      const { dateComponent, children } = createDateComponentWithChildren({});

      const focusTarget = findFocusTarget(dateComponent);
      expect(focusTarget).to.equal(children[0]);
    });
  });

  describe('findFocusTarget - Group Components', () => {
    it('should return input inside first radio option for va-radio', () => {
      const radio = document.createElement('va-radio');
      const { option: option1, input: input1 } = createVaRadioOption();
      const { option: option2 } = createVaRadioOption();

      radio.appendChild(option1);
      radio.appendChild(option2);
      container.appendChild(radio);

      const focusTarget = findFocusTarget(radio);
      expect(focusTarget).to.equal(input1);
    });
  });

  describe('Direct Component Error Annotations', () => {
    it('should create error label for va-text-input', () => {
      const { textInput, shadowRoot, input } = createVaTextInput({
        label: 'First name',
        error: 'This field is required',
        describedBy: 'hint-text',
      });

      container.appendChild(textInput);

      addErrorAnnotations(textInput);

      const labelId = input.getAttribute('aria-labelledby');
      expect(labelId).to.not.be.null;
      expect(shadowRoot.querySelector(`#${labelId}`)).to.exist;

      const errorLabel = shadowRoot.querySelector(`#${labelId}`);
      expect(errorLabel.textContent).to.include('This field is required');
      expect(errorLabel.textContent).to.include('First name');
      // aria-describedby should be removed for direct components
      expect(input.hasAttribute('aria-describedby')).to.be.false;
    });
  });

  describe('Date Component Error Annotations', () => {
    it('should create error labels for all children in cross-field validation', () => {
      const { vaDate, shadowRoot } = createVaDateWithErrorMessage({
        error: 'required',
        message: 'To date must be after from date',
      });

      const {
        textInput: monthField,
        shadowRoot: monthShadow,
        input: monthInput,
      } = createVaTextInput({ label: 'Month' });
      const {
        textInput: dayField,
        shadowRoot: dayShadow,
        input: dayInput,
      } = createVaTextInput({ label: 'Day' });
      const {
        textInput: yearField,
        shadowRoot: yearShadow,
        input: yearNativeInput,
      } = createVaTextInput({ label: 'Year' });

      shadowRoot.appendChild(monthField);
      shadowRoot.appendChild(dayField);
      shadowRoot.appendChild(yearField);

      container.appendChild(vaDate);

      addErrorAnnotations(vaDate);

      // All children should have error labels
      const monthLabelId = monthInput.getAttribute('aria-labelledby');
      const dayLabelId = dayInput.getAttribute('aria-labelledby');
      const yearLabelId = yearNativeInput.getAttribute('aria-labelledby');

      expect(monthLabelId).to.not.be.null;
      expect(dayLabelId).to.not.be.null;
      expect(yearLabelId).to.not.be.null;

      // Labels should exist in shadow roots
      expect(monthShadow.querySelector(`#${monthLabelId}`)).to.exist;
      expect(dayShadow.querySelector(`#${dayLabelId}`)).to.exist;
      expect(yearShadow.querySelector(`#${yearLabelId}`)).to.exist;
    });

    it('should preserve aria-describedby for date children', () => {
      const { vaDate, shadowRoot } = createVaDateWithErrorMessage({
        error: 'required',
        message: 'Date is required',
      });

      const {
        textInput: monthField,
        shadowRoot: monthShadow,
        input: monthInput,
      } = createVaTextInput({
        label: 'Month',
        describedBy: 'input-message',
      });

      const hintSpan = document.createElement('span');
      hintSpan.id = 'input-message';
      hintSpan.textContent = 'Enter month as a number (1-12)';
      monthShadow.appendChild(hintSpan);

      shadowRoot.appendChild(monthField);
      container.appendChild(vaDate);

      addErrorAnnotations(vaDate);

      // aria-describedby should be preserved for date children
      expect(monthInput.getAttribute('aria-describedby')).to.equal(
        'input-message',
      );
    });
  });

  describe('Group Component Error Annotations', () => {
    it('should create error labels for all radio options', () => {
      const radio = document.createElement('va-radio');
      radio.setAttribute('error', 'Select one option');
      radio.setAttribute('label', 'Choose an option');

      const {
        option: option1,
        shadowRoot: option1Shadow,
        input: input1,
      } = createVaRadioOption({
        label: 'Option 1',
        describedBy: 'hint-text',
      });
      const {
        option: option2,
        shadowRoot: option2Shadow,
        input: input2,
      } = createVaRadioOption({
        label: 'Option 2',
        describedBy: 'hint-text',
      });

      radio.appendChild(option1);
      radio.appendChild(option2);
      container.appendChild(radio);

      addErrorAnnotations(radio);

      // Both options should have generated-error attribute
      expect(option1.getAttribute('generated-error')).to.equal(
        'Select one option',
      );
      expect(option2.getAttribute('generated-error')).to.equal(
        'Select one option',
      );

      // Both inputs should have error labels
      const label1Id = input1.getAttribute('aria-labelledby');
      const label2Id = input2.getAttribute('aria-labelledby');

      expect(label1Id).to.not.be.null;
      expect(label2Id).to.not.be.null;
      expect(option1Shadow.querySelector(`#${label1Id}`)).to.exist;
      expect(option2Shadow.querySelector(`#${label2Id}`)).to.exist;

      // aria-describedby should be removed for group options
      expect(input1.hasAttribute('aria-describedby')).to.be.false;
      expect(input2.hasAttribute('aria-describedby')).to.be.false;
    });
  });

  describe('cleanupErrorAnnotations', () => {
    it('should remove error annotations when error is cleared', () => {
      const { textInput, shadowRoot, input } = createVaTextInput({
        label: 'First name',
        error: 'This field is required',
      });

      container.appendChild(textInput);

      // Add error annotations
      addErrorAnnotations(textInput);
      let labelId = input.getAttribute('aria-labelledby');
      expect(labelId).to.not.be.null;
      expect(shadowRoot.querySelector(`#${labelId}`)).to.exist;

      // Clear error and run cleanup
      textInput.removeAttribute('error');
      cleanupErrorAnnotations();

      // Error label should be removed
      labelId = input.getAttribute('aria-labelledby');
      expect(labelId).to.be.null;
      expect(shadowRoot.querySelector('span.usa-sr-only[id^="error-label-"]'))
        .to.not.exist;
    });

    it('should clear generated-error attributes from group options', () => {
      const radio = document.createElement('va-radio');
      radio.setAttribute('error', 'Select one option');

      const option1 = document.createElement('va-radio-option');
      const option2 = document.createElement('va-radio-option');

      radio.appendChild(option1);
      radio.appendChild(option2);
      container.appendChild(radio);

      // Add error annotations
      addErrorAnnotations(radio);
      expect(option1.getAttribute('generated-error')).to.equal(
        'Select one option',
      );
      expect(option2.getAttribute('generated-error')).to.equal(
        'Select one option',
      );

      // Clear error and run cleanup
      radio.removeAttribute('error');
      cleanupErrorAnnotations();

      // generated-error attributes should be removed
      expect(option1.hasAttribute('generated-error')).to.be.false;
      expect(option2.hasAttribute('generated-error')).to.be.false;
    });
  });

  describe('collectAllErrorElements', () => {
    it('should include nested supported VA elements with input-error/checkbox-error inside a shadow root', () => {
      const statementOfTruth = document.createElement('va-statement-of-truth');
      statementOfTruth.setAttribute('error', 'You must accept the statement');
      const statementShadow = statementOfTruth.attachShadow({ mode: 'open' });

      const nestedTextInput = document.createElement('va-text-input');
      nestedTextInput.setAttribute('input-error', 'Invalid input');
      statementShadow.appendChild(nestedTextInput);

      const nestedCheckbox = document.createElement('va-checkbox');
      nestedCheckbox.setAttribute(
        'checkbox-error',
        'Select at least one option',
      );
      statementShadow.appendChild(nestedCheckbox);

      const nestedTextInputWithoutError = document.createElement(
        'va-text-input',
      );
      statementShadow.appendChild(nestedTextInputWithoutError);

      container.appendChild(statementOfTruth);

      const results = collectAllErrorElements('[error]');

      expect(results).to.include(statementOfTruth);
      expect(results).to.include(nestedTextInput);
      expect(results).to.include(nestedCheckbox);
      expect(results).to.not.include(nestedTextInputWithoutError);
    });
  });
});
