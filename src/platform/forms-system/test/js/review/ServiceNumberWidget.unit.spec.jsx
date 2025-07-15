import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ServiceNumberWidget from '../../../src/js/review/ServiceNumberWidget';

describe('Schemaform review <ServiceNumberWidget>', () => {
  it('should format when includes a dash', () => {
    const { container } = render(<ServiceNumberWidget value="O-662062" />);
    expect(container.textContent).to.equal('O-6●●●●●starting with O - 6');
  });

  it('should format when includes a dash', () => {
    const { container } = render(<ServiceNumberWidget value="0 765 497" />);
    expect(container.textContent).to.equal('0 7●● ●●●starting with 0   7');
  });

  it('should not format when 2 characters ignoring dashes', () => {
    const { container } = render(<ServiceNumberWidget value="39 563 856" />);
    expect(container.textContent).to.equal('39 ●●● ●●●starting with 3 9');
  });

  it('should not format when 2 characters ignoring spaces', () => {
    const { container } = render(<ServiceNumberWidget value="ER 11 229 770" />);
    expect(container.textContent).to.equal('ER ●● ●●● ●●●starting with E R');
  });

  it('should render empty value', () => {
    const { container } = render(<ServiceNumberWidget />);

    // The only time it will equal '' is when initializing it with value=''
    expect(container.textContent).to.equal('');
  });
});
