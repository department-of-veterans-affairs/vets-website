import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import MothersMaidenName from '../../../../../_health-care/_js/components/personal-information/MothersMaidenName';

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
    const tree = SkinDeep.shallowRender(<MothersMaidenName value="Arden" onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('includes ErrorMessage prop when blank name and is required', () => {
    const tree = SkinDeep.shallowRender(<MothersMaidenName required value="" onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });

  it('excludes ErrorMessage prop when blank name and is not required', () => {
    const tree = SkinDeep.shallowRender(<MothersMaidenName value="" onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('includes ErrorMessage prop when invalid name', () => {
    const tree = SkinDeep.shallowRender(<MothersMaidenName value="#1" onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });
});
