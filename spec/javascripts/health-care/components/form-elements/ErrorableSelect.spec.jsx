import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import ErrorableSelect from '../../../../../_health-care/_js/components/form-elements/ErrorableSelect';

describe('<ErrorableSelect>', () => {
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
        <ErrorableSelect options={[1,2]} onUserInput={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `label` was not specified in `ErrorableSelect`/);
    });

    it('label must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label options={[1,2]} onUserInput={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `label` of type `boolean` supplied to `ErrorableSelect`, expected `string`./);
    });

    it('onUserInput is required', () => {
      SkinDeep.shallowRender(<ErrorableSelect label="test" options={[1,2]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onUserInput` was not specified in `ErrorableSelect`/);
    });

    it('onUserInput must be a function', () => {
      SkinDeep.shallowRender(<ErrorableSelect label="test" options={[1,2]} onUserInput/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onUserInput` of type `boolean` supplied to `ErrorableSelect`, expected `function`/);
    });

    it('errorMessage must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" errorMessage options={[1,2]} onUserInput={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `errorMessage` of type `boolean` supplied to `ErrorableSelect`, expected `string`/);
    });

    it('options is required', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" onUserInput={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `options` was not specified in `ErrorableSelect`/);
    });

    it('options must be an array', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" options onUserInput={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `options` of type `boolean` supplied to `ErrorableSelect`, expected `array`/);
    });

    it('value must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" options={[1,2]} value onUserInput={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `value` of type `boolean` supplied to `ErrorableSelect`, expected `string`/);
    });

    it('required must be a boolean', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" options={[1,2]} required="hi" onUserInput={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `required` of type `string` supplied to `ErrorableSelect`, expected `boolean`/);
    });
  });

  it('ensure value changes propagate', () => {
    let errorableSelect;

    const updatePromise = new Promise((resolve, _reject) => {
      errorableSelect = ReactTestUtils.renderIntoDocument(
        <ErrorableSelect label="test" options={[1, 2]} onUserInput={(update) => { resolve(update); }}/>
      );
    });

    const select = ReactTestUtils.findRenderedDOMComponentWithTag(errorableSelect, 'select');
    select.value = 'newValue';
    ReactTestUtils.Simulate.change(select);

    return expect(updatePromise).to.eventually.eql('newValue');
  });

  it('no error styles when errorMessage undefined', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={[1,2]} onUserInput={(_update) => {}}/>);

    // No error classes.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-label')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-message')).to.have.lengthOf(0);

    // Ensure no unnecessary class names on label w/o error..
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].props.className).to.be.undefined;

    // No error means no aria-describedby to not confuse screen readers.
    const selects = tree.everySubTree('select');
    expect(selects).to.have.lengthOf(1);
    expect(selects[0].props['aria-describedby']).to.be.undefined;
  });

  it('has error styles when errorMessage is set', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={[1,2]} errorMessage="error message" onUserInput={(_update) => {}}/>);

    // Ensure all error classes set.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(1);

    const labels = tree.everySubTree('.usa-input-error-label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    const errorMessages = tree.everySubTree('.usa-input-error-message');
    expect(errorMessages).to.have.lengthOf(1);
    expect(errorMessages[0].text()).to.equal('error message');

    // No error means no aria-describedby to not confuse screen readers.
    const selects = tree.everySubTree('select');
    expect(selects).to.have.lengthOf(1);
    expect(selects[0].props['aria-describedby']).to.not.be.undefined;
    expect(selects[0].props['aria-describedby']).to.equal(errorMessages[0].props.id);
  });

  it('required=false does not have required span', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={[1,2]} onUserInput={(_update) => {}}/>);

    expect(tree.everySubTree('.usa-additional_text')).to.have.lengthOf(0);
  });

  it('required=true has required span', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={[1,2]} required onUserInput={(_update) => {}}/>);

    const requiredSpan = tree.everySubTree('.usa-additional_text');
    expect(requiredSpan).to.have.lengthOf(1);
    expect(requiredSpan[0].text()).to.equal('Required');
  });

  it('label attribute propagates', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={[1,2]} onUserInput={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    // Ensure label htmlFor is attached to select id.
    const selects = tree.everySubTree('select');
    expect(selects).to.have.lengthOf(1);
    expect(selects[0].props.id).to.not.be.undefined;
    expect(selects[0].props.id).to.equal(labels[0].props.htmlFor);
  });
});
