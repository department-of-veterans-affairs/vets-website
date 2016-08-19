import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import { assert, expect } from 'chai';

import FullName from '../../../../src/js/common/components/questions/FullName';
import { makeField } from '../../../../src/js/common/model/fields';

function makeName(first, middle, last, suffix) {
  return {
    first: makeField(first, true),
    middle: makeField(middle, true),
    last: makeField(last, true),
    suffix: makeField(suffix, true)
  };
}

describe('<FullName>', () => {
  it('has sane looking features', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <FullName name={makeName('', '', '', '')}/>
    );
    assert.ok(component, 'Cannot even render component');

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputs).to.have.length(3);

    const selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select');
    expect(selects).to.have.length(1);
  });

  it('excludes ErrorMessage prop when valid name', () => {
    const tree = SkinDeep.shallowRender(<FullName name={makeName('First', '', 'Last', '')} onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(3);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('includes ErrorMessage prop when invalid name', () => {
    const tree = SkinDeep.shallowRender(<FullName name={makeName('#1', '#2', '#3', '')} onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(3);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
    expect(errorableInputs[1].props.errorMessage).to.not.be.undefined;
    expect(errorableInputs[2].props.errorMessage).to.not.be.undefined;
  });

  it('includes ErrorMessage prop with blank name', () => {
    const name = {
      first: makeField('', true),
      middle: makeField('', true),
      last: makeField('', true),
      suffix: makeField('', true)
    };

    const tree = SkinDeep.shallowRender(<FullName name={name} required onUserInput={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(3);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
    expect(errorableInputs[1].props.errorMessage).to.be.undefined;
    expect(errorableInputs[2].props.errorMessage).to.not.be.undefined;
  });
});
