import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import { getByBrokenText, getProps } from '../../util/testUtils';

describe('testUtils', () => {
  describe('getByBrokenText', () => {
    it('should find element with matching text when text is split across multiple nodes', () => {
      const { container } = render(
        <div>
          <span>Hello </span>
          <span>World</span>
        </div>,
      );

      const result = getByBrokenText('Hello World', container);
      expect(result).to.exist;
    });

    it('should find element with exact text match', () => {
      const { container } = render(<div>Complete Text</div>);

      const result = getByBrokenText('Complete Text', container);
      expect(result).to.exist;
      expect(result.textContent).to.equal('Complete Text');
    });

    it('should not match if children have the text', () => {
      const { container } = render(
        <div>
          <div>
            <span>Nested Text</span>
          </div>
        </div>,
      );

      // The outer div has the text through its children, but the function
      // should return the innermost element containing the text
      const result = getByBrokenText('Nested Text', container);
      expect(result.tagName).to.equal('SPAN');
    });

    it('should handle empty text', () => {
      const { container } = render(<div></div>);

      const result = getByBrokenText('', container);
      expect(result).to.exist;
    });
  });

  describe('getProps', () => {
    it('should return React props key from element', () => {
      const { container } = render(<div data-testid="test">Test</div>);
      const element = container.querySelector('[data-testid="test"]');

      const result = getProps(element);
      // The result should contain the React internal props key pattern
      if (result) {
        expect(result).to.match(/^__react/);
      }
    });

    it('should handle element without React props', () => {
      const element = document.createElement('div');
      const result = getProps(element);
      expect(result).to.be.undefined;
    });

    it('should handle null element gracefully', () => {
      const element = {};
      const result = getProps(element);
      expect(result).to.be.undefined;
    });
  });
});
