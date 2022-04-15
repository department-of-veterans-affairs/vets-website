import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import OtherVADebts from '../../components/OtherVADebts';

describe('other va debts component', () => {
  it('should exist', () => {
    const moduleName = 'MCP';

    const otherDebts = render(<OtherVADebts module={moduleName} />);
    expect(otherDebts.getByTestId('other-va-debts-head')).to.exist;
  });
});
