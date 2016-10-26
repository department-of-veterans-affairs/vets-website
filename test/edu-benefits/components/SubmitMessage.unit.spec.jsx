import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SubmitMessage from '../../../src/js/edu-benefits/components/SubmitMessage';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<BenefitsWaiverFields>', () => {
  const veteran = createVeteran();
  const data = {
    name: veteran.veteranFullName,
    chapter33: true,
    claimedBenefits: ['one', 'two'],
    relinquishedBenefits: 'three'
  };
  const tree = SkinDeep.shallowRender(
    <SubmitMessage {...data}/>
  );

  it('should display relinquished for chapter 33', () => {
    expect(tree.everySubTree('.claim-relinquished').length).to.equal(1);
  });

  it('should hide relinqushed for non-chapter 33', () => {
    data.chapter33 = false;
    tree.reRender(<SubmitMessage {...data}/>);
    expect(tree.everySubTree('.claim-relinquished').length).to.equal(0);
  });
});
