import { expect } from 'chai';
import MockDate from 'mockdate';

import {
  DATE_VALIDATION_TYPE,
  parseDateInput,
  validateReceiptDate,
  validateDescription,
  validateRequestedAmount,
} from '../../util/expense-validation-helpers';

const mockSetExtraFieldErrors = () => {
  const calls = [];
  const fn = updater => {
    const prev = calls.length ? calls[calls.length - 1] : {};
    const next = typeof updater === 'function' ? updater(prev) : updater;
    calls.push(next);
  };
  fn.calls = calls;
  return fn;
};

const mockSetFormState = () => {
  const calls = [];
  const fn = updater => {
    const prev = calls.length ? calls[calls.length - 1] : {};
    const next = typeof updater === 'function' ? updater(prev) : updater;
    calls.push(next);
  };
  fn.calls = calls;
  return fn;
};

describe('parseDateInput', () => {
  it('returns null values when input is falsy', () => {
    expect(parseDateInput(null)).to.deep.equal({
      month: null,
      day: null,
      year: null,
    });
  });

  it('parses YYYY-MM-DD string correctly', () => {
    const result = parseDateInput('2025-01-04');

    expect(result).to.deep.equal({
      month: '01',
      day: '04',
      year: '2025',
    });
  });

  it('trims object input values', () => {
    const result = parseDateInput({
      month: ' 2 ',
      day: ' 5 ',
      year: ' 2024 ',
    });

    expect(result).to.deep.equal({
      month: '2',
      day: '5',
      year: '2024',
    });
  });

  it('returns null for empty object fields', () => {
    const result = parseDateInput({
      month: '',
      day: '',
      year: '',
    });

    expect(result).to.deep.equal({
      month: null,
      day: null,
      year: null,
    });
  });
});

describe('validateReceiptDate', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it('shows required error on SUBMIT when date is empty', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateReceiptDate(
      null,
      DATE_VALIDATION_TYPE.SUBMIT,
      setErrors,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      purchaseDate: 'Enter the date of your receipt',
    });
  });

  it('does not show required error on CHANGE', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateReceiptDate(
      null,
      DATE_VALIDATION_TYPE.CHANGE,
      setErrors,
    );

    expect(isValid).to.be.true;
    expect(setErrors.calls.pop()).to.deep.equal({
      purchaseDate: null,
    });
  });

  it('does not error on partial date', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateReceiptDate(
      { month: '1', day: null, year: null },
      DATE_VALIDATION_TYPE.SUBMIT,
      setErrors,
    );

    expect(isValid).to.be.true;
    expect(setErrors.calls.pop()).to.deep.equal({
      purchaseDate: null,
    });
  });

  it('shows future date error when date is in the future', () => {
    MockDate.set('2025-01-01T00:00:00Z');
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateReceiptDate(
      { month: '12', day: '31', year: '2025' },
      DATE_VALIDATION_TYPE.SUBMIT,
      setErrors,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      purchaseDate: "Don't enter a future date",
    });
  });

  it('passes for a valid past date', () => {
    MockDate.set('2025-01-10T00:00:00Z');
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateReceiptDate(
      '2025-01-01',
      DATE_VALIDATION_TYPE.SUBMIT,
      setErrors,
    );

    expect(isValid).to.be.true;
    expect(setErrors.calls.pop()).to.deep.equal({
      purchaseDate: null,
    });
  });
});

describe('validateDescription', () => {
  it('shows required error on SUBMIT when empty', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateDescription(
      '',
      setErrors,
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      description: 'Enter a description',
    });
  });

  it('shows min length error when too short', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateDescription(
      'abc',
      setErrors,
      DATE_VALIDATION_TYPE.BLUR,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      description: 'Enter at least 5 characters',
    });
  });

  it('shows max length error when too long', () => {
    const setErrors = mockSetExtraFieldErrors();
    const longText = 'a'.repeat(2001);

    const isValid = validateDescription(
      longText,
      setErrors,
      DATE_VALIDATION_TYPE.CHANGE,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      description: 'Enter no more than 2,000 characters',
    });
  });

  it('passes for valid description', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateDescription(
      'Valid description',
      setErrors,
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    expect(isValid).to.be.true;
    expect(setErrors.calls.pop()).to.deep.equal({
      description: null,
    });
  });
});

describe('validateRequestedAmount', () => {
  it('shows required error on SUBMIT when empty', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateRequestedAmount(
      '',
      setErrors,
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      costRequested: 'Enter an amount',
    });
  });

  it('rejects non-numeric input', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateRequestedAmount(
      'abc',
      setErrors,
      DATE_VALIDATION_TYPE.BLUR,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      costRequested: 'Please enter a valid number',
    });
  });

  it('rejects more than 2 decimal places', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateRequestedAmount(
      '1.234',
      setErrors,
      DATE_VALIDATION_TYPE.BLUR,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      costRequested: 'Enter an amount using this format: x.xx',
    });
  });

  it('rejects zero or negative amounts', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateRequestedAmount(
      '0',
      setErrors,
      DATE_VALIDATION_TYPE.BLUR,
    );

    expect(isValid).to.be.false;
    expect(setErrors.calls.pop()).to.deep.equal({
      costRequested: 'Enter an amount greater than 0',
    });
  });

  it('auto-formats amount to 2 decimals on BLUR', () => {
    const setErrors = mockSetExtraFieldErrors();
    const setFormState = mockSetFormState();

    const isValid = validateRequestedAmount(
      '2.5',
      setErrors,
      DATE_VALIDATION_TYPE.BLUR,
      setFormState,
    );

    expect(isValid).to.be.true;
    expect(setFormState.calls.pop()).to.deep.equal({
      costRequested: '2.50',
    });
  });

  it('passes for valid amount without formatting on CHANGE', () => {
    const setErrors = mockSetExtraFieldErrors();

    const isValid = validateRequestedAmount(
      '10.25',
      setErrors,
      DATE_VALIDATION_TYPE.CHANGE,
    );

    expect(isValid).to.be.true;
    expect(setErrors.calls.pop()).to.deep.equal({
      costRequested: null,
    });
  });
});
