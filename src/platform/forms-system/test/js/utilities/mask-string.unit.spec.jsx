import { expect } from 'chai';
import { render } from '@testing-library/react';
import { formatNumberForScreenReader } from '../../../src/js/utilities/ui/mask-string';

describe('formatNumberForScreenReader', () => {
  it('should return null for undefined input', () => {
    const result = formatNumberForScreenReader(undefined);
    expect(result).to.be.null;
  });

  it('should return null for null input', () => {
    const result = formatNumberForScreenReader(null);
    expect(result).to.be.null;
  });

  it('should return null for empty string', () => {
    const result = formatNumberForScreenReader('');
    expect(result).to.be.null;
  });

  it('should handle zero correctly', () => {
    const { container } = render(formatNumberForScreenReader(0));

    // Check visual display
    const visualElement = container.querySelector('[aria-hidden="true"]');
    expect(visualElement).to.exist;
    expect(visualElement.textContent).to.equal('0');

    // Check screen reader text
    const srElement = container.querySelector('.sr-only');
    expect(srElement).to.exist;
    expect(srElement.textContent).to.equal('0');
  });

  it('should format multiple digit numbers correctly', () => {
    const { container } = render(formatNumberForScreenReader(123));

    const visualElement = container.querySelector('[aria-hidden="true"]');
    expect(visualElement.textContent).to.equal('123');

    const srElement = container.querySelector('.sr-only');
    expect(srElement.textContent).to.equal('1 2 3');
  });

  it('should handle string number inputs correctly', () => {
    const { container } = render(formatNumberForScreenReader('456'));

    const visualElement = container.querySelector('[aria-hidden="true"]');
    expect(visualElement.textContent).to.equal('456');

    const srElement = container.querySelector('.sr-only');
    expect(srElement.textContent).to.equal('4 5 6');
  });

  it('should render with correct ARIA attributes', () => {
    const { container } = render(formatNumberForScreenReader(42));

    // Check that visual content is hidden from screen readers
    const visualElement = container.querySelector('[aria-hidden="true"]');
    expect(visualElement).to.exist;
    expect(visualElement.getAttribute('aria-hidden')).to.equal('true');

    // Check that screen reader text is properly classed
    const srElement = container.querySelector('.sr-only');
    expect(srElement).to.exist;
  });
});
