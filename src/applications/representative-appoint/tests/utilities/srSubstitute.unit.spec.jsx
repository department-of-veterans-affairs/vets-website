import { expect } from 'chai';
import { render } from '@testing-library/react';
import { srSubstitute } from '../../utilities/helpers';

describe('srSubstitute', () => {
  it('should make the first argument ignored by screen readers', () => {
    const { getByText } = render(srSubstitute('AAA', 'BBB'));
    expect(getByText('AAA')).to.have.attribute('aria-hidden', 'true');
  });

  it('should make the second argument screen reader only', () => {
    const { container } = render(srSubstitute('AAA', 'BBB'));
    expect(container.querySelector('.sr-only')).to.contain.text('BBB');
  });
});
