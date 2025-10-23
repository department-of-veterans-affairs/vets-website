import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ProgressBarField } from './progress-bar-field';

describe('ProgressBarField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      current: 2,
      total: 5,
    };
  });

  describe('rendering', () => {
    it('displays progress bar with current and total steps', () => {
      const { container } = render(<ProgressBarField {...defaultProps} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.exist;
      expect(progressBar).to.have.attribute('current', '2');
      expect(progressBar).to.have.attribute('max', '5');
    });

    it('generates default label with step information', () => {
      const { container } = render(<ProgressBarField {...defaultProps} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('label', 'Step 2 of 5');
    });

    it('uses custom label when provided', () => {
      const props = { ...defaultProps, label: 'Page 2 of 5' };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('label', 'Page 2 of 5');
    });

    it('shows custom heading', () => {
      const props = { ...defaultProps, heading: 'Form Progress' };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('heading', 'Form Progress');
    });

    it('sets default heading level to 2', () => {
      const { container } = render(<ProgressBarField {...defaultProps} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('heading-level', '2');
    });

    it('uses custom heading level', () => {
      const props = { ...defaultProps, headingLevel: '3' };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('heading-level', '3');
    });

    it('centers progress bar when requested', () => {
      const props = { ...defaultProps, centered: true };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('centered', 'true');
    });

    it('does not center progress bar by default', () => {
      const { container } = render(<ProgressBarField {...defaultProps} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('centered', 'false');
    });

    it('applies custom className', () => {
      const props = { ...defaultProps, className: 'custom-progress' };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('class', 'custom-progress');
    });
  });

  describe('accessibility', () => {
    it('sets ARIA attributes', () => {
      const { container } = render(<ProgressBarField {...defaultProps} />);
      const progressBar = container.querySelector('va-progress-bar');

      expect(progressBar).to.have.attribute('aria-valuenow', '2');
      expect(progressBar).to.have.attribute('aria-valuemax', '5');
    });

    it('provides descriptive aria-valuetext', () => {
      const { container } = render(<ProgressBarField {...defaultProps} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 2 of 5 - 40% complete',
      );
    });

    it('uses custom label in aria-valuetext', () => {
      const props = { ...defaultProps, label: 'Section 2 of 5' };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Section 2 of 5 - 40% complete',
      );
    });

    it('calculates percentage correctly for aria-valuetext', () => {
      const props = { current: 3, total: 4 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 3 of 4 - 75% complete',
      );
    });

    it('handles heading levels for proper document structure', () => {
      const props = {
        ...defaultProps,
        headingLevel: '4',
        heading: 'Form Progress',
      };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('heading-level', '4');
    });
  });

  describe('percentage calculations', () => {
    it('calculates 0% for step 0', () => {
      const props = { current: 0, total: 5 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 0 of 5 - 0% complete',
      );
    });

    it('calculates 100% for final step', () => {
      const props = { current: 5, total: 5 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 5 of 5 - 100% complete',
      );
    });

    it('rounds percentage to nearest integer', () => {
      const props = { current: 1, total: 3 }; /** @example 33.33% */
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 1 of 3 - 33% complete',
      );
    });

    it('handles fractional percentages correctly', () => {
      const props = { current: 2, total: 7 }; /** @example 28.57% */
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 2 of 7 - 29% complete',
      );
    });

    it('handles very large numbers', () => {
      const props = { current: 500, total: 1000 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 500 of 1000 - 50% complete',
      );
    });
  });

  describe('edge cases', () => {
    it('handles zero total gracefully', () => {
      const props = { current: 1, total: 0 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.exist;
      expect(progressBar).to.have.attribute('current', '1');
      expect(progressBar).to.have.attribute('max', '0');
    });

    it('handles negative current step', () => {
      const props = { current: -1, total: 5 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('current', '-1');
      expect(progressBar).to.have.attribute('aria-valuenow', '-1');
    });

    it('handles current step exceeding total', () => {
      const props = { current: 10, total: 5 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 10 of 5 - 200% complete',
      );
    });

    it('handles null value', () => {
      const props = { current: 2.5, total: 5 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('current', '2.5');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Step 2.5 of 5 - 50% complete',
      );
    });

    it('handles empty string values gracefully', () => {
      const props = { current: '', total: 5 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('current', '');
    });

    it('handles null value', () => {
      const props = { current: null, total: null };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.exist;
    });

    it('handles null value', () => {
      const props = { current: undefined, total: undefined };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.exist;
    });
  });

  describe('label variations', () => {
    it('generates proper default label format', () => {
      const props = { current: 1, total: 10 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('label', 'Step 1 of 10');
    });

    it('handles single-step process', () => {
      const props = { current: 1, total: 1 };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('label', 'Step 1 of 1');
    });

    it('preserves custom labels exactly', () => {
      const customLabel = 'Processing file 3 of 8...';
      const props = { ...defaultProps, label: customLabel };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('label', customLabel);
    });

    it('handles empty custom label', () => {
      const props = { ...defaultProps, label: '' };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      // Empty string label should fallback to default
      expect(progressBar).to.have.attribute('label', 'Step 2 of 5');
    });

    it('handles null custom label falls back to default', () => {
      const props = { ...defaultProps, label: null };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('label', 'Step 2 of 5');
    });
  });

  describe('heading level validation', () => {
    it('accepts all valid heading levels', () => {
      const levels = ['1', '2', '3', '4', '5', '6'];
      levels.forEach(level => {
        const props = { ...defaultProps, headingLevel: level };
        const { container } = render(<ProgressBarField {...props} />);
        const progressBar = container.querySelector('va-progress-bar');
        expect(progressBar).to.have.attribute('heading-level', level);
      });
    });

    it('handles string heading levels', () => {
      const props = { ...defaultProps, headingLevel: '3' };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('heading-level', '3');
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to va-progress-bar', () => {
      const props = {
        ...defaultProps,
        'data-testid': 'custom-progress',
        id: 'progress-bar-id',
        role: 'progressbar',
      };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');

      expect(progressBar).to.have.attribute('data-testid', 'custom-progress');
      expect(progressBar).to.have.attribute('id', 'progress-bar-id');
      expect(progressBar).to.have.attribute('role', 'progressbar');
    });

    it('handles boolean props correctly', () => {
      const props = {
        ...defaultProps,
        'aria-hidden': true,
        hidden: false,
      };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');

      expect(progressBar).to.have.attribute('aria-hidden', 'true');
      expect(progressBar).to.have.attribute('hidden', 'false');
    });

    it('handles numeric props correctly', () => {
      const props = {
        ...defaultProps,
        tabindex: -1,
      };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');

      expect(progressBar).to.have.attribute('tabindex', '-1');
    });
  });

  describe('complex scenarios', () => {
    it('renders multi-page form progress correctly', () => {
      const props = {
        current: 3,
        total: 7,
        heading: 'Application Progress',
        headingLevel: '2',
        label: 'Section 3 of 7 - Personal Information',
      };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');

      expect(progressBar).to.have.attribute('current', '3');
      expect(progressBar).to.have.attribute('max', '7');
      expect(progressBar).to.have.attribute('heading', 'Application Progress');
      expect(progressBar).to.have.attribute('heading-level', '2');
      expect(progressBar).to.have.attribute(
        'label',
        'Section 3 of 7 - Personal Information',
      );
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Section 3 of 7 - Personal Information - 43% complete',
      );
    });

    it('renders file upload progress correctly', () => {
      const props = {
        current: 2,
        total: 3,
        label: 'Uploading file 2 of 3',
        centered: true,
        className: 'upload-progress',
      };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');

      expect(progressBar).to.have.attribute('label', 'Uploading file 2 of 3');
      expect(progressBar).to.have.attribute('centered', 'true');
      expect(progressBar).to.have.attribute('class', 'upload-progress');
      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'Uploading file 2 of 3 - 67% complete',
      );
    });

    it('handles completion state properly', () => {
      const props = {
        current: 5,
        total: 5,
        heading: 'Complete',
        label: 'All steps completed',
      };
      const { container } = render(<ProgressBarField {...props} />);
      const progressBar = container.querySelector('va-progress-bar');

      expect(progressBar).to.have.attribute(
        'aria-valuetext',
        'All steps completed - 100% complete',
      );
    });
  });
});
