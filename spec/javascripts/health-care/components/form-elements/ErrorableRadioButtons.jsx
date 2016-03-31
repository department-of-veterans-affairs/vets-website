import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import RadioButtons from '../../../../../_health-care/_js/components/form-elements/RadioButtons';

describe('<RadioButtons>', () => {
  const options = [{ value: 'first', label: 'First' }, { value: 'second', label: 'Second' }];

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
        <RadioButtons options={options} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `label` was not specified in `RadioButtons`/);
    });

    it('label must be a string', () => {
      SkinDeep.shallowRender(
        <RadioButtons label options={options} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `label` of type `boolean` supplied to `RadioButtons`, expected `string`./);
    });

    it('onValueChange is required', () => {
      SkinDeep.shallowRender(<RadioButtons label="test" options={options}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `RadioButtons`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(<RadioButtons label="test" options={options} onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `RadioButtons`, expected `function`/);
    });

    it('options is required', () => {
      SkinDeep.shallowRender(
        <RadioButtons label="test" onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `options` was not specified in `RadioButtons`/);
    });

    it('options must be an object', () => {
      SkinDeep.shallowRender(
        <RadioButtons label="test" options onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `options` of type `boolean` supplied to `RadioButtons`, expected an array/);
    });
  });

  xit('ensure value changes propagate', () => {
    let myRadioButtons;

    const updatePromise = new Promise((resolve, _reject) => {
      myRadioButtons = ReactTestUtils.renderIntoDocument(
        <RadioButtons label="test" options={options} onValueChange={(update) => { resolve(update); }}/>
      );
    });

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(myRadioButtons, 'input');
    input.value = 'first';
    ReactTestUtils.Simulate.change(input);

    return expect(updatePromise).to.eventually.eql('first');
  });

  xit('label attribute propagates', () => {
    const tree = SkinDeep.shallowRender(
      <RadioButtons label="my label" options={options} onValueChange={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    // Ensure label htmlFor is attached to label id.
    const inputs = tree.everySubTree('label');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs[0].props.id).to.not.be.undefined;
    expect(inputs[0].props.id).to.equal(labels[0].props.htmlFor);
  });
});
