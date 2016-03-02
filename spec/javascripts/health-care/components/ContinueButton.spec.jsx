import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import ContinueButton from '../../../../_health-care/_js/components/ContinueButton';

describe('<ContinueButton>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    // TODO: figure out why this is failing (same issue as in SSN spec)
    xit('onButtonClick is required', () => {
      SkinDeep.shallowRender(<ContinueButton/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onButtonClick` was not specified in `ContinueButton`/);
    });

    it('onButtonClick must be a function', () => {
      SkinDeep.shallowRender(
        <ContinueButton onButtonClick/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onButtonClick` of type `boolean` supplied to `ContinueButton`, expected `function`/);
    });
  });

  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(<ContinueButton/>);
    const buttons = tree.everySubTree('button');
    expect(buttons).to.have.lengthOf(1);
  });

  it('calls handleContinue() on click', (done) => {
    let continueButton;

    const updatePromise = new Promise((resolve, _reject) => {
      continueButton = ReactTestUtils.renderIntoDocument(
        <ContinueButton onButtonClick={() => { resolve('ugly'); }}/>
      );
    });

    // Check that current path has been updated
    const button = ReactTestUtils.findRenderedDOMComponentWithTag(continueButton, 'button');
    ReactTestUtils.Simulate.click(button);

    return expect(updatePromise).to.eventually.eql('ugly');
  });
});
