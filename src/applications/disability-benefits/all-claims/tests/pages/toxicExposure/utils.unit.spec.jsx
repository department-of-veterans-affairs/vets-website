import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  makeDateConfirmationField,
  monthYearDateSchemaWithFullDateSupport,
  ForceFieldBlur,
} from '../../../pages/toxicExposure/utils';

describe('toxic exposure utils', () => {
  describe('monthYearDateSchemaWithFullDateSupport', () => {
    const { pattern } = monthYearDateSchemaWithFullDateSupport;
    const re = () => new RegExp(pattern);

    it('has type string and a pattern', () => {
      expect(monthYearDateSchemaWithFullDateSupport).to.have.property(
        'type',
        'string',
      );
      expect(monthYearDateSchemaWithFullDateSupport).to.have.property(
        'pattern',
      );
      expect(pattern).to.be.a('string');
    });

    it('pattern accepts valid date formats', () => {
      expect(re().test('2023-01')).to.be.true;
      expect(re().test('2023-XX')).to.be.true;
      expect(re().test('2023-01-15')).to.be.true;
      expect(re().test('XXXX-XX')).to.be.true;
    });

    it('pattern rejects invalid formats', () => {
      expect(re().test('')).to.be.false;
      expect(re().test('2023')).to.be.false;
      expect(re().test('2023-00')).to.be.false;
      expect(re().test('2023-13')).to.be.false;
      expect(re().test('2023-01-XX')).to.be.false;
      expect(re().test('invalid')).to.be.false;
    });
  });

  describe('makeDateConfirmationField', () => {
    const testLabel = 'Service start date (approximate)';
    const confirmationField = makeDateConfirmationField(testLabel);

    it('returns an object with data and label', () => {
      const result = confirmationField({ formData: '2020-06' });
      expect(result).to.have.keys('data', 'label');
      expect(result.label).to.equal(testLabel);
    });

    it('formats valid date formats for confirmation display', () => {
      expect(confirmationField({ formData: '2023-01' }).data).to.equal(
        'January 2023',
      );
      expect(confirmationField({ formData: '2020-12-XX' }).data).to.equal(
        'December 2020',
      );
      expect(confirmationField({ formData: '2000-05-15' }).data).to.equal(
        'May 2000',
      );
      expect(confirmationField({ formData: '2015-XX' }).data).to.equal('2015');
      expect(confirmationField({ formData: '2010-XX-XX' }).data).to.equal(
        '2010',
      );
    });

    it('displays "Unknown" for missing, empty, invalid, or wrong-type input', () => {
      expect(confirmationField({ formData: null }).data).to.equal('Unknown');
      expect(confirmationField({ formData: '' }).data).to.equal('Unknown');
      expect(confirmationField({ formData: 'invalid' }).data).to.equal(
        'Unknown',
      );
      expect(confirmationField({ formData: 123 }).data).to.equal('Unknown');
      expect(confirmationField({}).data).to.equal('Unknown');
    });

    it('uses the label passed to the factory', () => {
      const customLabel = 'Exposure start date (approximate)';
      const customField = makeDateConfirmationField(customLabel);
      const result = customField({ formData: '1999-03' });
      expect(result.label).to.equal(customLabel);
      expect(result.data).to.equal('March 1999');
    });
  });

  describe('ForceFieldBlur', () => {
    it('is a function (React component)', () => {
      expect(ForceFieldBlur).to.be.a('function');
    });

    it('renders null', () => {
      const { container } = render(<ForceFieldBlur />);
      expect(container.firstChild).to.be.null;
    });
  });
});
