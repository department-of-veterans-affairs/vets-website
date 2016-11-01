import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ContributionsFields from '../../../src/js/edu-benefits/components/military-history/ContributionsFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<ContributionsFields>', () => {
  it('should set ExpandingGroup closed', () => {
    let data = createVeteran();
    data.activeDutyRepaying = false;
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ContributionsFields
          data={data}
          onStateChange={onStateChange}/>
    );

    expect(tree.subTree('ExpandingGroup').props.open).to.be.false;
  });
  it('should set ExpandingGroup open', () => {
    let data = createVeteran();
    data.activeDutyRepaying = true;
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <ContributionsFields
          data={data}
          onStateChange={onStateChange}/>
    );

    expect(tree.subTree('ExpandingGroup').props.open).to.be.true;
  });
});
