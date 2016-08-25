import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import BenefitsSelectionFields from '../../../src/js/edu-benefits/components/BenefitsSelectionFields';

describe('<BenefitsSelectionFields>', () => {
  const data = {
    benefitsChosen: {
      value: 'chapter33',
      dirty: false
    }
  };
  const onStateChange = sinon.spy();

  const tree = SkinDeep.shallowRender(
    <BenefitsSelectionFields
        data={data}
        onStateChange={onStateChange}/>
  );

  it('should render a subsection for chapter 33', () => {
    expect(tree.everySubTree('RadioButtonsSubSection').length).to.equal(1);
    expect(tree.everySubTree('RadioButtonsSubSection')[0].props.showIfValueChosen).to.equal('chapter33');
  });
  it('should render four checkboxes', () => {
    expect(tree.everySubTree('ErrorableCheckbox')[0].props.name).to.equal('chapter30Relinquished');
    expect(tree.everySubTree('ErrorableCheckbox')[1].props.name).to.equal('chapter1606Relinquished');
    expect(tree.everySubTree('ErrorableCheckbox')[2].props.name).to.equal('chapter1607Relinquished');
    expect(tree.everySubTree('ErrorableCheckbox')[3].props.name).to.equal('notEligible');
  });
  it('should render a value for benefits chosen', () => {
    expect(tree.everySubTree('ErrorableRadioButtons')[0].props.value.value).to.equal(data.benefitsChosen.value);
  });
  it('should call state change with benefitsChosen', () => {
    tree.everySubTree('ErrorableRadioButtons')[0].props.onValueChange(data.benefitsChosen);
    expect(onStateChange.calledWith('benefitsChosen', data.benefitsChosen)).to.be.true;
  });
});
