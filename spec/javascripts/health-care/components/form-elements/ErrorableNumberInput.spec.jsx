import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import ErrorableNumberInput from '../../../../../_health-care/_js/components/form-elements/ErrorableNumberInput';
import { makeField } from '../../../../../_health-care/_js/reducers/fields';

describe('<ErrorableNumberInput>', () => {
  const testValue = makeField('');
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    it('field must be an object', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field label="test" value onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `field` of type `boolean` supplied to `ErrorableNumberInput`, expected `object`/);
    });

    it('label is required', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field={testValue} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `label` was not specified in `ErrorableNumberInput`/);
    });

    it('label must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field={testValue} label onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `label` of type `boolean` supplied to `ErrorableNumberInput`, expected `string`./);
    });

    it('min must be a string or a function', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field={testValue} label="test" min onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `min` supplied to `ErrorableNumberInput`./);
    });

    it('max must be a string or a function', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field={testValue} label="test" max onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `max` supplied to `ErrorableNumberInput`./);
    });

    it('pattern must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field={testValue} label="test" pattern onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `pattern` of type `boolean` supplied to `ErrorableNumberInput`, expected `string`./);
    });

    it('onValueChange is required', () => {
      SkinDeep.shallowRender(<ErrorableNumberInput field={testValue} label="test"/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `ErrorableNumberInput`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(<ErrorableNumberInput field={testValue} label="test" onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `ErrorableNumberInput`, expected `function`/);
    });

    it('errorMessage must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field={testValue} label="test" errorMessage onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `errorMessage` of type `boolean` supplied to `ErrorableNumberInput`, expected `string`/);
    });

    it('placeholder must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field={testValue} label="test" placeholder onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `placeholder` of type `boolean` supplied to `ErrorableNumberInput`, expected `string`/);
    });

    it('required must be a boolean', () => {
      SkinDeep.shallowRender(
        <ErrorableNumberInput field={testValue} label="test" required="hi" onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `required` of type `string` supplied to `ErrorableNumberInput`, expected `boolean`/);
    });
  });

  it('ensure value changes propagate', () => {
    let errorableInput;

    const updatePromise = new Promise((resolve, _reject) => {
      errorableInput = ReactTestUtils.renderIntoDocument(
        <ErrorableNumberInput field={testValue} label="test" onValueChange={(update) => { resolve(update); }}/>
      );
    });

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(errorableInput, 'input');
    input.value = '1';
    ReactTestUtils.Simulate.change(input);

    return expect(updatePromise).to.eventually.eql(makeField('1', true));
  });

  it('no error styles when errorMessage undefined', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableNumberInput field={testValue} label="my label" onValueChange={(_update) => {}}/>);

    // No error classes.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-label')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-message')).to.have.lengthOf(0);

    // Ensure no unnecessary class names on label w/o error..
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].props.className).to.be.undefined;

    // No error means no aria-describedby to not confuse screen readers.
    const inputs = tree.everySubTree('input');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs[0].props['aria-describedby']).to.be.undefined;
  });

  it('has error styles when errorMessage is set', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableNumberInput field={testValue} label="my label" errorMessage="error message" onValueChange={(_update) => {}}/>);

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
    expect(inputs[0].props['aria-describedby']).to.equal(errorMessages[0].props.id);
  });

  it('required=false does not have required span', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableNumberInput field={testValue} label="my label" onValueChange={(_update) => {}}/>);

    expect(tree.everySubTree('.usa-additional_text')).to.have.lengthOf(0);
  });

  it('required=true has required span', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableNumberInput field={testValue} label="my label" required onValueChange={(_update) => {}}/>);

    const requiredSpan = tree.everySubTree('.usa-additional_text');
    expect(requiredSpan).to.have.lengthOf(1);
    expect(requiredSpan[0].text()).to.equal('Required');
  });

  it('label attribute propagates', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableNumberInput field={testValue} label="my label" onValueChange={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    // Ensure label htmlFor is attached to input id.
    const inputs = tree.everySubTree('input');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs[0].props.id).to.not.be.undefined;
    expect(inputs[0].props.id).to.equal(labels[0].props.htmlFor);
  });
});
