import { expect } from 'chai';
import {
  applyDefaults,
  createConditionalProcessor,
  createFieldProcessor,
  createNestedProcessor,
  formatValue,
  normalizeValue,
  processFormData,
  sanitizeFormData,
  transformBooleans,
  transformDates,
  transformFieldNames,
} from './data-processors';

describe('Data Processors - Form data transformation', () => {
  describe('transformDates', () => {
    it('converts date objects to strings', () => {
      const formData = {
        birthDate: { year: 2000, month: 1, day: 15 },
        otherField: 'value',
      };

      const result = transformDates(formData, ['birthDate']);
      expect(result.birthDate).to.equal('2000-01-15');
      expect(result.otherField).to.equal('value');
    });

    it('handles partial dates', () => {
      const formData = {
        monthYear: { year: 2024, month: 3 },
      };

      const result = transformDates(formData, ['monthYear']);
      expect(result.monthYear).to.equal('2024-03-01');
    });

    it('handle Date objects', () => {
      const date = new Date('2024-06-15T10:30:00');
      const formData = {
        appointmentDate: date,
      };

      const result = transformDates(formData, ['appointmentDate']);
      expect(result.appointmentDate).to.equal('2024-06-15');
    });

    it('use custom formatter when provided', () => {
      const formData = {
        customDate: { year: 2024, month: 6, day: 15 },
      };

      const customFormatter = dateObj =>
        `${dateObj.month}/${dateObj.day}/${dateObj.year}`;
      const result = transformDates(formData, ['customDate'], customFormatter);
      expect(result.customDate).to.equal('6/15/2024');
    });

    it('handle null formData', () => {
      const result = transformDates(null, ['field']);
      expect(result).to.be.null;
    });

    it('skip non-object fields', () => {
      const formData = {
        stringDate: '2024-01-01',
        numberDate: 20240101,
      };

      const result = transformDates(formData, ['stringDate', 'numberDate']);
      expect(result.stringDate).to.equal('2024-01-01');
      expect(result.numberDate).to.equal(20240101);
    });

    it('handle multiple date fields', () => {
      const formData = {
        startDate: { year: 2024, month: 1, day: 1 },
        endDate: { year: 2024, month: 12, day: 31 },
      };

      const result = transformDates(formData, ['startDate', 'endDate']);
      expect(result.startDate).to.equal('2024-01-01');
      expect(result.endDate).to.equal('2024-12-31');
    });

    it('pad single digit months and days', () => {
      const formData = {
        date: { year: 2024, month: 3, day: 5 },
      };

      const result = transformDates(formData, ['date']);
      expect(result.date).to.equal('2024-03-05');
    });
  });

  describe('processFormData', () => {
    it('apply processors in sequence', () => {
      const data = { value: 1 };
      const processors = [
        d => ({ ...d, value: d.value * 2 }),
        d => ({ ...d, value: d.value + 10 }),
        d => ({ ...d, stringValue: String(d.value) }),
      ];

      const result = processFormData(data, processors);
      expect(result.value).to.equal(12);
      expect(result.stringValue).to.equal('12');
    });

    it('handle empty processor array', () => {
      const data = { test: 'value' };
      const result = processFormData(data, []);
      expect(result).to.deep.equal(data);
    });

    it('handle undefined data', () => {
      const processors = [d => ({ ...d, added: true })];
      const result = processFormData(undefined, processors);
      expect(result).to.have.property('added', true);
    });
  });

  describe('createFieldProcessor', () => {
    it('create a processor for specific fields', () => {
      const processor = createFieldProcessor(['field1', 'field2'], val =>
        val.toUpperCase(),
      );
      const data = {
        field1: 'hello',
        field2: 'world',
        field3: 'unchanged',
      };

      const result = processor(data);
      expect(result.field1).to.equal('HELLO');
      expect(result.field2).to.equal('WORLD');
      expect(result.field3).to.equal('unchanged');
    });

    it('handle missing fields', () => {
      const processor = createFieldProcessor(['missing'], val =>
        val.toUpperCase(),
      );
      const data = { existing: 'value' };
      const result = processor(data);
      expect(result).to.deep.equal(data);
    });
  });

  describe('normalizeValue', () => {
    it('remove non-digit characters by default', () => {
      expect(normalizeValue('(555) 123-4567')).to.equal('5551234567');
      expect(normalizeValue('123-45-6789')).to.equal('123456789');
    });

    it('use custom pattern when provided', () => {
      expect(normalizeValue('abc123xyz', /[^0-9]/g)).to.equal('123');
      expect(normalizeValue('Hello World!', /[^a-zA-Z]/g)).to.equal(
        'HelloWorld',
      );
    });

    it('handle empty values', () => {
      expect(normalizeValue('')).to.equal('');
      expect(normalizeValue(null)).to.equal('');
      expect(normalizeValue(undefined)).to.equal('');
    });
  });

  describe('formatValue', () => {
    it('format phone numbers', () => {
      const result = formatValue('5551234567', '(XXX) XXX-XXXX');
      expect(result).to.equal('(555) 123-4567');
    });

    it('format SSN', () => {
      const result = formatValue('123456789', 'XXX-XX-XXXX');
      expect(result).to.equal('123-45-6789');
    });

    it('handle partial values', () => {
      const result = formatValue('555', '(XXX) XXX-XXXX');
      expect(result).to.equal('(555');
    });

    it('handle empty values', () => {
      expect(formatValue('', 'XXX-XXX-XXXX')).to.equal('');
      expect(formatValue('123', '')).to.equal('123');
    });
  });

  describe('transformBooleans', () => {
    it('transform string booleans', () => {
      const data = {
        field1: 'true',
        field2: 'false',
        field3: 'other',
      };

      const result = transformBooleans(data, ['field1', 'field2', 'field3']);
      expect(result.field1).to.be.true;
      expect(result.field2).to.be.false;
      expect(result.field3).to.be.true;
    });

    it('handle actual booleans', () => {
      const data = {
        field1: true,
        field2: false,
      };

      const result = transformBooleans(data, ['field1', 'field2']);
      expect(result.field1).to.be.true;
      expect(result.field2).to.be.false;
    });

    it('handle null formData', () => {
      const result = transformBooleans(null, ['field']);
      expect(result).to.be.null;
    });
  });

  describe('sanitizeFormData', () => {
    it('remove null values by default', () => {
      const data = {
        field1: 'value',
        field2: null,
        field3: 'another',
      };

      const result = sanitizeFormData(data);
      expect(result).to.deep.equal({
        field1: 'value',
        field3: 'another',
      });
    });

    it('remove undefined values by default', () => {
      const data = {
        field1: 'value',
        field2: undefined,
        field3: 'another',
      };

      const result = sanitizeFormData(data);
      expect(result).to.deep.equal({
        field1: 'value',
        field3: 'another',
      });
    });

    it('remove empty strings when option is set', () => {
      const data = {
        field1: 'value',
        field2: '',
        field3: 'another',
      };

      const result = sanitizeFormData(data, { removeEmptyStrings: true });
      expect(result).to.deep.equal({
        field1: 'value',
        field3: 'another',
      });
    });

    it('keep zero and false values', () => {
      const data = {
        number: 0,
        boolean: false,
        string: 'value',
      };

      const result = sanitizeFormData(data);
      expect(result).to.deep.equal(data);
    });

    it('handle nested objects when deep is true', () => {
      const data = {
        field1: 'value',
        nested: {
          keep: 'this',
          remove: null,
        },
      };

      const result = sanitizeFormData(data);
      expect(result.nested).to.deep.equal({
        keep: 'this',
      });
    });

    it('remove empty nested objects', () => {
      const data = {
        field1: 'value',
        nested: {
          remove1: null,
          remove2: undefined,
        },
      };

      const result = sanitizeFormData(data);
      expect(result).to.deep.equal({
        field1: 'value',
      });
    });
  });

  describe('createNestedProcessor', () => {
    it('process nested field', () => {
      const processor = createNestedProcessor('address.zip', val =>
        val.replace('-', ''),
      );
      const data = {
        name: 'John',
        address: {
          zip: '12345-6789',
        },
      };

      const result = processor(data);
      expect(result.address.zip).to.equal('123456789');
      expect(result.name).to.equal('John');
    });

    it('handle missing nested path', () => {
      const processor = createNestedProcessor('missing.path', val =>
        val.toUpperCase(),
      );
      const data = { field: 'value' };
      const result = processor(data);
      expect(result).to.deep.equal(data);
    });

    it('handle deep nesting', () => {
      const processor = createNestedProcessor('a.b.c', val => val * 2);
      const data = {
        a: {
          b: {
            c: 5,
          },
        },
      };

      const result = processor(data);
      expect(result.a.b.c).to.equal(10);
    });
  });

  describe('transformFieldNames', () => {
    it('rename fields based on mapping', () => {
      const data = {
        oldName1: 'value1',
        oldName2: 'value2',
        keepThis: 'value3',
      };

      const mapping = {
        oldName1: 'newName1',
        oldName2: 'newName2',
      };

      const result = transformFieldNames(data, mapping);
      expect(result).to.deep.equal({
        newName1: 'value1',
        newName2: 'value2',
        keepThis: 'value3',
      });
    });

    it('handle empty mapping', () => {
      const data = { field: 'value' };
      const result = transformFieldNames(data, {});
      expect(result).to.deep.equal(data);
    });

    it('handle null data', () => {
      const result = transformFieldNames(null, { old: 'new' });
      expect(result).to.be.null;
    });

    it('ignore mappings for non-existent fields', () => {
      const data = { existing: 'value' };
      const mapping = { nonExistent: 'newName' };
      const result = transformFieldNames(data, mapping);
      expect(result).to.deep.equal(data);
    });
  });

  describe('createConditionalProcessor', () => {
    it('apply true processor when condition is met', () => {
      const processor = createConditionalProcessor(
        data => data.type === 'upper',
        data => ({ ...data, value: data.value.toUpperCase() }),
      );

      const data = { type: 'upper', value: 'hello' };
      const result = processor(data);
      expect(result.value).to.equal('HELLO');
    });

    it('apply false processor when condition is not met', () => {
      const processor = createConditionalProcessor(
        data => data.type === 'upper',
        data => ({ ...data, value: data.value.toUpperCase() }),
        data => ({ ...data, value: data.value.toLowerCase() }),
      );

      const data = { type: 'lower', value: 'HELLO' };
      const result = processor(data);
      expect(result.value).to.equal('hello');
    });

    it('return original data when no false processor and condition is false', () => {
      const processor = createConditionalProcessor(
        data => data.type === 'upper',
        data => ({ ...data, value: data.value.toUpperCase() }),
      );

      const data = { type: 'lower', value: 'hello' };
      const result = processor(data);
      expect(result).to.deep.equal(data);
    });
  });

  describe('applyDefaults', () => {
    it('merge default values for missing fields', () => {
      const data = { existing: 'value' };
      const defaults = {
        existing: 'default',
        missing: 'defaultValue',
      };

      const result = applyDefaults(data, defaults);
      expect(result).to.deep.equal({
        existing: 'value',
        missing: 'defaultValue',
      });
    });

    it('not override existing values', () => {
      const data = { field: 'actual' };
      const defaults = { field: 'default' };
      const result = applyDefaults(data, defaults);
      expect(result.field).to.equal('actual');
    });

    it('handle null and undefined in data', () => {
      const data = { field1: null, field2: undefined };
      const defaults = { field1: 'default1', field2: 'default2' };
      const result = applyDefaults(data, defaults);
      expect(result).to.deep.equal({
        field1: null,
        field2: 'default2',
      });
    });

    it('handle empty defaults', () => {
      const data = { field: 'value' };
      const result = applyDefaults(data, {});
      expect(result).to.deep.equal(data);
    });

    it('handle null data', () => {
      const defaults = { field: 'default' };
      const result = applyDefaults(null, defaults);
      expect(result).to.deep.equal(defaults);
    });
  });
});
