import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import SchoolSelectionFields from '../../../../src/js/edu-benefits/1990/components/school-selection/SchoolSelectionFields';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';

describe('<SchoolSelectionFields>', () => {
  xit('should not render school address for empty education type', () => {
    const data = createVeteran();
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <SchoolSelectionFields
        data={data}
        initializeFields={f => f}
        onStateChange={onStateChange}/>
    );

    expect(tree.everySubTree('Address').length).to.equal(0);
  });

  it('should render school address for college education type', () => {
    const data = createVeteran();
    data.educationType.value = 'college';
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <SchoolSelectionFields
        data={data}
        initializeFields={f => f}
        onStateChange={onStateChange}/>
    );

    expect(tree.everySubTree('Address').length).to.equal(1);
  });
});
