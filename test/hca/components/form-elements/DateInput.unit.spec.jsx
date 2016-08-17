import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import DateInput from '../../../../src/js/hca/components/form-elements/DateInput';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<DateInput>', () => {
  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(
      <DateInput day={makeField(1)} month={makeField(12)} year={makeField(2010)} onValueChange={(_update) => {}}/>);
    expect(tree.everySubTree('ErrorableNumberInput')).to.have.lengthOf(1);
    expect(tree.everySubTree('ErrorableSelect')).to.have.lengthOf(2);
  });
});
