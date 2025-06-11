import React from 'react';
import { expect } from 'chai';

import createCommonStore from 'platform/startup/store';
import SkinDeep from 'skin-deep';
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
    const tree = SkinDeep.shallowRender(<ServicePeriodView {...props} />);
    const input = tree.subTree('div');
    expect(input.type).to.equal('div');
  });

  it('should populate date field', () => {
    const tree = SkinDeep.shallowRender(<ServicePeriodView {...props} />);
    const input = tree.subTree('div');
    expect(input.text()).to.equal('01/01/1900 — 01/01/1905');
  });

  it('should handle missing dateRange in formData', () => {
    // Create props without dateRange
    const propsWithoutDateRange = {
      formData: {
        serviceBranch: 'AR', // Using 'AR' as the serviceBranch instead of 'U.S. Army'
      },
    };
    const tree = SkinDeep.shallowRender(
      <ServicePeriodView {...propsWithoutDateRange} />,
    );
    const div = tree.subTree('div');
    // Should render without crashing
    expect(div.type).to.equal('div');
    // Check that it shows the service branch but empty dates
    const text = div.text();
    expect(text).to.include('—'); // Should still contain the em dash
    expect(text).to.not.include('undefined'); // Shouldn't show “undefined”
    // The from and to variables should be empty strings
    expect(text).to.equal(`U.S. Army — `);
  });
});
