import { expect } from 'chai';
import sinon from 'sinon';
import {
  parseDateToDateObj,
  endDate,
  currency,
  setFocus,
  getDebtPageTitle,
} from '../utils';

describe('Dispute Debt Utils', () => {
  describe('parseDateToDateObj', () => {
    it('should parse ISO8601 date string with T', () => {
      const result = parseDateToDateObj('2023-10-15T10:30:00.000Z');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2023);
      expect(result.getMonth()).to.equal(9); // October is month 9
      expect(result.getDate()).to.equal(15);
    });

    it('should parse date string with template', () => {
      const result = parseDateToDateObj('10/15/2023', 'MM/dd/yyyy');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2023);
      expect(result.getMonth()).to.equal(9);
      expect(result.getDate()).to.equal(15);
    });

    it('should handle Date object input', () => {
      const inputDate = new Date('2023-10-15');
      const result = parseDateToDateObj(inputDate);
      expect(result).to.be.instanceOf(Date);
    });

    it('should return null for invalid date string', () => {
      const result = parseDateToDateObj('invalid-date');
      expect(result).to.be.null;
    });

    it('should return null for empty string', () => {
      const result = parseDateToDateObj('');
      expect(result).to.be.null;
    });

    it('should handle null input', () => {
      const result = parseDateToDateObj(null);
      expect(result).to.be.null;
    });

    it('should handle undefined input', () => {
      const result = parseDateToDateObj(undefined);
      expect(result).to.be.null;
    });

    it('should return null for simple date string without template', () => {
      const result = parseDateToDateObj('2023-10-15');
      expect(result).to.be.null;
    });
  });

  describe('endDate', () => {
    it('should format end date correctly for valid date', () => {
      const result = endDate('2023-10-15', 60);
      expect(result).to.be.a('string');
      expect(result).to.include('2023');
      expect(result).to.include('December'); // 60 days from Oct 15
    });

    it('should return empty string for invalid date', () => {
      const result = endDate('invalid-date', 30);
      expect(result).to.equal('');
    });

    it('should return formatted date for null date (treated as epoch)', () => {
      const result = endDate(null, 30);
      expect(result).to.be.a('string');
      expect(result).to.include('January');
    });

    it('should handle zero days', () => {
      const result = endDate('2023-10-15', 0);
      expect(result).to.be.a('string');
      expect(result).to.include('October');
    });

    it('should handle negative days', () => {
      const result = endDate('2023-10-15', -10);
      expect(result).to.be.a('string');
      expect(result).to.include('October');
    });
  });

  describe('currency', () => {
    it('should format positive number correctly', () => {
      const result = currency(1234.56);
      expect(result).to.equal('$1,234.56');
    });

    it('should format negative number correctly', () => {
      const result = currency(-789.25);
      expect(result).to.equal('-$789.25');
    });

    it('should format zero correctly', () => {
      const result = currency(0);
      expect(result).to.equal('$0.00');
    });

    it('should parse and format currency string', () => {
      const result = currency('$1,500.75');
      expect(result).to.equal('$1,500.75');
    });

    it('should handle string with non-numeric characters', () => {
      const result = currency('abc$1,234.56def');
      expect(result).to.equal('$1,234.56');
    });

    it('should handle empty string', () => {
      const result = currency('');
      expect(result).to.equal('$NaN');
    });

    it('should handle null input', () => {
      const result = currency(null);
      expect(result).to.equal('$0.00');
    });

    it('should handle undefined input', () => {
      const result = currency(undefined);
      expect(result).to.equal('$0.00');
    });

    it('should handle string with only numbers', () => {
      const result = currency('1234.56');
      expect(result).to.equal('$1,234.56');
    });

    it('should handle decimal numbers', () => {
      const result = currency(0.99);
      expect(result).to.equal('$0.99');
    });
  });

  describe('setFocus', () => {
    afterEach(() => {
      // Clean up any elements added to the DOM
      const testElements = document.querySelectorAll('[data-test-element]');
      testElements.forEach(el => el.remove());
    });

    it('should set focus on element by selector string', () => {
      const el = document.createElement('input');
      el.setAttribute('data-test-element', 'true');
      el.id = 'test-input';
      document.body.appendChild(el);

      const spy = sinon.spy(el, 'focus');
      setFocus('#test-input');

      expect(spy.calledOnce).to.be.true;
      expect(el.getAttribute('tabIndex')).to.equal('-1');
      spy.restore();
    });

    it('should set focus on element object', () => {
      const el = document.createElement('input');
      el.setAttribute('data-test-element', 'true');
      document.body.appendChild(el);

      const spy = sinon.spy(el, 'focus');
      setFocus(el);

      expect(spy.calledOnce).to.be.true;
      expect(el.getAttribute('tabIndex')).to.equal('-1');
      spy.restore();
    });

    it('should handle non-existent selector gracefully', () => {
      // Should not throw an error
      expect(() => setFocus('#non-existent-element')).to.not.throw();
    });

    it('should handle null element gracefully', () => {
      expect(() => setFocus(null)).to.not.throw();
    });

    it('should handle undefined element gracefully', () => {
      expect(() => setFocus(undefined)).to.not.throw();
    });
  });

  describe('getDebtPageTitle', () => {
    it('should return title with debt label when available', () => {
      const formData = {
        selectedDebts: [
          { label: 'Education Debt' },
          { label: 'Compensation Debt' },
        ],
      };
      const options = { pagePerItemIndex: 0 };

      const result = getDebtPageTitle(formData, options);
      expect(result).to.equal('Debt 1 of 2: Education Debt');
    });

    it('should construct title from debt properties when no label', () => {
      const formData = {
        selectedDebts: [
          {
            currentAr: 1500.75,
            deductionCode: '30',
          },
        ],
      };
      const options = { pagePerItemIndex: 0 };

      const result = getDebtPageTitle(formData, options);
      expect(result).to.include('Debt 1 of 1');
      expect(result).to.include('$1,500.75');
      expect(result).to.include(
        'Disability compensation and pension overpayment',
      );
    });

    it('should use originalAr when currentAr not available', () => {
      const formData = {
        selectedDebts: [
          {
            originalAr: 2000.0,
            deductionCode: '44',
          },
        ],
      };
      const options = { pagePerItemIndex: 0 };

      const result = getDebtPageTitle(formData, options);
      expect(result).to.include('$2,000.00');
      expect(result).to.include('Chapter 35 education overpayment');
    });

    it('should handle unknown deduction code', () => {
      const formData = {
        selectedDebts: [
          {
            currentAr: 500,
            deductionCode: '99', // Unknown code
          },
        ],
      };
      const options = { pagePerItemIndex: 0 };

      const result = getDebtPageTitle(formData, options);
      expect(result).to.include('VA debt');
    });

    it('should handle missing debt at index', () => {
      const formData = {
        selectedDebts: [{ label: 'Test Debt' }],
      };
      const options = { pagePerItemIndex: 5 }; // Index out of bounds

      const result = getDebtPageTitle(formData, options);
      expect(result).to.equal('Debt 6 of 1');
    });

    it('should handle empty selectedDebts array', () => {
      const formData = { selectedDebts: [] };
      const options = { pagePerItemIndex: 0 };

      const result = getDebtPageTitle(formData, options);
      expect(result).to.equal('Debt 1 of 0');
    });

    it('should handle missing formData', () => {
      const result = getDebtPageTitle(null, { pagePerItemIndex: 0 });
      expect(result).to.equal('Debt 1 of 0');
    });

    it('should handle missing options', () => {
      const formData = {
        selectedDebts: [{ label: 'Test Debt' }],
      };

      const result = getDebtPageTitle(formData);
      expect(result).to.include('Debt NaN of 1');
    });

    it('should handle zero amount debt', () => {
      const formData = {
        selectedDebts: [
          {
            currentAr: 0,
            deductionCode: '30',
          },
        ],
      };
      const options = { pagePerItemIndex: 0 };

      const result = getDebtPageTitle(formData, options);
      expect(result).to.include('$0.00');
    });

    it('should handle multiple debts with correct numbering', () => {
      const formData = {
        selectedDebts: [
          { label: 'First Debt' },
          { label: 'Second Debt' },
          { label: 'Third Debt' },
        ],
      };

      expect(getDebtPageTitle(formData, { pagePerItemIndex: 0 })).to.equal(
        'Debt 1 of 3: First Debt',
      );
      expect(getDebtPageTitle(formData, { pagePerItemIndex: 1 })).to.equal(
        'Debt 2 of 3: Second Debt',
      );
      expect(getDebtPageTitle(formData, { pagePerItemIndex: 2 })).to.equal(
        'Debt 3 of 3: Third Debt',
      );
    });
  });
});
