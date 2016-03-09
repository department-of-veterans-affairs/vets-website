import React from 'react';
import SkinDeep from 'skin-deep';

import Email from '../../../../../_health-care/_js/components/questions/Email';

describe('<Email>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    it('value is required', () => {
      SkinDeep.shallowRender(<Email/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `value` was not specified in `Email`/);
    });

    it('value must be a string', () => {
      SkinDeep.shallowRender(<Email value/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `value` of type `boolean` supplied to `Email`, expected `string`/);
    });

    // TODO(awong): Why in the world does this not work?!?!
    xit('onValueChange is required', () => {
      SkinDeep.shallowRender(<Email/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `Email`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(
        <Email onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `Email`, expected `function`/);
    });
  });

  it('does not include ErrorMessage component when valid Email', () => {
    const tree = SkinDeep.shallowRender(<Email value="test@test.com" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('sets error message when Email is invalid', () => {
    const tree = SkinDeep.shallowRender(<Email value="test" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });

  it('Verify static attributes are as expected.', () => {
    const tree = SkinDeep.shallowRender(<Email value="test@test.com" label="Email" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.label).to.equal('Email');
    expect(errorableInputs[0].props.placeholder).to.equal('x@x.xxx');
    expect(errorableInputs[0].props.value).to.equal('test@test.com');
  });
});
