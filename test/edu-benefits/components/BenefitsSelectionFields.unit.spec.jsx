import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import BenefitsSelectionFields from '../../../src/js/edu-benefits/components/BenefitsSelectionFields';

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
    expect(tree.everySubTree('ErrorableRadioButtons').length).to.equal(1);
  });
  it('should render four checkboxes', () => {
    expect(tree.everySubTree('ErrorableCheckbox')[0].props.name).to.equal('chapter33');
    expect(tree.everySubTree('ErrorableCheckbox')[1].props.name).to.equal('chapter30');
    expect(tree.everySubTree('ErrorableCheckbox')[2].props.name).to.equal('chapter1606');
    expect(tree.everySubTree('ErrorableCheckbox')[3].props.name).to.equal('chapter32');
  });
  it('should render a value for benefits relinquished', () => {
    expect(tree.everySubTree('ErrorableRadioButtons')[0].props.value.value).to.equal(data.benefitsRelinquished.value);
  });
  it('should call state change with benefitsChosen', () => {
    tree.everySubTree('ErrorableRadioButtons')[0].props.onValueChange(data.benefitsRelinquished);
    expect(onStateChange.calledWith('benefitsRelinquished', data.benefitsRelinquished)).to.be.true;
  });
});
