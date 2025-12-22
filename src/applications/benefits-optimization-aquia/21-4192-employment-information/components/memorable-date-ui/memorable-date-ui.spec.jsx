/**
 * @module tests/components/memorable-date-ui.spec
 * @description Unit tests for MemorableDateUI component
 * VA Form 21-4192 - Request for Employment Information
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateDate } from 'platform/forms-system/src/js/validation';
import { MemorableDateUI } from './memorable-date-ui';

describe('MemorableDateUI', () => {
  describe('basic functionality', () => {
    it('should return a UI schema object', () => {
      const result = MemorableDateUI({ title: 'Test Date' });

      expect(result).to.be.an('object');
      expect(result).to.have.property('ui:title');
      expect(result).to.have.property('ui:webComponentField');
      expect(result).to.have.property('ui:validations');
      expect(result).to.have.property('ui:errorMessages');
      expect(result).to.have.property('ui:options');
      expect(result).to.have.property('ui:reviewField');
    });

    it('should use VaMemorableDateField as the web component', () => {
      const result = MemorableDateUI({ title: 'Test Date' });

      expect(result['ui:webComponentField']).to.equal(VaMemorableDateField);
    });

    it('should include validateDate in validations', () => {
      const result = MemorableDateUI({ title: 'Test Date' });

      expect(result['ui:validations']).to.be.an('array');
      expect(result['ui:validations']).to.include(validateDate);
    });
  });

  describe('parameter handling', () => {
    it('should accept a string parameter as title', () => {
      const result = MemorableDateUI('My Date Field');

      expect(result['ui:title']).to.equal('My Date Field');
    });

    it('should accept an object parameter with title', () => {
      const result = MemorableDateUI({ title: 'Employment Date' });

      expect(result['ui:title']).to.equal('Employment Date');
    });

    it('should use default title if not provided', () => {
      const result = MemorableDateUI({});

      expect(result['ui:title']).to.equal('Date');
    });
  });

  describe('required field handling', () => {
    it('should set ui:required to true when required is true', () => {
      const result = MemorableDateUI({ title: 'Test Date', required: true });

      expect(result['ui:required']).to.be.true;
    });

    it('should set ui:required to false when required is false', () => {
      const result = MemorableDateUI({ title: 'Test Date', required: false });

      expect(result['ui:required']).to.be.false;
    });

    it('should not set ui:required when not specified', () => {
      const result = MemorableDateUI({ title: 'Test Date' });

      expect(result['ui:required']).to.be.undefined;
    });
  });

  describe('error messages', () => {
    it('should have default error messages', () => {
      const result = MemorableDateUI({ title: 'Test Date' });

      expect(result['ui:errorMessages']).to.deep.equal({
        pattern: 'Please enter a valid date',
        required: 'Please enter a date',
      });
    });

    it('should use custom error messages when provided', () => {
      const result = MemorableDateUI({
        title: 'Test Date',
        errorMessages: {
          pattern: 'Custom pattern error',
          required: 'Custom required error',
        },
      });

      expect(result['ui:errorMessages']).to.deep.equal({
        pattern: 'Custom pattern error',
        required: 'Custom required error',
      });
    });
  });

  describe('ui:options pass-through', () => {
    it('should pass through additional ui options', () => {
      const result = MemorableDateUI({
        title: 'Test Date',
        customOption: 'customValue',
        anotherOption: 123,
      });

      expect(result['ui:options']).to.have.property(
        'customOption',
        'customValue',
      );
      expect(result['ui:options']).to.have.property('anotherOption', 123);
    });

    it('should exclude known properties from ui:options', () => {
      const result = MemorableDateUI({
        title: 'Test Date',
        required: true,
        errorMessages: {},
        dataDogHidden: true,
      });

      expect(result['ui:options']).to.not.have.property('title');
      expect(result['ui:options']).to.not.have.property('required');
      expect(result['ui:options']).to.not.have.property('errorMessages');
      expect(result['ui:options']).to.not.have.property('dataDogHidden');
    });
  });

  describe('dataDogHidden handling', () => {
    it('should default dataDogHidden to false', () => {
      const result = MemorableDateUI({ title: 'Test Date' });

      // dataDogHidden is only used in reviewField, not in ui:options
      expect(result['ui:options']).to.not.have.property('dataDogHidden');
    });

    it('should accept dataDogHidden as true', () => {
      const result = MemorableDateUI({
        title: 'Test Date',
        dataDogHidden: true,
      });

      // dataDogHidden is extracted but not included in ui:options
      expect(result['ui:options']).to.not.have.property('dataDogHidden');
    });
  });

  describe('reviewField rendering', () => {
    it('should render review field with formatted date', () => {
      const result = MemorableDateUI({ title: 'Employment Date' });
      const ReviewField = result['ui:reviewField'];

      const mockChildren = {
        props: {
          formData: '2024-03-15',
        },
      };

      const { container } = render(<ReviewField>{mockChildren}</ReviewField>);

      expect(container.querySelector('.review-row')).to.exist;
      expect(container.querySelector('dt').textContent).to.equal(
        'Employment Date',
      );
      expect(container.querySelector('dd').textContent).to.include('March');
      expect(container.querySelector('dd').textContent).to.include('15');
      expect(container.querySelector('dd').textContent).to.include('2024');
    });

    it('should render review field without date when formData is empty', () => {
      const result = MemorableDateUI({ title: 'Employment Date' });
      const ReviewField = result['ui:reviewField'];

      const mockChildren = {
        props: {
          formData: null,
        },
      };

      const { container } = render(<ReviewField>{mockChildren}</ReviewField>);

      expect(container.querySelector('.review-row')).to.exist;
      expect(container.querySelector('dt').textContent).to.equal(
        'Employment Date',
      );
      expect(container.querySelector('dd').textContent).to.be.empty;
    });

    it('should format date in US locale with full month name', () => {
      const result = MemorableDateUI({ title: 'Test Date' });
      const ReviewField = result['ui:reviewField'];

      const mockChildren = {
        props: {
          formData: '2025-12-25',
        },
      };

      const { container } = render(<ReviewField>{mockChildren}</ReviewField>);

      const ddText = container.querySelector('dd').textContent;
      expect(ddText).to.include('December');
      expect(ddText).to.include('25');
      expect(ddText).to.include('2025');
    });

    it('should render review field with custom title', () => {
      const result = MemorableDateUI({ title: 'Custom Date Field' });
      const ReviewField = result['ui:reviewField'];

      const mockChildren = {
        props: {
          formData: '2024-01-01',
        },
      };

      const { container } = render(<ReviewField>{mockChildren}</ReviewField>);

      expect(container.querySelector('dt').textContent).to.equal(
        'Custom Date Field',
      );
    });
  });

  describe('integration with different date values', () => {
    it('should handle future dates', () => {
      const result = MemorableDateUI({ title: 'Future Date' });
      const ReviewField = result['ui:reviewField'];

      const futureDate = '2030-06-15';
      const mockChildren = {
        props: {
          formData: futureDate,
        },
      };

      const { container } = render(<ReviewField>{mockChildren}</ReviewField>);

      expect(container.querySelector('dd').textContent).to.include('June');
      expect(container.querySelector('dd').textContent).to.include('15');
      expect(container.querySelector('dd').textContent).to.include('2030');
    });

    it('should handle past dates', () => {
      const result = MemorableDateUI({ title: 'Past Date' });
      const ReviewField = result['ui:reviewField'];

      const pastDate = '1990-01-01';
      const mockChildren = {
        props: {
          formData: pastDate,
        },
      };

      const { container } = render(<ReviewField>{mockChildren}</ReviewField>);

      expect(container.querySelector('dd').textContent).to.include('January');
      expect(container.querySelector('dd').textContent).to.include('1');
      expect(container.querySelector('dd').textContent).to.include('1990');
    });

    it('should handle current date', () => {
      const result = MemorableDateUI({ title: 'Current Date' });
      const ReviewField = result['ui:reviewField'];

      const today = new Date();
      const currentDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1,
      ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const mockChildren = {
        props: {
          formData: currentDate,
        },
      };

      const { container } = render(<ReviewField>{mockChildren}</ReviewField>);

      expect(container.querySelector('dd').textContent).to.include(
        today.getFullYear().toString(),
      );
    });
  });

  describe('complete configuration', () => {
    it('should handle all options together', () => {
      const result = MemorableDateUI({
        title: 'Complete Date Field',
        required: true,
        dataDogHidden: true,
        errorMessages: {
          pattern: 'Invalid date',
          required: 'Date required',
        },
        customOption1: 'value1',
        customOption2: 42,
      });

      expect(result['ui:title']).to.equal('Complete Date Field');
      expect(result['ui:required']).to.be.true;
      expect(result['ui:webComponentField']).to.equal(VaMemorableDateField);
      expect(result['ui:validations']).to.include(validateDate);
      expect(result['ui:options']).to.have.property('customOption1', 'value1');
      expect(result['ui:options']).to.have.property('customOption2', 42);
    });
  });
});
