import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { LabelField } from './label-field';

describe('LabelField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      htmlFor: 'test-field',
      label: 'Test Label',
    };
  });

  describe('rendering', () => {
    it('displays label with htmlFor attribute', () => {
      const { container } = render(<LabelField {...defaultProps} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
      expect(label).to.have.attribute('for', 'test-field');
      expect(label).to.have.attribute('label', 'Test Label');
    });

    it('shows hint text', () => {
      const props = { ...defaultProps, hint: 'This is a helpful hint' };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('hint', 'This is a helpful hint');
    });

    it('marks as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('required', 'true');
    });

    it('does not show required when false', () => {
      const props = { ...defaultProps, required: false };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('required', 'false');
    });

    it('applies custom className', () => {
      const props = { ...defaultProps, className: 'custom-label-class' };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('class', 'custom-label-class');
    });

    it('renders children inside label', () => {
      const { container } = render(
        <LabelField {...defaultProps}>
          <input type="text" id="test-field" />
        </LabelField>,
      );
      const label = container.querySelector('va-label');
      const input = label.querySelector('input');
      expect(input).to.exist;
      expect(input).to.have.attribute('type', 'text');
      expect(input).to.have.attribute('id', 'test-field');
    });

    it('renders multiple children', () => {
      const { container } = render(
        <LabelField {...defaultProps}>
          <input type="text" id="test-field" />
          <span>Additional content</span>
        </LabelField>,
      );
      const label = container.querySelector('va-label');
      const input = label.querySelector('input');
      const span = label.querySelector('span');
      expect(input).to.exist;
      expect(span).to.exist;
      expect(span.textContent).to.equal('Additional content');
    });

    it('renders without children', () => {
      const { container } = render(<LabelField {...defaultProps} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
      expect(label).to.have.attribute('label', 'Test Label');
    });
  });

  describe('accessibility', () => {
    it('associates label with form field using for attribute', () => {
      const { container } = render(
        <LabelField htmlFor="email-field" label="Email Address">
          <input type="email" id="email-field" />
        </LabelField>,
      );
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('for', 'email-field');
    });

    it('provides hint information for screen readers', () => {
      const props = {
        ...defaultProps,
        hint: 'Enter your full legal name',
      };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('hint', 'Enter your full legal name');
    });

    it('indicates required fields for screen readers', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('required', 'true');
    });

    it('handles complex label text', () => {
      const complexLabel = 'Full Name (First, Middle, Last)';
      const props = { ...defaultProps, label: complexLabel };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('label', complexLabel);
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to va-label', () => {
      const props = {
        ...defaultProps,
        'data-testid': 'custom-label',
        id: 'label-id',
        role: 'label',
      };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('data-testid', 'custom-label');
      expect(label).to.have.attribute('id', 'label-id');
      expect(label).to.have.attribute('role', 'label');
    });

    it('handles boolean props', () => {
      const props = {
        ...defaultProps,
        hidden: true,
        'aria-hidden': true,
      };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('hidden', 'true');
      expect(label).to.have.attribute('aria-hidden', 'true');
    });

    it('handles numeric props', () => {
      const props = {
        ...defaultProps,
        tabindex: -1,
      };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('tabindex', '-1');
    });
  });

  describe('edge cases', () => {
    it('handles empty label text', () => {
      const props = { ...defaultProps, label: '' };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('label', '');
    });

    it('handles null label text', () => {
      const props = { ...defaultProps, label: null };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      // Should handle null gracefully
      expect(label).to.exist;
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, label: undefined };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });

    it('handles empty htmlFor attribute', () => {
      const props = { ...defaultProps, htmlFor: '' };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('for', '');
    });

    it('handles null htmlFor attribute', () => {
      const props = { ...defaultProps, htmlFor: null };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, htmlFor: undefined };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });

    it('handles empty hint text', () => {
      const props = { ...defaultProps, hint: '' };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('hint', '');
    });

    it('handles null hint text', () => {
      const props = { ...defaultProps, hint: null };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, hint: undefined };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });

    it('handles empty className', () => {
      const props = { ...defaultProps, className: '' };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('class', '');
    });

    it('handles null className', () => {
      const props = { ...defaultProps, className: null };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, className: undefined };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });
  });

  describe('complex label scenarios', () => {
    it('handles label with special characters', () => {
      const specialLabel = 'Name & Address (Required*)';
      const props = { ...defaultProps, label: specialLabel };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('label', specialLabel);
    });

    it('handles label with HTML entities', () => {
      const entityLabel = 'Income > $50,000 & < $100,000';
      const props = { ...defaultProps, label: entityLabel };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('label', entityLabel);
    });

    it('handles label with unicode characters', () => {
      const unicodeLabel = 'Nom complet (français) - 中文名字';
      const props = { ...defaultProps, label: unicodeLabel };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('label', unicodeLabel);
    });

    it('handles very long label text', () => {
      const longLabel =
        'This is a very long label that might wrap to multiple lines in the user interface and should be handled gracefully';
      const props = { ...defaultProps, label: longLabel };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('label', longLabel);
    });

    it('handles label with newlines', () => {
      const multilineLabel = 'Line 1\nLine 2\nLine 3';
      const props = { ...defaultProps, label: multilineLabel };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('label', multilineLabel);
    });
  });

  describe('hint text scenarios', () => {
    it('handles hint with HTML-like content', () => {
      const htmlHint = 'Enter <format> like: MM/DD/YYYY';
      const props = { ...defaultProps, hint: htmlHint };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('hint', htmlHint);
    });

    it('handles hint with multiple sentences', () => {
      const multiSentenceHint =
        'Enter your full name. Include middle initial if available. Do not use abbreviations.';
      const props = { ...defaultProps, hint: multiSentenceHint };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('hint', multiSentenceHint);
    });

    it('handles hint with formatting characters', () => {
      const formattedHint = 'Format: ###-##-#### (dashes required)';
      const props = { ...defaultProps, hint: formattedHint };
      const { container } = render(<LabelField {...props} />);
      const label = container.querySelector('va-label');
      expect(label).to.have.attribute('hint', formattedHint);
    });
  });

  describe('children handling', () => {
    it('renders text node children', () => {
      const { container } = render(
        <LabelField {...defaultProps}>Simple text content</LabelField>,
      );
      const label = container.querySelector('va-label');
      expect(label.textContent).to.include('Simple text content');
    });

    it('renders React element children', () => {
      const { container } = render(
        <LabelField {...defaultProps}>
          <div>React element child</div>
        </LabelField>,
      );
      const label = container.querySelector('va-label');
      const childDiv = label.querySelector('div');
      expect(childDiv).to.exist;
      expect(childDiv.textContent).to.equal('React element child');
    });

    it('renders mixed children types', () => {
      const { container } = render(
        <LabelField {...defaultProps}>
          Text content
          <span>Span content</span>
          More text
        </LabelField>,
      );
      const label = container.querySelector('va-label');
      const span = label.querySelector('span');
      expect(span).to.exist;
      expect(label.textContent).to.include('Text content');
      expect(label.textContent).to.include('Span content');
      expect(label.textContent).to.include('More text');
    });

    it('handles null children', () => {
      const { container } = render(
        <LabelField {...defaultProps}>{null}</LabelField>,
      );
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });

    it('handles undefined', () => {
      const { container } = render(
        <LabelField {...defaultProps}>{undefined}</LabelField>,
      );
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });

    it('handles empty array children', () => {
      const { container } = render(
        <LabelField {...defaultProps}>{[]}</LabelField>,
      );
      const label = container.querySelector('va-label');
      expect(label).to.exist;
    });
  });
});
