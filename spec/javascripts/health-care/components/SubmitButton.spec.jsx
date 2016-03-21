import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import SubmitButton from '../../../../_health-care/_js/components/SubmitButton';

describe('<SubmitButton>', () => {
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
      SkinDeep.shallowRender(<SubmitButton/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onButtonClick` was not specified in `SubmitButton`/);
    });

    it('onButtonClick must be a function', () => {
      SkinDeep.shallowRender(
        <SubmitButton onButtonClick/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onButtonClick` of type `boolean` supplied to `SubmitButton`, expected `function`/);
    });
  });

  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(<SubmitButton/>);
    const buttons = tree.everySubTree('button');
    expect(buttons).to.have.lengthOf(1);
  });

  it('calls handleSubmit() on click', () => {
    let submitButton;

    const updatePromise = new Promise((resolve, _reject) => {
      submitButton = ReactTestUtils.renderIntoDocument(
        <SubmitButton onButtonClick={() => { resolve(true); }}/>
      );
    });

    const button = ReactTestUtils.findRenderedDOMComponentWithTag(submitButton, 'button');
    ReactTestUtils.Simulate.click(button);

    return expect(updatePromise).to.eventually.eql(true);
  });
});
