import React from 'react';
import SkinDeep from 'skin-deep';

import SocialSecurityNumber from '../../../../_health-care/_js/_components/social-security-number';

describe('<SocialSecurityNumber>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    it('ssn is required', () => {
      SkinDeep.shallowRender(<SocialSecurityNumber/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `ssn` was not specified in `SocialSecurityNumber`/);
    });

    it('ssn must be a string', () => {
      SkinDeep.shallowRender(<SocialSecurityNumber ssn/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `ssn` of type `boolean` supplied to `SocialSecurityNumber`, expected `string`/);
    });

    // TODO(awong): Why in the world does this not work?!?!
    xit('onValueChange is required', () => {
      SkinDeep.shallowRender(<SocialSecurityNumber/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `SocialSecurityNumber`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(
        <SocialSecurityNumber onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `SocialSecurityNumber`, expected `function`/);
    });
  });

  it('includes ErrorMessage component when invalid SSN', () => {
    const tree = SkinDeep.shallowRender(<SocialSecurityNumber ssn="123-45-6789" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.be.undefined;
  });

  it('sets error message when SSN is invalid', () => {
    const tree = SkinDeep.shallowRender(<SocialSecurityNumber ssn="123-45-678" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.errorMessage).to.not.be.undefined;
  });

  it('Verify static attributes are as expected.', () => {
    const tree = SkinDeep.shallowRender(<SocialSecurityNumber ssn="123-45-6789" onValueChange={(_update) => {}}/>);
    const errorableInputs = tree.everySubTree('ErrorableInput');
    expect(errorableInputs).to.have.lengthOf(1);
    expect(errorableInputs[0].props.label).to.equal('Social Security Number');
    expect(errorableInputs[0].props.required).to.be.true;
    expect(errorableInputs[0].props.placeholder).to.equal('xxx-xx-xxxx');
    expect(errorableInputs[0].props.value).to.equal('123-45-6789');
  });
});
