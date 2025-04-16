import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import CurrencyWidget from '../../../src/js/review/CurrencyWidget';

describe('Schemaform review <CurrencyWidget>', () => {
  const supportsIntl = () => true;
  it('should format currency', () => {
    const screen = render(
      <CurrencyWidget value={10} supportsIntl={supportsIntl} />,
    );
    expect(screen.getByText('$10.00')).to.exist;
  });
  it('should render empty value', () => {
    const screen = render(
      <div>
        <CurrencyWidget />
      </div>,
    );
    expect(screen.container.querySelector('span').textContent).to.equal('');
  });

  it('should format currency with locale', () => {
    const screen = render(
      <CurrencyWidget
        value={12.34}
        locale="de-DE"
        currency="EUR"
        supportsIntl={supportsIntl}
      />,
    );
    expect(screen.getByText('12,34 €')).to.exist;
  });
  it('should format currency with negative value', () => {
    const screen = render(
      <CurrencyWidget value={-10} supportsIntl={supportsIntl} />,
    );
    expect(screen.getByText('-$10.00')).to.exist;
  });

  it('should format currency with zero value', () => {
    const screen = render(
      <CurrencyWidget value={0} supportsIntl={supportsIntl} />,
    );
    expect(screen.getByText('$0.00')).to.exist;
  });
  it('should format currency with large value', () => {
    const screen = render(
      <CurrencyWidget value={1234567890.12} supportsIntl={supportsIntl} />,
    );
    expect(screen.getByText('$1,234,567,890.12')).to.exist;
  });
  it('should format currency with small value', () => {
    const screen = render(
      <CurrencyWidget value={0.01} supportsIntl={supportsIntl} />,
    );
    expect(screen.getByText('$0.01')).to.exist;
  });
});
