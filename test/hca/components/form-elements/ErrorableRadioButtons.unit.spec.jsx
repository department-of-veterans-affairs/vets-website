import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import { expect } from 'chai';

import ErrorableRadioButtons from '../../../../src/js/hca/components/form-elements/ErrorableRadioButtons';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<ErrorableRadioButtons>', () => {
  const options = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    it('label is required', () => {
      SkinDeep.shallowRender(
        <ErrorableRadioButtons options={options} value={makeField('test')} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `label` was not specified in `ErrorableRadioButtons`/);
    });

    it('label must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableRadioButtons label options={options} value={makeField('test')} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `label` of type `boolean` supplied to `ErrorableRadioButtons`, expected `string`./);
    });

    it('onValueChange is required', () => {
      SkinDeep.shallowRender(<ErrorableRadioButtons label="test" value={makeField('test')} options={options}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `ErrorableRadioButtons`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(<ErrorableRadioButtons label="test" options={options} value={makeField('test')} onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `ErrorableRadioButtons`, expected `function`/);
    });

    it('options is required', () => {
      SkinDeep.shallowRender(
        <ErrorableRadioButtons label="test" value={makeField('test')} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `options` was not specified in `ErrorableRadioButtons`/);
    });

    it('options must be an object', () => {
      SkinDeep.shallowRender(
        <ErrorableRadioButtons label="test" options value={makeField('test')} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `options` of type `boolean` supplied to `ErrorableRadioButtons`, expected an array/);
    });
  });

  it('ensure value changes propagate', (done) => {
    let myRadioButtons;

    const updatePromise = new Promise((resolve, _reject) => {
      myRadioButtons = ReactTestUtils.renderIntoDocument(
        <ErrorableRadioButtons label="test" options={options} value={makeField('test')} onValueChange={(update) => { resolve(update); }}/>
      );
      done();
    });

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(myRadioButtons, 'input');
    ReactTestUtils.Simulate.click(inputs[0]);

    return expect(updatePromise).to.eventually.eql('Yes');
  });

  it('label attribute propagates', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableRadioButtons label="my label" options={options} value={makeField('test')} onValueChange={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(3);
    expect(labels[0].text()).to.equal('my label');

    // Ensure label htmlFor is attached to label id.
    const inputs = tree.everySubTree('input');
    expect(inputs).to.have.lengthOf(2);
    expect(inputs[0].props.id).to.not.be.undefined;
    expect(inputs[0].props.id).to.equal(labels[1].props.htmlFor);
  });
});
