import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import { expect } from 'chai';

import Phone from '../../../../src/client/components/questions/Phone';
import { makeField } from '../../../../src/common/fields';

describe('<Phone>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    xit('value is required', () => {
      SkinDeep.shallowRender(<Phone/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `value` was not specified in `Phone`/);
    });

    it('value must be an object', () => {
      SkinDeep.shallowRender(<Phone value/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `value` of type `boolean` supplied to `Phone`, expected `object`/);
    });

    // TODO(awong): Why in the world does this not work?!?!
    xit('onValueChange is required', () => {
      SkinDeep.shallowRender(<Phone value={makeField('')}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `Phone`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(
        <Phone value={makeField('')} onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `Phone`, expected `function`/);
    });
  });

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
    expect(errorableInputs[0].props.placeholder).to.equal('xxxxxxxxxx');
    expect(errorableInputs[0].props.field).to.deep.equal(makeField('123-456-7890'));
  });
});
