import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SocialSecurityNumber from '../../../../src/js/common/components/questions/SocialSecurityNumber';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<SocialSecurityNumber>', () => {
  it('excludes ErrorMessage prop when valid SSN', () => {
    const tree = SkinDeep.shallowRender(<SocialSecurityNumber ssn={makeField('555-12-6789')} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('sets error message when SSN is invalid', () => {
    const tree = SkinDeep.shallowRender(<SocialSecurityNumber ssn={makeField('123-45-678', true)} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });

  it('Verify static attributes are as expected.', () => {
    const tree = SkinDeep.shallowRender(<SocialSecurityNumber ssn={makeField('555-12-6789')} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.label).to.equal('Social Security Number');
    expect(errorableInputs[0].props.required).to.be.true;
    expect(errorableInputs[0].props.field).to.deep.equal(makeField('555-12-6789'));
  });
});
