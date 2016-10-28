import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import DateInput from '../../../../src/js/common/components/form-elements/DateInput';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<DateInput>', () => {
  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(
      <DateInput day={makeField(1)} month={makeField(12)} year={makeField(2010)} onValueChange={(_update) => {}}/>);
    expect(tree.everySubTree('ErrorableNumberInput')).to.have.lengthOf(1);
    expect(tree.everySubTree('ErrorableSelect')).to.have.lengthOf(2);
  });

  it('should hide the "day" field if the hideDayField option is true', () => {
    const tree = SkinDeep.shallowRender(
      <DateInput day={makeField(1)} month={makeField(12)} year={makeField(2010)} hideDayField onValueChange={(_update) => {}}/>);
    expect(tree.everySubTree('.form-datefield-day')).to.have.lengthOf(0);
  });

  it('should display the "day" field if the hideDayField option is false', () => {
    const tree = SkinDeep.shallowRender(
      <DateInput day={makeField(1)} month={makeField(12)} year={makeField(2010)} onValueChange={(_update) => {}}/>);
    expect(tree.everySubTree('.form-datefield-day')).to.have.lengthOf(1);
  });
});

