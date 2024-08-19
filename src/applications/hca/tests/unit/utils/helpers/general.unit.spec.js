import { expect } from 'chai';
import { render } from '@testing-library/react';
import { maskSSN } from '../../../../utils/helpers/general';

describe('hca `maskSSN` method', () => {
  const subject = ({ value = undefined }) => {
    const { container } = render(maskSSN(value));
    const selectors = () => ({
      visual: container.querySelector('[aria-hidden]'),
      srOnly: container.querySelector('.sr-only'),
    });
    return { selectors };
  };

  context('when a value is omitted from the function', () => {
    it('should gracefully return an element with screenreader text that declares a blank value was provided', () => {
      const { selectors } = subject({});
      const { visual, srOnly } = selectors();
      expect(visual).to.contain.text('');
      expect(srOnly).to.contain.text('is blank');
    });
  });

  context('when a value of `null` is passed to the function', () => {
    it('should gracefully return an element with screenreader text that declares a blank value was provided', () => {
      const { selectors } = subject({ value: null });
      const { visual, srOnly } = selectors();
      expect(visual).to.contain.text('');
      expect(srOnly).to.contain.text('is blank');
    });
  });

  context('when a value is provided to the function', () => {
    it('should return a masked value with the last 4 chars and screenreader text that will read the last 4 chars', () => {
      const { selectors } = subject({ value: '211111111' });
      const { visual, srOnly } = selectors();
      expect(visual).to.contain.text('●●●–●●–1111');
      expect(srOnly).to.contain.text('ending with 1 1 1 1');
    });
  });
});
