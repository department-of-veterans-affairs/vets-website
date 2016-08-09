import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import { assert, expect } from 'chai';

import MothersMaidenName from '../../../../src/client/components/veteran-information/MothersMaidenName';
import { makeField } from '../../../../src/common/fields';

describe('<MothersMaidenName>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <MothersMaidenName value="Arden" onUserInput={(_unused) => {}}/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputs).to.have.length(1);
  });

  it('excludes ErrorMessage prop when valid name', () => {
    const tree = SkinDeep.shallowRender(<MothersMaidenName value={makeField('Arden')} onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('excludes ErrorMessage prop when blank name and is required and field is NOT dirty', () => {
    const tree = SkinDeep.shallowRender(<MothersMaidenName required value={makeField('')} onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('includes ErrorMessage prop when blank name and is required and field is dirty', () => {
    const tree = SkinDeep.shallowRender(<MothersMaidenName required value={makeField('', true)} onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });

  it('excludes ErrorMessage prop when blank name and is not required', () => {
    const tree = SkinDeep.shallowRender(<MothersMaidenName value={makeField('')} onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('includes ErrorMessage prop when invalid name', () => {
    const tree = SkinDeep.shallowRender(<MothersMaidenName value={makeField('#1')} onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });
});
