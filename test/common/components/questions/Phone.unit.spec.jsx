import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Phone from '../../../../src/js/common/components/questions/Phone';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<Phone>', () => {
  it('includes ErrorMessage component when invalid phone number', () => {
    const tree = SkinDeep.shallowRender(<Phone value={makeField('123-456-7890')} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('sets error message when phone number is invalid', () => {
    const tree = SkinDeep.shallowRender(<Phone value={makeField('123-45-6789', true)} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });

  it('Verify static attributes are as expected.', () => {
    const tree = SkinDeep.shallowRender(<Phone value={makeField('123-456-7890')} label="Phone" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.label).to.equal('Phone');
    expect(errorableInputs[0].props.field).to.deep.equal(makeField('123-456-7890'));
  });
});
