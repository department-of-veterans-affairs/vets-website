import React from 'react';
import moment from 'moment';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimEstimate from '../../../src/js/disability-benefits/components/ClaimEstimate';

describe('<ClaimEstimate>', () => {
  it('should render estimated date', () => {
    const date = moment().startOf('day').add(2, 'days');
    const tree = SkinDeep.shallowRender(
      <ClaimEstimate
          maxDate={date.format('YYYY-MM-DD')}/>
    );
    expect(tree.subTree('.date-estimation').text()).to.contain(`Estimated ${date.format('MMM D, YYYY')}`);
    expect(tree.subTree('.claim-completion-estimation').text()).to.contain('This date is based on claims similar to yours and is not an exact date.');
  });
  it('should render estimated date warning', () => {
    const date = moment().startOf('day').subtract(2, 'days');
    const tree = SkinDeep.shallowRender(
      <ClaimEstimate
          maxDate={date.format('YYYY-MM-DD')}/>
    );
    expect(tree.subTree('.claim-completion-estimation').text()).to.contain('We estimated your claim would be completed by now');
  });
  it('should render no estimate warning', () => {
    const tree = SkinDeep.shallowRender(
      <ClaimEstimate
          maxDate=""/>
    );
    expect(tree.subTree('.claim-completion-estimation').text()).to.contain('Estimate not available');
  });
  it('should render no estimate warning with far away date', () => {
    const date = moment().startOf('day').add(5, 'years');
    const tree = SkinDeep.shallowRender(
      <ClaimEstimate
          maxDate={date.format('YYYY-MM-DD')}/>
    );
    expect(tree.subTree('.claim-completion-estimation').text()).to.contain('Estimate not available');
  });
});
