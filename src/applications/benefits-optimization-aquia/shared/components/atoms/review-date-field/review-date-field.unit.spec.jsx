import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ReviewDateField } from './review-date-field';

describe('ReviewDateField', () => {
  describe('ISO string format', () => {
    it('should render date in long format by default', () => {
      const { container } = render(
        <ReviewDateField label="Birth Date" value="1990-01-15" />,
      );

      expect(container.textContent).to.include('Birth Date');
      expect(container.textContent).to.include('January 15, 1990');
    });

    it('should render date in short format', () => {
      const { container } = render(
        <ReviewDateField
          label="Birth Date"
          value="1990-01-15"
          format="short"
        />,
      );

      expect(container.textContent).to.include('01/15/1990');
    });
  });

  describe('Object format', () => {
    it('should render date object in long format', () => {
      const dateObj = {
        month: '01',
        day: '15',
        year: '1990',
      };

      const { container } = render(
        <ReviewDateField label="Birth Date" value={dateObj} />,
      );

      expect(container.textContent).to.include('January 15, 1990');
    });

    it('should render date object in short format', () => {
      const dateObj = {
        month: '01',
        day: '15',
        year: '1990',
      };

      const { container } = render(
        <ReviewDateField label="Birth Date" value={dateObj} format="short" />,
      );

      expect(container.textContent).to.include('01/15/1990');
    });

    it('should render date without day', () => {
      const dateObj = {
        month: '01',
        year: '1990',
      };

      const { container } = render(
        <ReviewDateField label="Service Date" value={dateObj} />,
      );

      expect(container.textContent).to.include('January 1990');
    });

    it('should render date without day in short format', () => {
      const dateObj = {
        month: '01',
        year: '1990',
      };

      const { container } = render(
        <ReviewDateField label="Service Date" value={dateObj} format="short" />,
      );

      expect(container.textContent).to.include('01/01/1990');
    });
  });

  describe('Empty values', () => {
    it('should render empty text when value is null', () => {
      const { container } = render(
        <ReviewDateField label="Birth Date" value={null} />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should render empty text when value is undefined', () => {
      const { container } = render(
        <ReviewDateField label="Birth Date" value={undefined} />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should render custom empty text', () => {
      const { container } = render(
        <ReviewDateField
          label="Birth Date"
          value={null}
          emptyText="Date not available"
        />,
      );

      expect(container.textContent).to.include('Date not available');
    });

    it('should hide when value is empty and hideWhenEmpty is true', () => {
      const { container } = render(
        <ReviewDateField label="Birth Date" value={null} hideWhenEmpty />,
      );

      expect(container.querySelector('.review-row')).to.not.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle single-digit months and days', () => {
      const dateObj = {
        month: '3',
        day: '5',
        year: '2000',
      };

      const { container } = render(
        <ReviewDateField label="Date" value={dateObj} />,
      );

      expect(container.textContent).to.include('March 5, 2000');
    });

    it('should handle December dates', () => {
      const { container } = render(
        <ReviewDateField label="Date" value="2000-12-31" />,
      );

      expect(container.textContent).to.include('December 31, 2000');
    });

    it('should handle leap year dates', () => {
      const { container } = render(
        <ReviewDateField label="Date" value="2000-02-29" />,
      );

      expect(container.textContent).to.include('February 29, 2000');
    });
  });
});
