import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import moment from 'moment';

import DueDate from '../../../src/js/disability-benefits/components/DueDate';

describe('<DueDate>', () => {
  it('should render past due class', () => {
    const date = moment().subtract(1, 'day');
    const tree = SkinDeep.shallowRender(
      <DueDate
          date={date}/>
    );

    expect(tree.everySubTree('.past-due')).not.to.be.empty;
  });
  it('should render file due class', () => {
    const date = moment().add(1, 'day');
    const tree = SkinDeep.shallowRender(
      <DueDate
          date={date}/>
    );

    expect(tree.everySubTree('.due-file')).not.to.be.empty;
  });
});
