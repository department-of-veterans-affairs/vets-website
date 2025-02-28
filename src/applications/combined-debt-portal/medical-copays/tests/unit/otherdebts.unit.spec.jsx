import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OtherVADebts from '../../../combined/components/OtherVADebts';
import { APP_TYPES } from '../../../combined/utils/helpers';

describe('other va debts component', () => {
  it('should exist', () => {
    const moduleName = APP_TYPES.DEBT;

    const otherDebts = render(
      <BrowserRouter>
        <OtherVADebts module={moduleName} />
      </BrowserRouter>,
    );
    expect(otherDebts.getByTestId('other-va-debt-body')).to.exist;
  });
  it('should exist', () => {
    const moduleName = APP_TYPES.COPAY;

    const otherDebts = render(
      <BrowserRouter>
        <OtherVADebts module={moduleName} />
      </BrowserRouter>,
    );
    expect(otherDebts.getByTestId('other-va-copay-body')).to.exist;
  });
  it('should not exist', () => {
    const moduleName = 'NO-MATCH';

    const otherDebts = render(
      <BrowserRouter>
        <OtherVADebts module={moduleName} />
      </BrowserRouter>,
    );
    expect(otherDebts.queryByTestId('other-va-copay-body')).to.not.exist;
  });
});
