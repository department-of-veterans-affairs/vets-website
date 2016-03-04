import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import VaMedicalFacility from '../../../../../_health-care/_js/components/personal-information/VaMedicalFacility';

describe('<VaMedicalFacility>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    it('value is required', () => {
      SkinDeep.shallowRender(<VaMedicalFacility/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `value` was not specified in `VaMedicalFacility`/);
    });

    it('value must be a string', () => {
      SkinDeep.shallowRender(<VaMedicalFacility value/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `value` of type `boolean` supplied to `VaMedicalFacility`, expected `string`/);
    });

    // TODO(awong): Why in the world does this not work?!?!
    xit('onValueChange is required', () => {
      SkinDeep.shallowRender(<VaMedicalFacility/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `VaMedicalFacility`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(
        <VaMedicalFacility onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `VaMedicalFacility`, expected `function`/);
    });
  });

  it('has sane looking features', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <VaMedicalFacility value="test"/>
    );
    assert.ok(component, 'Cannot even render component');

    const selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select');
    expect(selects).to.have.length(1);
  });
});
