import React from 'react';
import { expect } from 'chai';

import createCommonStore from 'platform/startup/store';
import { render } from '@testing-library/react';
import ServicePeriodView from '../../components/ServicePeriodView';

const store = createCommonStore();
const defaultProps = store.getState();
defaultProps.dateRange = {
  from: '1900-01-01',
  to: '1905-01-01',
};

const props = {
  formData: {
    dateRange: {
      from: '1900-01-01',
      to: '1905-01-01',
    },
  },
};

describe('Pre-need ServicePeriodView Component', () => {
  it('should render', () => {
    const { container } = render(<ServicePeriodView {...props} />);
    const div = container.querySelector('div');
    expect(div).to.exist;
  });

  it('should populate date field', () => {
    const { container } = render(<ServicePeriodView {...props} />);
    const div = container.querySelector('div');
    expect(div.textContent).to.include('01/01/1900 — 01/01/1905');
  });

  it('should handle missing dateRange in formData', () => {
    // Create props without dateRange
    const propsWithoutDateRange = {
      formData: {
        serviceBranch: 'AR', // Using 'AR' as the serviceBranch instead of 'U.S. Army'
      },
    };
    const { container } = render(
      <ServicePeriodView {...propsWithoutDateRange} />,
    );
    const div = container.querySelector('div');
    // Should render without crashing
    expect(div).to.exist;
    // Check that it shows the service branch but empty dates
    const text = div.textContent;
    expect(text).to.include('—'); // Should still contain the em dash
    expect(text).to.not.include('undefined'); // Shouldn't show "undefined"
    // The from and to variables should be empty strings
    expect(text).to.equal(`U.S. Army — `);
  });
});
