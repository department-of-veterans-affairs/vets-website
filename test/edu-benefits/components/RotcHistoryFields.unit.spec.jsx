import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import RotcHistoryFields from '../../../src/js/edu-benefits/components/RotcHistoryFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<RotcHistoryFields>', () => {
  it('should render', () => {
    let data = createVeteran();

    const tree = SkinDeep.shallowRender(
      <RotcHistoryFields data={data}/>
    );

    expect(tree.everySubTree('fieldset').length).to.equal(1);
  });
});
