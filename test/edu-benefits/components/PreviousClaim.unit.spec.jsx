import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import PreviousClaim from '../../../src/js/edu-benefits/components/benefits-eligibility/PreviousClaim';
import { createPreviousClaim } from '../../../src/js/edu-benefits/utils/veteran';

describe('<PreviousClaim>', () => {
  it('should render someone elses service question', () => {
    let claim = createPreviousClaim();
    claim.claimType.value = 'chapter30';
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <PreviousClaim
          data={claim}
          view="expanded"
          onStateChange={onStateChange}/>
    );
    expect(tree.everySubTree('ErrorableRadioButtons').length).to.equal(1);
  });
  it('should render sponsor veteran fields', () => {
    let claim = createPreviousClaim();
    claim.claimType.value = 'chapter30';
    claim.previouslyAppliedWithSomeoneElsesService.value = 'Y';
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <PreviousClaim
          data={claim}
          view="expanded"
          onStateChange={onStateChange}/>
    );
    expect(tree.everySubTree('h4')[0].text()).to.equal('Sponsor veteran');
  });
});
