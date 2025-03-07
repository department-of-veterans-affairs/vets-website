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
});
