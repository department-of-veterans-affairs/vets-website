import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { default as chai, expect } from 'chai';

import ProgressButton from '../../../src/client/components/ProgressButton';

chai.use(chaiAsPromised);

describe('<ProgressButton>', () => {
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
      SkinDeep.shallowRender(<ProgressButton/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onButtonClick` was not specified in `ProgressButton`/);
    });

    it('onButtonClick must be a function', () => {
      SkinDeep.shallowRender(
        <ProgressButton onButtonClick/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onButtonClick` of type `boolean` supplied to `ProgressButton`, expected `function`/);
    });

    it('buttonText must be a string', () => {
      SkinDeep.shallowRender(<ProgressButton buttonText/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `buttonText` of type `boolean` supplied to `ProgressButton`, expected `string`/);
    });

    it('buttonClass must be a string', () => {
      SkinDeep.shallowRender(
        <ProgressButton buttonClass/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `buttonClass` of type `boolean` supplied to `ProgressButton`, expected `string`/);
    });

    it('beforeText must be a string', () => {
      SkinDeep.shallowRender(
        <ProgressButton beforeText/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `beforeText` of type `boolean` supplied to `ProgressButton`, expected `string`/);
    });

    it('afterText must be a string', () => {
      SkinDeep.shallowRender(
        <ProgressButton afterText/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `afterText` of type `boolean` supplied to `ProgressButton`, expected `string`/);
    });
  });

  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(<ProgressButton/>);
    const buttons = tree.everySubTree('button');
    expect(buttons).to.have.lengthOf(1);
  });

  it('calls handle() on click', () => {
    let progressButton;

    const updatePromise = new Promise((resolve, _reject) => {
      progressButton = ReactTestUtils.renderIntoDocument(
        <ProgressButton onButtonClick={() => { resolve(true); }}/>
      );
    });

    const button = ReactTestUtils.findRenderedDOMComponentWithTag(progressButton, 'button');
    ReactTestUtils.Simulate.click(button);

    return expect(updatePromise).to.eventually.eql(true);
  });
});
