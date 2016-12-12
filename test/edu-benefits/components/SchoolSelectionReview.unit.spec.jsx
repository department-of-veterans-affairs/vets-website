import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SchoolSelectionReview from '../../../src/js/edu-benefits/components/school-selection/SchoolSelectionReview';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<SchoolSelectionReview>', () => {
  it('should render', () => {
    let veteran = createVeteran();
    veteran.educationType.value = 'college';

    const tree = SkinDeep.shallowRender(
      <SchoolSelectionReview
          data={veteran}/>
    );

    expect(tree.everySubTree('table').length).to.eql(1);
  });
});
