import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SchoolSelectionReview from '../../../../src/js/edu-benefits/1990/components/school-selection/SchoolSelectionReview';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';

describe('<SchoolSelectionReview>', () => {
  it('should render', () => {
    const veteran = createVeteran();
    veteran.educationType.value = 'college';

    const tree = SkinDeep.shallowRender(
      <SchoolSelectionReview
          data={veteran}/>
    );

    expect(tree.everySubTree('table').length).to.eql(1);
  });
});
