import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import _ from 'lodash';

import ErrorableInput from '../../../../../_health-care/_js/_components/_form-elements/ErrorableInput';

describe('<ErrorableInput>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('label is required', () => {
      SkinDeep.shallowRender(
          <ErrorableInput onValueChange={(_update) => {}}/>);
      expect(consoleStub.calledOnce).to.equal(true);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `label` was not specified in `ErrorableInput`/);
    });

    it('label must be a string', () => {
      SkinDeep.shallowRender(
          <ErrorableInput label onValueChange={(_update) => {}}/>);
      expect(consoleStub.calledOnce).to.equal(true);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `label` of type `boolean` supplied to `ErrorableInput`, expected `string`./);
    });

    it('onValueChange is required', () => {
      SkinDeep.shallowRender(<ErrorableInput label="test"/>);
      expect(consoleStub.calledOnce).to.equal(true);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `ErrorableInput`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(<ErrorableInput label="test" onValueChange/>);
      expect(consoleStub.calledOnce).to.equal(true);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `ErrorableInput`, expected `function`/);
    });

    it('errorMessage must be a string', () => {
      SkinDeep.shallowRender(
          <ErrorableInput label="test" errorMessage onValueChange={(_update) => {}}/>);
      expect(consoleStub.calledOnce).to.equal(true);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `errorMessage` of type `boolean` supplied to `ErrorableInput`, expected `string`/);
    });

    it('placeholder must be a string', () => {
      SkinDeep.shallowRender(
          <ErrorableInput label="test" placeholder onValueChange={(_update) => {}}/>);
      expect(consoleStub.calledOnce).to.equal(true);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `placeholder` of type `boolean` supplied to `ErrorableInput`, expected `string`/);
    });

    it('value must be a string', () => {
      SkinDeep.shallowRender(
          <ErrorableInput label="test" value onValueChange={(_update) => {}}/>);
      expect(consoleStub.calledOnce).to.equal(true);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `value` of type `boolean` supplied to `ErrorableInput`, expected `string`/);
    });

    it('required must be a boolean', () => {
      SkinDeep.shallowRender(
          <ErrorableInput label="test" required="hi" onValueChange={(_update) => {}}/>);
      expect(consoleStub.calledOnce).to.equal(true);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `required` of type `string` supplied to `ErrorableInput`, expected `boolean`/);
    });
  });

  it('ensure value changes propagate', () => {
    let errorableInput;

    let updatePromise = new Promise((resolve, _reject) => {
      errorableInput = ReactTestUtils.renderIntoDocument(
        <ErrorableInput label="test" onValueChange={(update) => { resolve(update); }}/>
      );
    });

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(errorableInput, 'input');
    input.value = "newValue";
    ReactTestUtils.Simulate.change(input);

    expect(updatePromise).to.eventually.equal("newValue");
  });

  it('no error styles when errorMessage undefined', () => {
    const tree = SkinDeep.shallowRender(
        <ErrorableInput label="my label" onValueChange={(_update) => {}}/>);

    // No error classes.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-label')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-message')).to.have.lengthOf(0);

    // Ensure no unnecessary class names on label w/o error..
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].props['className']).to.be.undefined;

    // No error means no aria-describedby to not confuse screen readers.
    const inputs = tree.everySubTree('input');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs[0].props['aria-describedby']).to.be.undefined;
  });

  it('has error styles when errorMessage is set', () => {
    const tree = SkinDeep.shallowRender(
        <ErrorableInput label="my label" errorMessage="error message" onValueChange={(_update) => {}}/>);

    // Ensure all error classes set.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(1);

    const labels = tree.everySubTree('.usa-input-error-label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    const errorMessages = tree.everySubTree('.usa-input-error-message');
    expect(errorMessages).to.have.lengthOf(1);
    expect(errorMessages[0].text()).to.equal('error message');

    // No error means no aria-describedby to not confuse screen readers.
    const inputs = tree.everySubTree('input');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs[0].props['aria-describedby']).to.not.be.undefined;
    expect(inputs[0].props['aria-describedby']).to.equal(errorMessages[0].props['id']);
  });

  it('required=false does not have required span', () => {
    const tree = SkinDeep.shallowRender(
        <ErrorableInput label="my label" onValueChange={(_update) => {}}/>);

    expect(tree.everySubTree('.usa-additional-text')).to.have.lengthOf(0);
  });

  it('', () => {
    const tree = SkinDeep.shallowRender(
        <ErrorableInput label="my label" required onValueChange={(_update) => {}}/>);

    const requiredSpan = tree.everySubTree('.usa-additional-text');
    expect(requiredSpan).to.have.lengthOf(1);
    expect(requiredSpan[0].text()).to.equal('Required');
  });

  it('label attribute propagates', () => {
    const tree = SkinDeep.shallowRender(
        <ErrorableInput label="my label" onValueChange={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    // Ensure label htmlFor is attached to input id.
    const inputs = tree.everySubTree('input');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs[0].props['id']).to.not.be.undefined;
    expect(inputs[0].props['id']).to.equal(labels[0].props['htmlFor']);
  });
});

