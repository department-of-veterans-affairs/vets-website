import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import BenefitsSelectionFields from '../../../src/js/edu-benefits/components/benefits-eligibility/BenefitsSelectionFields';

describe('<BenefitsSelectionFields>', () => {
  const data = {
    benefitsRelinquished: {
      value: ['chapter30'],
      dirty: false
    },
    chapter33: true
  };
  const onStateChange = sinon.spy();

  const tree = SkinDeep.shallowRender(
    <BenefitsSelectionFields
        data={data}
        onStateChange={onStateChange}/>
  );

  it('should render a subsection for chapter 33', () => {
    expect(tree.everySubTree('ErrorableRadioButtons').length).to.equal(2);
  });
  it('should render a value for benefits relinquished', () => {
    expect(tree.everySubTree('ErrorableRadioButtons')[0].props.value.value).to.equal(data.benefitsRelinquished.value);
  });
  it('should call state change with benefitsChosen', () => {
    tree.everySubTree('ErrorableRadioButtons')[0].props.onValueChange(data.benefitsRelinquished);
    expect(onStateChange.calledWith('benefitsRelinquished', data.benefitsRelinquished)).to.be.true;
  });
});
