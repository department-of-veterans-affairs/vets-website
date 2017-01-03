import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import BenefitsRelinquishmentFields from '../../../../src/js/edu-benefits/1990/components/benefits-eligibility/BenefitsRelinquishmentFields';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';

describe('<BenefitsRelinquishmentFields>', () => {
  const data = createVeteran();
  data.benefitsRelinquished.value = 'chapter30';
  data.chapter33 = true;
  const onStateChange = sinon.spy();

  const tree = SkinDeep.shallowRender(
    <BenefitsRelinquishmentFields
        data={data}
        onStateChange={onStateChange}/>
  );

  it('should render a subsection for chapter 33', () => {
    expect(tree.everySubTree('ErrorableRadioButtons').length).to.equal(1);
  });
  it('should render a value for benefits relinquished', () => {
    expect(tree.everySubTree('ErrorableRadioButtons')[0].props.value.value).to.equal(data.benefitsRelinquished.value);
  });
  it('should call state change with benefitsChosen', () => {
    tree.everySubTree('ErrorableRadioButtons')[0].props.onValueChange(data.benefitsRelinquished);
    expect(onStateChange.calledWith('benefitsRelinquished', data.benefitsRelinquished)).to.be.true;
  });
});
