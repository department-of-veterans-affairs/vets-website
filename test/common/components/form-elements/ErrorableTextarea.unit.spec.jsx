import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import chaiAsPromised from 'chai-as-promised';
import { default as chai, expect } from 'chai';
import sinon from 'sinon';

import ErrorableTextarea from '../../../../src/js/common/components/form-elements/ErrorableTextarea';
import { makeField } from '../../../../src/js/common/model/fields';

chai.use(chaiAsPromised);

describe('<ErrorableTextarea>', () => {
  it('ensure value changes propagate', () => {
    let errorableInput;

    const updatePromise = new Promise((resolve, _reject) => {
      errorableInput = ReactTestUtils.renderIntoDocument(
        <ErrorableTextarea field={makeField(1)} label="test" onValueChange={(update) => { resolve(update); }}/>
      );
    });

    const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(errorableInput, 'textarea');
    textarea.value = 'newValue';
    ReactTestUtils.Simulate.change(textarea);

    return expect(updatePromise).to.eventually.eql(makeField('newValue', false));
  });

  it('ensure blur makes field dirty', () => {
    let errorableInput;

    const updatePromise = new Promise((resolve, _reject) => {
      errorableInput = ReactTestUtils.renderIntoDocument(
        <ErrorableTextarea field={makeField(1)} label="test" onValueChange={(update) => { resolve(update); }}/>
      );
    });

    const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(errorableInput, 'textarea');
    ReactTestUtils.Simulate.blur(textarea);

    return expect(updatePromise).to.eventually.eql(makeField(1, true));
  });

  it('ensure value doesn\'t propagate when using more than charMax', () => {
    let valueChangedSpy = sinon.spy();

    const errorableInput = ReactTestUtils.renderIntoDocument(
      <ErrorableTextarea field={makeField(1)} charMax={1} label="test" onValueChange={valueChangedSpy}/>
    );

    errorableInput.handleChange({
      target: {
        value: 'Testing'
      }
    });

    expect(valueChangedSpy.called).to.equal(false);
  });

  it('no error styles when errorMessage undefined', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableTextarea field={makeField(1)} label="my label" onValueChange={(_update) => {}}/>);

    // No error classes.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-label')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-message')).to.have.lengthOf(0);

    // Ensure no unnecessary class names on label w/o error..
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].props.className).to.be.undefined;

    // No error means no aria-describedby to not confuse screen readers.
    const textareas = tree.everySubTree('textarea');
    expect(textareas).to.have.lengthOf(1);
    expect(textareas[0].props['aria-describedby']).to.be.undefined;
  });

  it('has error styles when errorMessage is set', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableTextarea field={makeField(1)} label="my label" errorMessage="error message" onValueChange={(_update) => {}}/>);

    // Ensure all error classes set.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(1);

    const labels = tree.everySubTree('.usa-input-error-label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    const errorMessages = tree.everySubTree('.usa-input-error-message');
    expect(errorMessages).to.have.lengthOf(1);
    expect(errorMessages[0].text()).to.equal('error message');

    const textareas = tree.everySubTree('textarea');
    expect(textareas).to.have.lengthOf(1);
    expect(textareas[0].props['aria-describedby']).to.not.be.undefined;
    expect(textareas[0].props['aria-describedby']).to.equal(errorMessages[0].props.id);
  });

  it('required=false does not have required asterisk', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableTextarea field={makeField(1)} label="my label" onValueChange={(_update) => {}}/>);

    expect(tree.everySubTree('label')[0].text()).to.equal('my label');
  });

  it('required=true has required asterisk', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableTextarea field={makeField(1)} label="my label" required onValueChange={(_update) => {}}/>);

    const label = tree.everySubTree('label');
    expect(label[0].text()).to.equal('my label*');
  });

  it('label attribute propagates', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableTextarea field={makeField(1)} label="my label" onValueChange={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    // Ensure label htmlFor is attached to input id.
    const textareas = tree.everySubTree('textarea');
    expect(textareas).to.have.lengthOf(1);
    expect(textareas[0].props.id).to.not.be.undefined;
    expect(textareas[0].props.id).to.equal(labels[0].props.htmlFor);
  });
});
