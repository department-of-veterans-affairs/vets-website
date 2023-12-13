import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  DowntimeWarning,
  ServerErrorAlert,
  ShortFormAlert,
  DependentSIPWarning,
} from '../../../../components/FormAlerts';

describe('hca <DowntimeWarning>', () => {
  it('should render', () => {
    const { container } = render(<DowntimeWarning />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.text(
      'The health care application is down for maintenance',
    );
  });
});

describe('hca <ServerErrorAlert>', () => {
  it('should render', () => {
    const { container } = render(<ServerErrorAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.text('Something went wrong on our end');
  });
});

describe('hca <ShortFormAlert>', () => {
  it('should render', () => {
    const { container } = render(<ShortFormAlert />);
    const selector = container.querySelector(
      '[data-testid="hca-short-form-alert"]',
    );
    expect(selector).to.exist;
    expect(selector).to.have.attr(
      'trigger',
      'You’re filling out a shortened application!',
    );
  });
});

describe('hca <DependentSIPWarning>', () => {
  it('should render', () => {
    const { container } = render(<DependentSIPWarning />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.attr('status', 'warning');
  });
});
