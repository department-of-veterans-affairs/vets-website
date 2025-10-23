import { expect } from 'chai';
import { pageFocusScroll } from '../../helpers';

describe('21P-601 helpers', () => {
  describe('pageFocusScroll', () => {
    it('returns a function', () => {
      const result = pageFocusScroll();
      expect(result).to.be.a('function');
    });

    it('returns a function that can be invoked', () => {
      const scrollFunction = pageFocusScroll();

      // Should not throw when called
      expect(() => scrollFunction()).to.not.throw();
    });

    it('creates independent scroll functions', () => {
      const scrollFunction1 = pageFocusScroll();
      const scrollFunction2 = pageFocusScroll();

      // Each call creates a new function
      expect(scrollFunction1).to.not.equal(scrollFunction2);
      expect(scrollFunction1).to.be.a('function');
      expect(scrollFunction2).to.be.a('function');
    });

    it('returns function that can be called multiple times', () => {
      const scrollFunction = pageFocusScroll();

      // Should not throw on multiple calls
      expect(() => scrollFunction()).to.not.throw();
      expect(() => scrollFunction()).to.not.throw();
      expect(() => scrollFunction()).to.not.throw();
    });

    it('exports pageFocusScroll as a function', () => {
      expect(pageFocusScroll).to.be.a('function');
    });
  });
});
