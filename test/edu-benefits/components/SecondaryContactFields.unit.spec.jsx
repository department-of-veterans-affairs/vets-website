import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import SecondaryContactFields from '../../../src/js/edu-benefits/components/personal-information/SecondaryContactFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<SecondaryContactFields>', () => {
  it('should not render address for true same address field', () => {
    let data = createVeteran();
    data.secondaryContact.sameAddress = true;
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <SecondaryContactFields
          data={data}
          onStateChange={onStateChange}/>
    );

    expect(tree.everySubTree('Address').length).to.equal(0);
  });
  it('should render school address for false same address field', () => {
    let data = createVeteran();
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <SecondaryContactFields
          data={data}
          onStateChange={onStateChange}/>
    );

    expect(tree.everySubTree('Address').length).to.equal(1);
  });
});
