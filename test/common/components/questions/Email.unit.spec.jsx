import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Email from '../../../../src/js/common/components/questions/Email';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<Email>', () => {
  it('does not include ErrorMessage component when valid Email', () => {
    const tree = SkinDeep.shallowRender(<Email email={makeField('test@test.com')} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('sets error message when Email is invalid', () => {
    const tree = SkinDeep.shallowRender(<Email email={makeField('test', true)} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });

  it('Verify static attributes are as expected.', () => {
    const tree = SkinDeep.shallowRender(<Email email={makeField('test@test.com')} label="Email" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.label).to.equal('Email');
    expect(errorableInputs[0].props.field).to.deep.equal(makeField('test@test.com'));
  });
});
