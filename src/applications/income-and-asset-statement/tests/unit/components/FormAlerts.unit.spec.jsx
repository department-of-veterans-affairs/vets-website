import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  RequestPropertyOrBusinessIncomeFormAlert,
  RequestFarmIncomeFormAlert,
} from '../../../components/FormAlerts';

describe('pension <RequestPropertyOrBusinessIncomeFormAlert>', () => {
  it('should render', () => {
    const { container } = render(<RequestPropertyOrBusinessIncomeFormAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.attr('status', 'warning');
  });
});

describe('pension <RequestFarmIncomeFormAlert>', () => {
  it('should render', () => {
    const { container } = render(<RequestFarmIncomeFormAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.attr('status', 'warning');
  });
});
