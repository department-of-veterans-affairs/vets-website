import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import BenefitsHistoryFields from '../../../src/js/edu-benefits/components/military-history/BenefitsHistoryFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<BenefitsHistoryFields>', () => {
  it('should render date questions', () => {
    let data = createVeteran();
    data.activeDutyRepaying.value = 'Y';
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <BenefitsHistoryFields
          data={data}
          onStateChange={onStateChange}/>
    );

    expect(tree.everySubTree('DateInput').length).to.equal(2);
  });
  it('should not render date questions', () => {
    let data = createVeteran();
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <BenefitsHistoryFields
          data={data}
          onStateChange={onStateChange}/>
    );

    expect(tree.everySubTree('DateInput').length).to.equal(0);
  });
});
