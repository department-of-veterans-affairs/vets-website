import React from 'react';
import SkinDeep from 'skin-deep';

import Email from '../../../../../_health-care/_js/components/questions/Email';
import { makeField } from '../../../../../_health-care/_js/reducers/fields';

describe('<Email>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    xit('email is required', () => {
      SkinDeep.shallowRender(<Email/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `email` was not specified in `Email`/);
    });

    it('email must be a object', () => {
      SkinDeep.shallowRender(<Email email/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `email` of type `boolean` supplied to `Email`, expected `object`/);
    });

    // TODO(awong): Why in the world does this not work?!?!
    xit('onValueChange is required', () => {
      SkinDeep.shallowRender(<Email email={makeField('x')}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `Email`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(
        <Email email={makeField('x')} onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `Email`, expected `function`/);
    });
  });

  it('does not include ErrorMessage component when valid Email', () => {
    const tree = SkinDeep.shallowRender(<Email email={makeField('test@test.com')} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('sets error message when Email is invalid', () => {
    const tree = SkinDeep.shallowRender(<Email email={makeField('test')} onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });

  it('Verify static attributes are as expected.', () => {
    const tree = SkinDeep.shallowRender(<Email email={makeField('test@test.com')} label="Email" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableTextInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.label).to.equal('Email');
    expect(errorableInputs[0].props.placeholder).to.equal('x@x.xxx');
    expect(errorableInputs[0].props.field).to.deep.equal(makeField('test@test.com'));
  });
});
