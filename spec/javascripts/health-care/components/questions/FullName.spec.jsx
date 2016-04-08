import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import FullName from '../../../../../_health-care/_js/components/questions/FullName';
import { makeField } from '../../../../../_health-care/_js/reducers/fields';

function makeName(first, middle, last, suffix) {
  return {
    first: makeField(first),
    middle: makeField(middle),
    last: makeField(last),
    suffix: makeField(suffix)
  };
}

describe('<FullName>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    // TODO(awong): consider implementing higher-order component approach using invariant
    xit('name is required', () => {
      SkinDeep.shallowRender(<FullName/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `name` was not specified in `FullName`/);
    });

    xit('name must be an object', () => {
      SkinDeep.shallowRender(<FullName name/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `name` of type `boolean` supplied to `FullName`, expected `object`/);
    });

    // TODO(awong): Why in the world does this not work?!?!
    xit('onValueChange is required', () => {
      SkinDeep.shallowRender(<FullName/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `FullName`/);
    });

    xit('onValueChange must be a function', () => {
      SkinDeep.shallowRender(
        <FullName onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `FullName`, expected `function`/);
    });
  });

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
